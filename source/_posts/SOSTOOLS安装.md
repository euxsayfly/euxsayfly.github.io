---
title: SOSTOOLS安装
author: YIWEI
top: false
cover: false
toc: true
mathjax: false
date: 2022-07-11 11:05:04
img:
coverImg:
password:
summary: SOSTOOLSS
tags: matlab
categories: 软件安装
---
## 安装要求
* MATLAB R2009a 或更高版本  
* Symbolic Math Toolbox 5.7或更高版本  
* 电脑至少有8GB RAM  
* 下列SDP求解器中至少安装一个：[SeDuMi](http://sedumi.ie.lehigh.edu), [SDPT3](http://www.math.nus.edu.sg/~mattohkc/sdpt3.html), [CSDP](https://projects.coin-or.org/Csdp/), [SDPNAL](http://www.math.nus.edu.sg/~mattohkc/SDPNAL.html), [SDPNAL+](http://www.math.nus.edu.sg/~mattohkc/SDPNALplus.html), [SDPA](http://sdpa.sourceforge.net/index.html), [MOSEK](https://www.mosek.com/downloads/)。在使用SOSTOOLS之前必须要有一个SDP求解器已安装。  
## 安装下载    
最新版本下载：[下载地址](https://github.com/oxfordcontrol/SOSTOOLS)  
历史版本下载：[下载地址1](http://www.eng.ox.ac.uk/control/sostools/)  [下载地址2](http://www.cds.caltech.edu/sostools) [下载地址3](http://www.mit.edu/~parrilo/sostools/) [下载地址4](http://control.asu.ed/sostools/)  
下载好后，解压压缩包，将得到的文件夹剪切粘贴到MATLAB根目录下的toolbox文件中，当然这步也可以不用做，但我建议还是将这些工具包的源文件都放在toolbox文件夹中，这样也方便后续的对一些工具包的更新或删除。  
然后打开MATLAB,（我的MATLAB版本是R2021 a）  
 {% asset_img 01.jpg %}   
选择设置路径，将之前的文件夹添加保存就ok了。  
然后下载安装一个SDP求解器，这里以SeDuMi为例，先下载求解器（[下载地址](https://github.com/sqlp/sedumi)）,下载完后解压压缩包，一样的重复上面的操作，将其添加到matlab的路径中。  
然后运行  
``` matlab
>> install_sedumi
```
需要注意的是这个版本的SeDuMi带有用于matlab的预编译二进制文件，有可能与你的系统不兼容，若安装失败，请尝试运行
``` matlab
>> install_sedumi -rebuild
```
## 工具箱测试使用
在安装好之后，我们可以去测试一下是否能够使用，一般这种工具箱都会有demo文件，我们找到其中的demo文件运行一下，下面是其中的sosdemo1.m文件  
{% asset_img 03.jpg %}   
注意该代码中的21行，
``` matlab
>> solver_opt.solver = 'sedumi';
```
选择SDP求解器，这里我选择的是sedumi，当然你可以根据你的需要来选择。点击运行，在命令号窗口出现下列结果，就是运行成功了。  
{% asset_img 04.jpg %}   
{% asset_img 05.jpg %}  
到此，安装和测试就全部完成了，更多关于该工具箱的使用方法和应用以及SOS相关知识也可以查看[官方手册](https://github.com/oxfordcontrol/SOSTOOLS/blob/SOSTOOLS400/docs/sostools.pdf)。
## 相关补丁和附加组件
以下是一些补丁和附加组件（非必要，有需要可以下载使用）：
* INSOSTOOLS用于制定和解决受一维积分不等式影响的优化问题。
* frlib用于预处理表面缩减步骤
