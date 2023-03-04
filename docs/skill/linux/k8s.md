# K8S基础命令

### Deployment

```bash
# 创建 depoly
# 通过run命令，已经无法自动创建deploy
# kubectl run kubernetes-bootcamp --image=jocatalin/kubernetes-bootcamp:v1 --port=8080
kubectl create deployment kubernetes-bootcamp --image=jocatalin/kubernetes-bootcamp:v1 --port=8080

# 获取deploy
kubectl get deployments
kubectl get deploy
kubectl get deploy -o wide

# 查看详情
kubectl describe deploy kubernetes-bootcamp

# 删除deploy
kubectl delete deploy kubernetes-bootcamp 

# 扩缩容
kubectl scale deploy kubernetes-bootcamp --replicas=4

# 更新镜像
kubectl set image deploy kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2

# 查看镜像更新进度
kubectl rollout status deploy kubernetes-bootcamp

# 回滚deploy
kubectl rollout undo deploy kubernetes-bootcamp

# 暂停deploy
kubectl rollout pause deployment.v1.apps/kubernetes-bootcamp

# 查看历史
kubectl rollout history deployment.v1.apps/kubernetes-bootcamp

# 恢复deploy
kubectl rollout resume deployment.v1.apps/kubernetes-bootcamp

# 查看部署状态
kubectl get deployments

# 获取部署详情
kubectl describe deployments
```

### Pods

```bash
# 获取pods
kubectl get pods
kubectl get pods -o wide 

# 查看pods的labels
kubectl get pods --show-labels

# 过滤pods
kubectl get pods -l app=nginx

# 查看pods详情
kubectl describe pods kubernetes-bootcamp-xxxx

# 删除
kubectl delete pods kubernetes-bootcamp-xxxx

```

### 其他命令

>  参考 [https://kubernetes.io/zh/docs/tutorials/hello-minikube/](https://kubernetes.io/zh/docs/tutorials/hello-minikube/)

```bash

# 开启porxy
kubectl proxy

# 访问
curl http://127.0.0.1:8001/api/v1/proxy/namespaces/default/pods/kubernetes-bootcamp/

# 查看所有API版本
kubectl api-versions

# 查看集群事件
kubectl get events

# 查看kubectl配置
kubectl config view

# 查看services
kubectl get services

# 查看创建的pod和service
kubectl get pod,svc -n kube-system

# 查看副本集
kubectl get rs
```

### 通过文件管理集群

#### 创建Pod

```yaml
# nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.17
      ports:
        - containerPort: 80
```

```bash
# 通过文件创建pod
kubectl create -f nginx-pod.yaml 

# 查看pods
kubectl get pods

curl http://127.0.0.1:8001/api/v1/proxy/namespaces/default/pods/nginx/
```

#### 创建Deployment

```yaml
# kubectl apply -f nginx-deployment.yaml
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
  	app: nginx
spec:
  replicas: 1
  selector:
    matchLabels: 
      app: nginx
  template: 
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.17
          ports:
            - containerPort: 80
```

### 外部访问

```bash

# 释放kubernetes-bootcamp为服务
kubectl expose deploy kubernetes-bootcamp --type="NodePort" --target-port=8080 --port=90 

# 获取服务
kubectl get services
NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes            ClusterIP   10.96.0.1       <none>        443/TCP        30m
kubernetes-bootcamp   NodePort    10.97.152.146   <none>        90:32239/TCP   3s

# 可以通过NodeIP:Port访问
curl 127.0.0.1:32239
```







