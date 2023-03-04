export default {
  title: 'Alex小新',
  description: '物有本末，事有终始 Alex小新的个人博客 技术人生',

  themeConfig: {

    // 中文配置
    darkModeSwitchLabel: '模式',
    outlineTitle: '快速导航',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    logo: 'https://store.fastposter.net/assets/happy-boy.png',
    footer: {
      message: '人生感悟',
      copyright: 'Copyright © 2019~2023 由vitepress强力驱动'
    },
    nav: [
      {text: '技术', link: '/skill/'},
      {text: '记录', link: '/record/'},
      {text: '创业', link: '/startup/'},
      {text: '文学', link: '/culture/'},
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tangweixin/blog.psoho.cn' },
    ],

    outline: [2,3],

    sidebar: {

      '/skill/': [
        {
          text: 'Linux',
          items: [
            {text: '常用命令', link: '/skill/linux/index.md'},
            {text: '运维小技巧', link: '/skill/linux/operation-tips.md'},
            {text: 'shell脚本', link: '/skill/linux/shell-base.md'},
            {text: 'android-adb', link: '/skill/linux/android-adb.md'},
            {text: 'ffmpeg命令收藏', link: '/skill/linux/ffmpeg-commands-favorites.md'},
            {text: 'RTMP流媒体服务', link: '/skill/linux/build-rtmp-stream-server-base-on-docker.md'},
            {text: 'DB小技巧', link: '/skill/linux/db-tips.md'},
          ]
        },
        {
          text: 'Docker',
          items: [
            {text: 'Docker入门指南', link: '/skill/docker/docker-guide.md'},
            {text: 'MySQL优化记录', link: '/skill/prod/mysql-optimize.md'},
          ]
        },
        {
          text: '生产纪实',
          items: [
            {text: 'DB跑满的生产事故复盘', link: '/skill/prod/db-full-record.md'},
            {text: 'MySQL优化记录', link: '/skill/prod/mysql-optimize.md'},
          ]
        },
        {
          text: '前端',
          items: [
            {text: 'Flex布局', link: '/skill/frontend/css-flex.md'},
          ]
        },
        {
          text: 'Elastic',
          items: [
            {text: '安装ES', link: '/skill/elastic/install-es.md'},
            {text: '安装ES+Kibana', link: '/skill/elastic/install-es-kibana.md'},
            {text: '安装ELK', link: '/skill/elastic/install-elk.md'},
            {text: '采集nginx日志', link: '/skill/elastic/pick-nginx-log.md'},
            {text: '采集java日志', link: '/skill/elastic/pick-java-log.md'},
            {text: 'APM-java', link: '/skill/elastic/apm-java.md'},
            {text: 'APM-java生产记录', link: '/skill/elastic/apm-java2.md'},
          ]
        },
        {
          text: 'Jenkins',
          items: [
            {text: '安装Jenkins', link: '/skill/jenkins/install.md'},
            {text: '视图管理', link: '/skill/jenkins/view.md'},
            {text: '节点管理', link: '/skill/jenkins/node.md'},
            {text: '构建springboot', link: '/skill/jenkins/build-springboot.md'},
            {text: '构建springboot并部署', link: '/skill/jenkins/build-springboot-deploy.md'},
            {text: '构建springboot部署到docker', link: '/skill/jenkins/build-springboot-deploy-to-docker.md'},
            {text: '多参数构建', link: '/skill/jenkins/build-multi-params.md'},
            {text: '用户和角色管理', link: '/skill/jenkins/role-user-manage.md'},
            {text: '构建Android应用', link: '/skill/jenkins/build-android.md'},
          ]
        },
        {
          text: '大数据',
          items: [
            {text: '大数据概述', link: '/skill/bigdata/index.md'},
            {text: 'HDFS常用命令', link: '/skill/bigdata/hdfs.md'},
            {text: 'Hive基础', link: '/skill/bigdata/hive.md'},
            {text: 'Spark基础', link: '/skill/bigdata/spark.md'},
            {text: 'Scala基础', link: '/skill/bigdata/scala.md'},
            {text: '安装CDH', link: '/skill/bigdata/install-cdh.md'},
          ]
        },
      ],

      '/record/': [
        {
          text: '记录',
          items: [
            {text: '简介', link: '/startup/index.md'},
          ]
        },
      ],

      '/startup/': [
        {
          text: '创业',
          items: [
            {text: '简介', link: '/startup/index.md'},
            {text: '鲁莽定律', link: '/startup/the-lu-mang-law.md'},
          ]
        },
      ],

      '/culture/': [
        {
          text: '文学',
          items: [
            {text: '简介', link: '/startup/index.md'},
          ]
        },
      ],
    },

  }
}
