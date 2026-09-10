---
title: YALMIP、IPOPT安装
author: YIWEI
top: false
cover: false
toc: true
mathjax: false
date: 2022-05-27 15:31:23
img:
coverImg:
password:
summary: YALMIP、IPOPT在MATLAB下安装
tags: matlab
categories: 软件安装
---
## 一. YALMIP 安装  
YALMIP就是为MATLAB做的工具包，所以下载和安装都很简单。  
[YALMIP官网下载链接](https://yalmip.github.io/download/)  
官网也有对应的[安装教程](https://yalmip.github.io/tutorial/installation/)  
这里我就采用最简单易懂的安装方法，通过上面的下载链接下载后，解压下载的压缩包，将得到的文件夹  
{% asset_img 01.jpg %}  
剪切粘贴到MATLAB根目录下的toolbox文件夹中，当然这步也可以不用做，但我建议还是将这些工具包的源文件都放在toolbox文件夹中，这样也方便后续的对一些工具包的更新或删除。  
然后打开MATLAB，  
{% asset_img 02.jpg %} 
选择设置路径
{% asset_img 03.jpg %} 
{% asset_img 04.jpg %}  
由于我的文件夹已经放在toolbox里了，所以就在里面选，添加好后点保存就ok了。  
然后在MATLAB运行窗口输入：
``` matlab
>> yalmiptest
```
或者输入  
``` matlab
>> which sdpvar
```
检测你是否安装成功。 
当然除了YALMIP，我们还需要求解器，而YALMIP官网也给了其适用的[求解器](https://yalmip.github.io/allsolvers/)，选择合适的下载安装就行。
## 二. IPOPT 安装
IPOPT是为c/c++写的解决非线性最优规划的工具包，但因为其很好用，所以后续也有MATLAB的相关工具包，找这个MATLAB的工具包确实不好找（我没有在官网上找到相关的matlab工具包），我本来在国外的一个网站上只找到了3.11的版本，后来在b站上又看到有人分享，但没说是啥版本的，我也下下来装上，结果发现是3.13版本的，很不错（虽然官网最新的版本已经到13.14了）。
下面是[百度云链接](https://pan.baidu.com/s/1ATPXu6y514UHndP9f68tuA )(密码：57t9)
那其实下载后的安装过程和上文是一样的，还是将文件夹放在toolbox文件加下，然后选择设置路径，将其添加到其中，再点保存就ok了。  
{% asset_img 05.jpg %}   
然后打开examples文件下的任意测试文件，我这里运行的是examplehs071
{% asset_img 06.jpg %}  
出结果了，这样就大功告成了。