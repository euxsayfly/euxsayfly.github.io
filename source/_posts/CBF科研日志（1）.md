---
title: CBF科研日志（1）
author: YIWEI
top: false
cover: false
toc: true
mathjax: true
date: 2022-05-12 20:20:19
img:
coverImg:
password:
summary: The introduction to CBF
tags: CBF CLF 
categories: 科研
---
### 引言
现在有很多的关于自主系统的研究，例如扫地机器人，双足行走机器人，汽车自动驾驶，无人机编队等等，涉及各个方面。而这些系统在设计时都避不开要考虑“<em>safety</em>”这个词。  
{% asset_img 01.png %}  
那什么是“<em>safety</em>”？  
我们该如何定义它呢？  
我们又该如何设计系统来实现呢？  
#### safety介绍
在控制系统中，safety这一概念最先由Leslie Lamport在其1977年的论文中提出[1].直观的来说，对于一个系统来说，safety要求的是“bad”事情不发生。有“bad”事情就有“good”事情，而对于一个系统来说，另一个词liveness就是要求“good”事情能最终发生。而系统的liveness我们一般通过系统平衡点的Asymptotic stability来表征，采用的数学描述方法就是lyapunov函数，而类似的对于系统的safety我们可以用系统安全集的Invariance来表征，采用的数学描述方法就是Barrier函数。在自动化系统中对应的就是控制lyapunov函数和控制障碍函数（CBF）。


### CBF
#### CBF历史简介
上个世纪四十年代，由日本学者Nagumo提出了不变集的充分必要条件[2]，对于一个系统$\dot{x}=f(x) $ ，假设有一个安全集<em>C</em>是由函数<em>h</em>来定义的：$C={x\in R:h(x)\geq 0}$,而且对所有使得$h(x)=0$的$x$,$\frac{\partial h}{\partial x}\neq0$,此时Nagumo定理给出了集的不变性的充分必要条件：
$$ C是不变集 \iff \dot{h}(x)\geq 0 \forall x\in\partial C$$  
在2000年的时候，$Barrier\,\,certificates$被提出是有效的能证明系统安全性的方法。首先考虑不安全集$C_u$和初始状态集$C_0$,有一个函数$B$,对于所有$x\in \partial C_0$，$B(x)\leq 0$,对于所有$x\in \partial C_u$,$B(x)>0$,满足下述微分关系，则$B$是一个障碍判据（$barrier\,\,certificate$）：
$$\dot{B}(x)\leq0 \quad \implies** \quad C是不变集$$
还是取上面的集合$C$,选取安全集合为不安全集的补集，$C=C_u^c$,令$B(x)=-h(x)$障碍判据条件变为：$\dot{h}(x)\geq0$使得$C$为不变集。这样在边界上这些条件就变为 了Nagumo定理。  
2007年，新加坡国立大学（NUS）的学者正式提出control barrier functions 这一概念给定一个控制系统：$\dot{x}=f(x)+g(x)u$以及同样的上面所提到的安全集合$C$（同样是由$h(x)$来定义）则有微分条件$\exists u\quad s.t.\quad \dot{h}(x,u)\geq0 \Rightarrow C$ 是不变集。但是这个条件过于保守和苛刻（overly conservative and strong），不适用于工程实际。  
这里值得一提的是，障碍函数（barrier functions）这一术语概念最早是在优化理论中提出的用来添加到导代价函数中来避免不期望的结果。  
2014年到2017，由美国教授Aaron D.Aems再次重申定义了控制障碍函数，并给出了新的微分条件  
$$\exists u \quad s.t. \quad\dot{h}(x,u)\geq-\alpha(h(x))\Leftrightarrow C是不变集$$  
可以证明该条件是minimally restrictive，由此，CBF被广泛地应用到工程实际中。例如：automotive systems; quadrotors; multi-robot systems; robotic systems...  
以上便是对控制障碍函数的大概介绍，更加具体的理论推导和证明将在后续给出。
