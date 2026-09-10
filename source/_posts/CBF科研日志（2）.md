---
title: CBF科研日志（2）
author: YIWEI
top: false
cover: false
toc: true
mathjax: true
date: 2022-08-11 15:30:52
img:
coverImg:
password:
summary: The introduction to CBF
tags: CBF CLF
categories: 科研
---
### 前言
距离第一篇日志已经过去了三个月，期间忙着其他事而停下了对这一部分的更新，最近因为要博士开题，对这一部分内容又进行了回顾与巩固。正好也可以通过写科研日志来梳理自己的开题思路。本篇的内容主要是对两种障碍函数rbf（Reciprocal Barrier Functions）和zbf(Zeroing Barrier Functions)的理论介绍与公式证明。
### Notions
K类函数：对于一个函数$\beta:[0,\alpha) \rightarrow[0,\infty),a>0,\beta(0)=0$。若该函数是单调递增的，则称其为K类函数。
扩展K类函数：对于一个函数$\alpha:(-b,a) \rightarrow (-\infty,\infty),a>0,b>0,\alpha(0)=0$。若该函数是单调递增的，则称其为扩展K类函数。  
集合的不变性（the invariance of a set）: 对于一个非线性系统：$\dot{x}=f(x)$，其任意初始状态:$x_{0}:=x(t_{0})$,对于所有时间$t\in [t_{0},t_{max}）$情况下当$\forall x_{0}\in S,x(t)\in S$。则这个集合S被称为（前向）不变集。  
比较引理（Comparison Lemma）:有一关于x的函数y，若$\dot{y}\leq f(x),\dot{g}(x)=f(x)则y\leq g(x)。$  
KL类函数：对于函数$\beta(r,s):[0,b)\times [0,\infty)\rightarrow [0,\infty),b>0$，固定s，函数单调递增，固定r，函数单调递减。
### Reciprocal Barrier Functions
首先考虑一个非空没有孤立点的集合C，按如下定义：  
$$C={x\in R^{n}:h(x)\geq0}，$$
$$\partial C={x\in R^{n}:h(x)=0},$$
$$Int(C)={x\in R^{n}:h(x)>0}.$$  
此时考虑一个对数障碍函数候选：$B(x)=-log(\frac{h(x)}{1+h(x)})$  
这个函数满足以下性质：
$$\inf_{x\in Int(C)}B(x)\geq 0,\quad \lim_{x\rightarrow \partial C}B(x)=\infty.$$  
现在考虑B（x）需要满足什么样的微分条件来使得集合C为不变集。  
这里先给出一个微分条件：$\dot{B}\leq \frac{\gamma}{B}$,  
B的微分形式可以用h来表示：$\dot{B}=-\frac{\dot{h}}{h+h^{2}}$,  
由上面给出的微分条件将h代入可以得到下列不等式：$\dot{h}\geq \frac{\gamma(h+h^{2})}{log(\frac{h}{1+h})}$,  
由比较引理可以得到：$h(x(t,x_{0}))\geq\frac{1}{-1+exp(\sqrt{2\gamma t+log^{2}(\frac{h(x_{0}+1)}{h(x_{0})})})}$。  
此时，若$h(x_{0})$为大于零的，那么h(x)便能满足大于零，则任意的$h(x(t,x_{0}))$都是属于Int(C)中的，由此可以满足集合C的不变性。  
上述的对数式的障碍函数是一个特例，下面给出更加通用的构造和寻找B(x)的定义：  
$$\frac{1}{\alpha_{1}(h(x))}\leq B(X) \leq \frac{1}{\alpha_{2}(h(x))},$$  
$$L_{f}B(x)\leq \alpha_{3}(h(x))$$  
其中的$\alpha_{1}$，$\alpha_{2}$，$\alpha_{3}$为K类函数，有  
$$\inf_{x\in Int(C)}\frac{1}{\alpha(h(x))}\geq 0, \quad \lim_{x\rightarrow \partial C}\frac{1}{\alpha(h(x))}=\infty$$  
证明如下：
首先引入一个引理；考虑这样一个系统：$\dot{y}=\alpha(\frac{1}{y}),y(t_{0})=y_{0}.$其中$\alpha$是K类函数，那么对于每一个$y_{0}\in(0,\infty)$，系统存在一个唯一解：
$$y(t)=\frac{1}{\sigma(\frac{1}{y_{0}},t-t_{0})}$$  
其中$\sigma$为KL类函数。  
K类函数的逆也是K类函数，K类函数的复合函数也是K类函数，
$$\dot{B}\leq\alpha_{3}\circ\alpha_{2}^{-1}(\frac{1}{B}):=\alpha(\frac{1}{B})$$  
由比较引理可以得到：
$$B(x(t))\leq \frac{1}{\sigma(\frac{1}{B(x_{0})},t-t_{0})},\frac{1}{B(x(t))}\geq\sigma(\frac{1}{B(x_{0})},t-t_{0})$$  
于是我们可以得到：
$$\alpha_{1}^{-1}(\sigma(\frac{1}{B(x_{0})},t-t_{0}))\leq h(x(t))$$  
由此便得到$h(x(t))$是大于等于零的，也证明了集合C是前向不变的。  
### Zeroing Barrier Functions
首先也是考虑一共非空没有孤立点的安全集C；  
$$C={x\in R^{n}:h(x)\geq0}，$$
$$\partial C={x\in R^{n}:h(x)=0},$$
$$Int(C)={x\in R^{n}:h(x)>0}.$$  
若存在一个扩展的K类函数$\alpha$，使得h满足下式：  
$$\dot{h}(x)=L_{f}h(x)\geq-\alpha(h(x))$$  
那么就认为这个连续可微函数h是一个zeroing barrier function(ZBF)，
这里也给出简略证明：  
对于任意$x\in\partial C,\dot{h}(x)\geq-\alpha(h(x))=0$，由Nagumo's theorem可得，集合C是前向不变的（forward invariant），假设有一个集合D，$C\subseteq D\subset R^{n}$，在D上定义一个函数$V_{C}$：  
$$V_{C}(x)=\begin{cases}0
 & ,x\in C \\ -h(x)
 & ,x\in D\setminus C
\end{cases}$$  
h若是一个ZBF，则还有如下结论：集合C是渐进稳定的；函数$V_{C}$是Lyapunov函数。  
### Relationships
{% asset_img 01.jpg %}   
RBFs：对于某些应用来说，rbfs更适用也更好构造。  
ZBFs；在集合C外也有很好的定义，实际更偏向于使用zbfs。  
### 后记  
本篇主要是对障碍函数的基础理论介绍两种，下篇将介绍与其相对应的控制障碍函数以及控制障碍函数的相关应用。