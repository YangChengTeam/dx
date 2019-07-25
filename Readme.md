头像自动做任务
------------

安装目标软件  头像达人
-------

抓包
-------

   - **查看本机ip**  <br />
   ctrl+R <br />
   输入 cmd  回车 <br />
   ![1.png](1.png) <br />
   输入 ipconfig <br />
   ![2.png](2.png) <br />
   本机ip为 192.168.80.35 <br />

   - **手机配置** <br />
   将手机连接至于抓包软件的PC同一局域网wifi 设置代理<br />
  ![3.png](3.png) <br />
  ![4.png](4.png) <br />
  ![5.png](5.png) <br />
   
   - **开始抓包** <br />
   打开Charles <br />
   打开头像达人 <br />
  ![6.png](6.png) <br />
   获取到3个信息<br />
       1. http协议非https <br />
       2. 请求内容加密 <br />
       3. 响应没有加密 <br />

破解加密算法
-----------
   打开jadx 将头像达人apk 托入 <br />
  ![7.png](7.png) <br />
   搜索相关信息 比如 抓包url v1.welfare<br />
  ![8.png](8.png) <br />
  ![9.png](9.png) <br />
   结合抓包时的user-agent:是okhttp 熟悉android开发的同学一定知道这是用的retrofit + okhttp <br />
   搜索new OkHttpClient <br />
  ![10.png](10.png) <br />
  ![11.png](11.png) <br />
  ![12.png](12.png) <br />
   找到加密码算法 byte[] strNewBody = RSAUtils.encryptByPublicKey(strOldBody, Constants.DEFAULT_PUBLIC_KEY);
   直接利用反编绎原码中 RSAUtils + Base64Utils  构造jar包
  ![13png](13.png) <br />
  ![14.png](14.png) <br />
   **这里发现Base64引入的android的lib我们换成java的就行了**<br />
  ![15.png](15.png) <br />
  ![16.png](16.png) <br />
  ![17.png](17.png) <br />
  ![18.png](18.png) <br />  
   **手动构造加密jar包**<br />
  ![20.png](20.png) <br />
  ![19.png](19.png) <br />  
  ![21.png](21.png) <br /> 
  ![22.png](22.png) <br />  

自动化做任务
----------
- 手动做一个任务
先手动做一个任务 观察抓包情况<br />  
发现点击任务会请求http://ytx.wk2.com/api/v1.welfare/addusertask<br />  
利用刚才java程序解密参数 看一下是如何构造的参数<br />  
发现status为0时创建任务 并返回infoid<br />  
status为1时利用infoid完成任务<br />  
![23.png](23.png) <br />  
![24.png](24.png) <br /> 
![25.png](25.png) <br /> 
**实际运行情况**<br /> 
![26.png](26.png) <br /> 

- 编写自动化脚本
[详见](dx.js)<br />  