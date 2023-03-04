# MySQL优化记录

## 简介

> 背景介绍

前同事遇到一个比较棘手的问题，由于是遗留系统，没有设计统计表，现实需求又需要根据众多条件进行统计，关联到多个大表200W+。经过几轮方案调整，最终优化效果是没有建统计表，查询速度从之前的20秒+，减少到2秒以内。基本满足业务需求。

## 复盘

最开始怀疑是对方自建数据库和磁盘导致查询缓慢。经对方同意，将数据导入到本地SSD进行，顺便升级数据库到8.0进行测试，发现同样查询缓慢。遂开始进行索引层优化面再确认（因为之前已经确认过），索引基本都走了。没有多大优化空间了。

### 方案一

建立统计表来实现单表查询，历史数据按天处理。经过测算，发现跑一个项目、一天的数据需要2秒，系统有8000个项目，算下来就是16000秒，折算下来就是4个小时。系统有500天的存量数据。简单估算下，需要83天。发现该方案不太合理。

### 方案二

由于最近正在处理大数据相关业务，也做过基于的`RDD`算子的`spark`程序优化。受到了一些启发，想想是否可以按照`RDD`优化的思路来解决慢查询的问题。先将大表数据进行过滤，统计出每个维度的关键数据，然后根据`项目ID`组合叠加多个维度的数据（行转列），最后再关联上项目的基础数据，就完成了业务查询。

## 相关截图记录

数据量概览

