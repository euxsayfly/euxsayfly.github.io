---
title: CBF科研日志（3）
author: YIWEI
top: false
cover: false
toc: true
mathjax: true
date: 2022-10-10 14:42:51
img:
coverImg:
password:
summary: The introduction to CBF
tags: CBF CLF
categories: 科研
---
### 前言
有了前两篇的铺垫，这一篇开始正式介绍控制障碍函数。
### Control Barrier Functions
考虑如下非线性控制系统：  
$$\dot{x}=f(x)+g(x)u$$
若存在扩展K类函数使得函数h满足下式：
$$\sup_{u\in U}[L_{f}h(x)+L_{g}h(x)u]\geq -\alpha(h(x))$$
则称该函数h为CBF或者ZCBF，还有一类RCBF定义如下：对于B(x)定义为$$\inf_{u\in Int(C)}B(x)\geq0 ,\lim_{x\rightarrow \partial C}B(x)$$  
满足下式：  
$$\inf_{u\in U}[L_f B(x)+L_g B(x)u]\leq\alpha (\frac{1}{B(x)})$$
我们可以考虑使集合C安全的所有控制值的集合:
$$ K_{cbf}(x)=\left \{ u\in U: L_fh(x)+L_gh(x)u+\alpha(h(x))\geq0 \right \}$$  
由此，便可以得到下面这个结论：  
给定一个由h函数定义的集合C，若函数h是一个在集合D下的ZCBF，那么任意一个$u(x)\in K_{cbf}(x)$可以使得集合C是安全的，并且这个集合C是渐进稳定的  
使用CBF的方法，其实就是在最小化的改变已有的规划和控制策略下，使系统能够一直的处于安全的条件下。  
假设现在有一个反馈控制器$u=k(x)$,$k(x)$并不是一直属于$K_{cbf} (x)$中的，为了保证控制系统的安全，可以通过二次规划（Quadratic Program，QP）来最小化改进$k(x)$以实现系统的安全性:
$$ u(x)=\argmin_{u\in R^m} \quad \frac{1}{2}$$
$$ s.t. \quad L_fh(x)+L_gh(x)u\geq-\alpha(h(x))$$
(CBF QP)    
下面考虑如下基于QP的控制器:
$$ u(x)=\argmin_{(u,\delta)\in R^{m+1}}\quad \frac{1}{2}u^{T}H(x)u+p\delta^{2}$$  
$$ s.t. \quad L_fV(x)+L_gV(x)u\leq-\gamma(V(x))+\delta$$  
$$ L_fh(x)+L_gh(x)\geq-\alpha(h(x))$$  
(CLF-CBF QP)  
其中，H(X)是一个正定矩阵，$\delta$是松弛变量，p>0是惩罚因子,$\gamma$和$\alpha$是常量，这里松弛变量的作用是为了调节CLF约束，相对于CBF的约束CLF约束只是软约束  
### Applications
考虑一个由N个移动机器人组成的系统，记为$M={i|i=1,2...,N}$  
选择二重积分器（double integrators）来描述这个多机器人系统的动力学：  
$$\begin{bmatrix}\dot{p}_i\\ \dot{v}_i\end{bmatrix}=\begin{bmatrix}0&I_{2\times2}\\ 0&0\end{bmatrix}\begin{bmatrix}{p}_i\\ {v}_i\end{bmatrix}+\begin{bmatrix}0\\ I_{2\times2}\end{bmatrix}u_i $$  
其中$p_i\in R^2,v_i\in R^2,u_i\in R^2$分别表示智能体$i$的位置，速度和控制输入（加速度指令）。  
智能体$i$的速度和加速度也有如下限制：  
$$\left \|v_i \right \|_{\infty}\leq \beta_i,\quad \left \|u_i \right \|_{\infty}\leq \alpha_i$$
{% asset_img 01.jpg %}  
$$\Delta p_{ij}=p_i-p_j$$  
$$\Delta v_{ij}=v_i-v_j$$  
$$\Delta \bar{v}=\left \| \Delta \dot{p}_{ij} \right \|=\frac{\Delta p^{T}_{ij}}{\left \| \Delta p_{ij} \right \|}\Delta v_{ij}$$  
设置一个安全距离$D_s$，只要保证两两智能体之间的距离大于$D_s$,各智能体之间的碰撞就能避免。
现在假设在$t_0$时刻，智能体$i$和$j$之间的线相对速度为$\Delta \bar{v}(t_0)$，两个智能体都采用最大加速度来刹车时，使线相对速度降为零$\Delta \dot{v}(t_0+T_b)=0$所需时间为$T_b$:  
$$T_b=\frac{0-\Delta \bar{v}(t_0)}{\alpha_i+\alpha_j}$$  
则由安全距离$D_s$可以得到安全约束条件如下：
$$\left \| \Delta p_{ij} \right \|+\int_{t_0}^{t_0+T_b}\Delta \bar{v}(t_0+t)dt\geq D_s,\forall i\neq j$$
由$\Delta \bar{v}(t_0+t)=\Delta \bar{v}(t_0)+(\alpha_i+\alpha_j)t$可进一步得： 
$$\left \| \Delta p_{ij} \right \|-\frac{(\Delta\bar{v})^2}{2(\alpha_i+\alpha_j)}\geq D_s,\forall i\neq j$$  
整理可得下式：  
$$-\frac{\Delta p_{ij}^{T}}{\left \| \Delta p_{ij} \right \|}\Delta v_{ij}\leq \sqrt{2(\alpha_i+\alpha_j)(\left \| \Delta p_{ij} \right \|-D_s)}\quad \forall i\neq j$$  
由此，安全集$C$可以定义为：  
$$C_{ij}= \{ (p_i,v_i)\in R^4|h_ij(p,v)\geq0 \} \quad \forall i\neq j$$  
$$h_{ij}(p,v)=\sqrt{2(\alpha_i+\alpha_j)(\|\Delta p_{ij}\|-D_s)}+\frac{\Delta p_{ij}^{T}}{\|p_{ij}\|}\Delta v_{ij}$$  
为了使安全集$C$是前向不变的(forward invariant)，$h$得满足相应微分条件：
$$L_fh(x)+L_gh(x)u+\alpha(h(x))\geq 0$$  
这里取K类函数$\alpha(h(x))=\gamma h^3(x),\gamma >0$，则可以整理得到安全障碍约束为： 
$$-\Delta p_{ij}^{T}\Delta u_{ij}\leq \gamma h^{3}_{ij}\|\Delta p_{ij}\|-\frac{(\Delta v^T_{ij}\Delta p_{ij})^2}{\|\Delta p_{ij}\|^2}+\|\Delta v_{ij}\|^2+\frac{(\alpha_i+\alpha_j)\Delta v^T_{ij}\Delta p_{ij}}{\sqrt{2(\alpha_i+\alpha_j)(\|\Delta p_{ij}-D_s\|)}},\forall i\neq j$$  
由上面的安全约束条件，我们可以得到如下QP问题：  
$$u^*=\argmin_{u\in R^{2N}} \quad J(u)=\sum^{N}_{i=1}\|u_i-\hat{u}_i\|^2$$  
$$s.t. \quad A_{ij}u\leq b_{ij},\quad i\neq j$$  
$$\|u_i\|_{\infty}\leq \alpha_i, \quad\forall i \in M$$
其中$\hat{u}$为已经设计好的控制器(nominal controller)  
$$A_{ij}=[0,...,-\Delta p^{T}_{ij},...,\Delta p^{T}_{ij},...,0]$$
$$b_{ij} = \gamma h^3_{ij}\|\Delta p_{ij}\|-\frac{(\Delta v^T_{ij}\Delta p_{ij})^2}{\|\Delta p_{ij}\|^2}+\frac{(\alpha_i+\alpha_j)\Delta v^T_{ij}\Delta p_{ij}}{\sqrt{2(\alpha_i+\alpha_j)(\|\Delta p_{ij}\|-D_s)}}+\|\Delta v_{ij}\|^2$$



$$(22308*(3*tanh((exp(-4225/346)*(625*atanh(580/(3*((10403*exp(4975/692))/858 + 22500)^(1/2)))*exp(4225/346) + 16731*t*((10403*exp(4975/692))/858 + 22500)^(1/2)))/625)*((10403*exp(4975/692))/858 + 22500)^(1/2) - 580))/(5*(303*exp(4975/692) - 371800))