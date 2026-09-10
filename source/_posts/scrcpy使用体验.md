---
title: scrcpy使用体验
author: YIWEI
top: false
cover: false
toc: true
mathjax: false
date: 2022-06-14 14:14:05
img:
coverImg:
password:
summary: scrcpy
tags: 
categories: 软件安装
---
scrcpy是一款免费开源的投屏软件（摸鱼神器)  
{% asset_img 01.jpg %}  
通过这个软件，可以在电脑上控制安卓手机，可以方便地利用scrcpy来测试app应用、玩游戏、高效地完成一些需要在手机上进行的复杂工作、更高效的办公；当然我觉得最重要的是方便在上班时摸鱼。无论是在电脑上操作，还是在手机上操作，都是实时同步的。  

下面就介绍软件的安装和使用方法  
1.[下载软件](https://github.com/Genymobile/scrcpy/releases/download/v1.24/scrcpy-win64-v1.24.zip)（这是从官网直接摘下来的下载链接，也可以去[官网](https://github.com/Genymobile/scrcpy)自行下载）  
2.下载好后解压压缩包。  
3.准备一根数据线(USB或TCP/IP都行)，将手机接入电脑（无线情况下共同连入一个WiFi应该也可以，由于我的办公地点没有外网WiFi，所以我这里只讲有线怎么连，至于无线连接教程可以去[官网](https://github.com/Genymobile/scrcpy)查看）然后打开手机的开发者选项，打开USB调试（这一步各个品牌的手机操作步骤不同，可以自行搜索如何实现）  
{% asset_img 02.png %}  
4.然后打开电脑上解压缩后的文件夹，在该文件夹下调出命令提示符（在该文件夹的路径输入cmd，回车）  
{% asset_img 03.jpg %}  
然后，输入scrcpy启动
``` bash
>> scrcpy
```
 
然后就可以使用了，但这个时候手机其实是一直亮着的，为了实现息屏投屏，可以输入下面的指令
``` bash
>> scrcpy -Sw
```
更多的指令可以去[官网](https://github.com/Genymobile/scrcpy)查看,或者是输入help指令
``` bash
>> scrcpy --help
```
就会显示所支持的各种指令，选择自己要用的执行就行。  
  
完成上面这些后，就可以开始愉快的使用（摸鱼）了。