![数据量概览](http://pic.qn.prodapi.cn/typora/hexo/thomas/8dbki.png)

慢查询结果耗时

![查询慢结果](http://pic.qn.prodapi.cn/typora/hexo/thomas/tnlyk.png)

慢查询对应的执行计划

![explain-slow](http://pic.qn.prodapi.cn/typora/hexo/thomas/4qfe7.png)

优化后查询耗时

![查询优化结果](http://pic.qn.prodapi.cn/typora/hexo/thomas/w88k6.png)

优化后查询执行计划

![explain-fast](http://pic.qn.prodapi.cn/typora/hexo/thomas/nrsiz.png)

### SQL记录

优化前查询

```sql

select tt1.id, tt1.department_name ,tt1.hospital_name,tt1.province, tt1.city 
,(
select count(1) as num
         from interaction_message t left join user u 
         on t.sender_id = u.id
      where 1=1
      and date(t.created_time) between '2020-05-01'
    and '2020-05-31'
          and u.project_id = tt1.id
          and u.user_type in (1,4)
          and u.name != '科室小助手'
          and t.content_type in ('I', 'T', 'VOICE')
) messages_yhry
, 0 messages_nums_yhry
,(
select count(*) as num
         from interaction_message t left join user u 
         on t.receiver_id = u.id
      where 1=1
      and date(t.created_time) between '2020-05-01'
    and '2020-05-31'
          and u.project_id = tt1.id
          and u.user_type in (1,4)
          and t.content_type in ('I', 'T', 'VOICE')
          and u.name != '科室小助手'
) messages_hz
,0 messages_nums_hz
,(
select  count(1) as send_num
      from health_education_instance t ,user u
      where t.creator = u.id
      and u.name != '科室小助手'
      and 1=1 
      and date(t.created_time) between '2020-05-01'
    and '2020-05-31'
      and t.project_id = tt1.id
) edu_send_nums
,(
select count(*) as read_num
      from health_education_instance t
      left join user u on t.creator = u.id
      where 1=1 
      and date(t.created_time) between '2020-05-01'
    and '2020-05-31'
      and t.project_id = tt1.id
      and u.name != '科室小助手'
      and t.read_time is not null
) edu_read_nums
,(
select count(*) as num
         from q_questionnaire_send_info t
         INNER JOIN q_questionnaire_info info on t.questionnaire_id=info.id and info.type=0 and info.deleted=0
          left join user u 
         on t.send_id = u.id
      where  1=1
and date(t.send_time) between '2020-05-01'
    and '2020-05-31'
          and u.project_id = tt1.id
          and u.user_type = 1
          and u.name != '科室小助手'
) questions_send_nums
,(
select count(1) as num
         from q_questionnaire_send_info t
         INNER JOIN q_questionnaire_info info on t.questionnaire_id=info.id and info.type=0 and info.deleted=0
          left join user u 
         on t.send_id = u.id
      where  1=1
and date(t.send_time) between '2020-05-01'
    and '2020-05-31'
      and t.answer_time is not null
          and u.project_id = tt1.id
          and u.user_type = 1
) questions_receive_nums
from project tt1 where  1=1 and tt1.id != 1 and tt1.deleted = 0 and tt1.type = 2
limit 1, 10;

```

优化后查询

```sql
select 

--   '2017-08-10' date,
  t.project_id,
  p.department_name,
  p.hospital_name,
  p.province,
  p.city,
  sum(messages_yhry) messages_yhry,
  sum(messages_hz) messages_hz,
  sum(edu_send_nums) edu_send_nums,
  sum(edu_read_nums) edu_read_nums,
  sum(questions_send_nums) questions_send_nums,
  sum(questions_receive_nums) questions_receive_nums

from (

  select '2017-08-10' date, t.project_id project_id, count(1) 'messages_yhry', 0 'messages_hz', 0 'edu_send_nums', 0 'edu_read_nums', 0 'questions_send_nums', 0 'questions_receive_nums'
  from interaction_message t left join user u on t.sender_id = u.id
  where 1=1
  and t.created_time between '2020-05-01 00:00:00' and '2020-05-31 23:59:59'
  and u.user_type in (1,4)
  and u.name != '科室小助手'
  and t.content_type in ('I', 'T', 'VOICE')
  group by t.project_id
          
  union all
  select '2017-08-10' date, t.project_id project_id, 0 'messages_yhry', count(1) 'messages_hz', 0 'edu_send_nums', 0 'edu_read_nums', 0 'questions_send_nums', 0 'questions_receive_nums'
  from interaction_message t left join user u on t.receiver_id = u.id
  where 1=1
  and t.created_time between '2020-05-01 00:00:00' and '2020-05-31 23:59:59'
  and u.user_type in (1,4)
  and u.name != '科室小助手'
  and t.content_type in ('I', 'T', 'VOICE')
  group by t.project_id
          
  union all
  select '2017-08-10' date, u.project_id project_id, 0 'messages_yhry', 0 'messages_hz', count(1) 'edu_send_nums', 0 'edu_read_nums', 0 'questions_send_nums', 0 'questions_receive_nums'
  from health_education_instance t ,user u
  where t.creator = u.id
  and u.name != '科室小助手'
  and t.created_time between '2020-05-01 00:00:00' and '2020-05-31 23:59:59'
  group by u.project_id
          
          
  union all
  select '2017-08-10' date, u.project_id project_id, 0 'messages_yhry', 0 'messages_hz', 0 'edu_send_nums', count(1) 'edu_read_nums', 0 'questions_send_nums', 0 'questions_receive_nums'
  from health_education_instance t ,user u
  where t.creator = u.id
  and u.name != '科室小助手'
  and t.created_time between '2020-05-01 00:00:00' and '2020-05-31 23:59:59'
  and t.read_time is not null
  group by u.project_id
          
          
  union all
  select '2017-08-10' date, u.project_id project_id, 0 'messages_yhry', 0 'messages_hz', 0 'edu_send_nums', 0 'edu_read_nums', count(1) 'questions_send_nums', 0 'questions_receive_nums'
  from q_questionnaire_send_info t
  INNER JOIN q_questionnaire_info info 
  on t.questionnaire_id=info.id and info.type=0 and info.deleted=0 
  left join user u  on t.send_id = u.id
  where  1=1
  and t.send_time between '2020-05-01 00:00:00' and '2020-05-31 23:59:59'
  and u.user_type = 1
  and u.name != '科室小助手'
  group by u.project_id

          
  union all
  select '2017-08-10' date, u.project_id project_id, 0 'messages_yhry', 0 'messages_hz', 0 'edu_send_nums', 0 'edu_read_nums', 0 'questions_send_nums', count(1) 'questions_receive_nums'
  from q_questionnaire_send_info t
  INNER JOIN q_questionnaire_info info 
  on t.questionnaire_id=info.id and info.type=0 and info.deleted=0 
  left join user u  on t.send_id = u.id
  where  1=1
  and t.send_time between '2020-05-01 00:00:00' and '2020-05-31 23:59:59'
  and t.answer_time is not null
  and u.user_type = 1
  and u.name != '科室小助手'
  group by u.project_id

) t, project p
where 1=1
and t.project_id = p.id
group by t.project_id
```

