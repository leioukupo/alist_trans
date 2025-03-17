# 本项目用途

在alist页面增加一个可隐藏的输入框

![隐藏状态](/Assets/Snipaste_2025-03-13_19-47-07.png)
![展开状态](/Assets/Snipaste_2025-03-13_19-47-17.png)   

用来转存百度网盘分享链接

配置文件中

"leioukupo": "/xxxx"

key是alist_trans_baidu.js中的head中'Authorization':对应的值

vlaue填写需要转存到网盘哪个路径
比如/我的资源

项目附带的BaiPCS-Go来自[BaiduPCS-Go](https://github.com/qjfoidnh/BaiduPCS-Go)的3.9.7   amd-x64版本，其他架构需要自己替换

# 启动

要求：需要能运行python，可以公网访问的机器

```python
pip install -r ./requirements.txt 
python api.py
```
修改alist_trans_baidu.js
```js
 const API_URL = 'http://xxxxxxxx/baidu';
//修改为自己的ip地址
```
```js
headers: {
            'Content-Type': 'application/json',
            'Authorization':'leioukupo'
            }
            // leioukupo修改为你自定义
```
