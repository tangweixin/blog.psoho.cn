# HTTPS证书

## acme.sh

> 特性：会自动备份nginx配置，等证书生成好后，自动恢复。

参考

* [https://github.com/acmesh-official/acme.sh](https://github.com/acmesh-official/acme.sh)

### 安装

```bash
# 第一种方式(需要网络OK)
curl https://get.acme.sh | sh

# 第二种方式
git clone https://github.com/acmesh-official/acme.sh.git
cd ./acme.sh
./acme.sh --install

# 第三种(通过代理下载，用于外网不太好的网络情况)
export http_proxy=http://47.52.31.157:18888
curl https://raw.githubusercontent.com/acmesh-official/acme.sh/master/acme.sh | INSTALLONLINE=1  sh

# 安装成功后,会增加一个定时任务
# crontab -l
19 0 * * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null
```

### 签发一个证书

```bash
acme.sh --issue  -d git.psoho.cn   --nginx

# 证书生成OK
-----END CERTIFICATE-----
Your cert is in  /root/.acme.sh/git.psoho.cn/git.psoho.cn.cer 
Your cert key is in  /root/.acme.sh/git.psoho.cn/git.psoho.cn.key 
The intermediate CA cert is in  /root/.acme.sh/git.psoho.cn/ca.cer 
And the full chain certs is there:  /root/.acme.sh/git.psoho.cn/fullchain.cer 
```

### 修改nginx配置

```nginx
# 请使用以下配置，微信小程序HTTPS测试可用
server {
    listen  443 ssl http2;
    server_name     git.psoho.cn;

    access_log /var/log/nginx/git.psoho.cn.https.log;

    client_max_body_size 100m;

    ssl on;
    ssl_certificate /root/.acme.sh/git.psoho.cn/git.psoho.cn.cer;
    ssl_certificate_key /root/.acme.sh/git.psoho.cn/git.psoho.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    add_header Strict-Transport-Security max-age=15768000;

    location / {    
        proxy_pass      http://127.0.0.1:13000;
        proxy_read_timeout 5;
        proxy_redirect off;
        proxy_set_header   Host    $host;
        proxy_set_header   X-Real-IP   $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   REMOTE-HOST $remote_addr;
        # client_body_buffer_size 128k;
        # proxy_buffer_size 4k;
        # proxy_buffers 4 32k;
        # proxy_busy_buffers_size 64k;
        # proxy_temp_file_write_size 64k;
    }
}
```



### 测试HTTPS证书

```bash
# 测试HTTPS证书
openssl s_client -connect git.psoho.cn:443
```


## certbot


> 简介：Cerbot是基于Let's Encrypt的一个证书生成工具

### 安装

```bash
# CentOS
yum install certbot

# Debian
apt install certbot
```

### 生成证书(90天有效期)

#### 一、先配置nginx

```nginx
server {
  listen          80;
  server_name      jxb.prodapi.cn;
  
  access_log   /mnt/vdb1/log/nginx/jxb.prodapi.cn.log  main_upstream;

  location / {
    index   index.html ;
    proxy_pass      http://127.0.0.1:6010;
    proxy_set_header   Host    $host;
    proxy_set_header   X-Real-IP   $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  # 证书
  location ^~ /.well-known/acme-challenge/ {
     default_type "text/plain";
     root     /var/www/jxb.prodapi.cn/;
  }

  location = /.well-known/acme-challenge/ {
     return 404;
  }

}
```

#### 二、生成证书

```bash
# 生成证书
mkdir -p /var/www/jxb.prodapi.cn/
certbot certonly --webroot -w /var/www/jxb.prodapi.cn/ -d jxb.prodapi.cn
```

### 使用证书

```nginx
server {
    listen          443;
    server_name     jxb.prodapi.cn;

    ssl on;
    ssl_certificate /etc/letsencrypt/live/jxb.prodapi.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jxb.prodapi.cn/privkey.pem;

    ssl_session_timeout 5m;

    ssl_protocols SSLv3 TLSv1;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv3:+EXP;
    ssl_prefer_server_ciphers on;

    access_log   /mnt/vdb1/log/nginx/jxb.prodapi.cn.https.log  main_upstream;

    location / {    
        index   index.html;
        proxy_pass      http://127.0.0.1:6010;
        proxy_read_timeout 15;
        proxy_redirect off;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST $remote_addr;
        client_body_buffer_size 128k;
        proxy_buffer_size 4k;
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;
        proxy_temp_file_write_size 64k;
    }
}
```

### 刷新证书

```bash
# 刷新证书
certbot renew --dry-run
```

