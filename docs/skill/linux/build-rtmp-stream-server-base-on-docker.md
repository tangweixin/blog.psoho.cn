# RTMP流媒体服务器

## 概念

我们在做直播，或者录播推送的时候，首先需要一个rtmp流媒体服务器。

参考：

*	[nginx-rtmp](https://hub.docker.com/r/alfg/nginx-rtmp)
*	[VideoJS Player](https://video-dev.github.io/hls.js/stable/demo/)

## RTMP流媒体服务器搭建

docker-compose.yml

```yml
version: '3'
services:

  # 推流服务器
  nginx-rtmp:
    container_name: nginx-rtmp
    image: alfg/nginx-rtmp
    restart: always
    # ports:
    #   - "1935:1935"
    #   - "8080:80"
    ports:
      - "40001:1935"
      - "40002:80"
    volumes:
      - ./nginx:/opt/nginx
```

## 推流测试

```bash
# 推流方式一（HLS）
ffmpeg -re -i video.mp4 -s 1280x720 -c copy -f flv "rtmp://114.67.69.231:40001/stream/test"
http://114.67.69.231:40002/live/test.m3u8

# 推流方式二（RTMP）
ffmpeg -re -i video.mp4 -s 1280x720 -c copy -f flv "rtmp://114.67.69.231:40001/live/test"
rtmp://114.67.69.231:40001/live/test
```

## Nginx配置示例

```nginx
daemon off;

error_log /dev/stdout info;

events {
    worker_connections 1024;
}

rtmp {
    server {
        listen 1935;
        chunk_size 4000;

        application stream {
            live on;

            exec ffmpeg -i rtmp://127.0.0.1:1935/stream/$name
              # -c:a libfdk_aac -b:a 128k -c:v libx264 -b:v 3600k -f flv -g 30 -r 30 -s 1920x1080 -preset superfast -profile:v baseline rtmp://127.0.0.1:1935/hls/$name_1080p3600kbs
              -c:a libfdk_aac -b:a 128k -c:v libx264 -b:v 2500k -f flv -g 30 -r 30 -s 1280x720 -preset superfast -profile:v baseline rtmp://127.0.0.1:1935/hls/$name_720p2628kbs
              -c:a libfdk_aac -b:a 128k -c:v libx264 -b:v 1000k -f flv -g 30 -r 30 -s 854x480 -preset superfast -profile:v baseline rtmp://127.0.0.1:1935/hls/$name_480p1128kbs
              -c:a libfdk_aac -b:a 128k -c:v libx264 -b:v 750k -f flv -g 30 -r 30 -s 640x360 -preset superfast -profile:v baseline rtmp://127.0.0.1:1935/hls/$name_360p878kbs
              -c:a libfdk_aac -b:a 128k -c:v libx264 -b:v 400k -f flv -g 30 -r 30 -s 426x240 -preset superfast -profile:v baseline rtmp://127.0.0.1:1935/hls/$name_240p528kbs
              -c:a libfdk_aac -b:a 64k -c:v libx264 -b:v 200k -f flv -g 15 -r 15 -s 426x240 -preset superfast -profile:v baseline rtmp://127.0.0.1:1935/hls/$name_240p264kbs;
        }

        application hls {
            live on;
            hls on;
            hls_fragment_naming system;
            hls_fragment 5;
            hls_playlist_length 10;
            hls_path /opt/data/hls;
            hls_nested on;

            # hls_variant _1080p3600kbs BANDWIDTH=3600000,RESOLUTION=1920x1080;
            hls_variant _720p2628kbs BANDWIDTH=2628000,RESOLUTION=1280x720;
            hls_variant _480p1128kbs BANDWIDTH=1128000,RESOLUTION=854x480;
            hls_variant _360p878kbs BANDWIDTH=878000,RESOLUTION=640x360;
            hls_variant _240p528kbs BANDWIDTH=528000,RESOLUTION=426x240;
            hls_variant _240p264kbs BANDWIDTH=264000,RESOLUTION=426x240;
        }

        application live {
            live on;
            record off;
        }
    
    }


    # # 只支持rtmp协议推送和播放，播放的是直播流，不支持hls
    # server {
    #     listen 1935;
        
    #     application live {
    #         live on;
    #         record off;
    #     }
    # }

}

http {
    access_log /dev/stdout combined;

    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    server {
        listen 80;

        # Uncomment these lines to enable SSL.
        # Update the ssl paths with your own certificate and private key.
        # listen 443 ssl;
        # ssl_certificate     /opt/certs/example.com.crt;
        # ssl_certificate_key /opt/certs/example.com.key;

        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /opt/data;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin *;
        }

        location /live {
          alias /opt/data/hls;
          types {
              application/vnd.apple.mpegurl m3u8;
              video/mp2t ts;
          }
          add_header Cache-Control no-cache;
          add_header Access-Control-Allow-Origin *;
        }

        location /stat {
            rtmp_stat all;
            rtmp_stat_stylesheet static/stat.xsl;
        }

        location /static {
            alias /www/static;
        }

        location = /crossdomain.xml {
            root /www/static;
            default_type text/xml;
            expires 24h;
        }
    }
}
```

