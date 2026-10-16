---
title: MATLAB 连接 STK 入门
date: 2026-10-16 15:52:00
author: YIWEI
top: false
cover: false
toc: true
mathjax: false
summary: 从 MATLAB 启动 STK，创建场景、地面站和卫星，并通过完整脚本搭建基础仿真环境。
tags:
  - matlab
  - STK
categories: 仿真入门
---

使用 STK 时，创建场景、添加对象、设置时间和位置等操作都可以通过 MATLAB 脚本完成。把这些步骤写下来，之后就能快速搭建相同的仿真环境，也方便修改参数和批量创建对象。

这篇文章从最基础的连接开始，介绍如何通过 MATLAB 打开 STK、创建场景，以及添加地面站和卫星。先把流程跑通，后续再逐步加入轨道参数设置和可见性分析。

<!-- more -->

## 一、准备工作

本文使用 MATLAB 的 COM 接口连接本机 STK，需要提前安装 MATLAB 和 STK，并确认 STK 能够正常启动、具备运行所需的许可。MATLAB 的 COM 接口仅支持 Windows 系统。

示例使用下面的程序标识连接 STK：

```matlab
'STK.Application'
```

如果安装了多个版本，希望指定启动 STK 12 或 STK 13，可以使用与本机安装版本对应的标识：

```matlab
'STK12.Application'
'STK13.Application'
```

## 二、从 MATLAB 启动 STK

打开 MATLAB，新建脚本，输入以下代码：

```matlab
% 启动 STK
uiApplication = actxserver('STK.Application');

% 显示 STK 界面
uiApplication.Visible = 1;

% 获取 STK 对象模型的根对象
root = uiApplication.Personality2;
```

运行后，STK 界面应当打开。这里的 `uiApplication` 用于访问 STK 应用程序，`root` 则是后续创建场景、访问对象的入口。

如果 STK 已经打开，希望连接到正在运行的程序，可以改用：

```matlab
% 连接已经运行的 STK
uiApplication = actxGetRunningServer('STK.Application');
root = uiApplication.Personality2;
```

两种连接方式任选一种即可。`actxGetRunningServer` 需要存在正在运行的 STK 实例。

## 三、创建场景并设置时间

场景是 STK 仿真的基础，卫星、地面站等对象通常都建立在场景中。

```matlab
% 创建场景
root.NewScenario('MATLAB_STK_Demo');

% 获取当前场景
scenario = root.CurrentScenario;
```

`MATLAB_STK_Demo` 是场景名称，可以自行修改。创建成功后，STK 左侧对象树中会显示这个场景。

{% asset_img stk-empty-scenario.png STK 空场景界面，包含左侧对象树、三维地球、二维地图和底部时间轴 %}

*图 1：STK 空场景界面。左侧是对象树，中间是三维地球和二维地图，下方是时间轴。截图中的场景名为 Scenario34；本文代码创建的场景名为 MATLAB_STK_Demo，时间设置也以代码为准。*

接下来设置场景的分析时间：

```matlab
% 使用 UTCG 日期格式
root.UnitPreferences.Item('DateFormat').SetCurrentUnit('UTCG');

% 设置场景时间范围
scenario.SetTimePeriod( ...
    '16 Oct 2026 00:00:00.000', ...
    '17 Oct 2026 00:00:00.000');

% 将动画时间返回场景起点
root.Rewind;
```

本例设置了一个持续 24 小时的场景，时间采用 UTC。北京时间比 UTC 快 8 小时，因此这里的起始时刻对应北京时间 2026 年 10 月 16 日 08:00。

创建新场景前，应确保当前 STK 实例中没有打开其他场景。如果已有场景，先在界面中保存需要保留的内容，再关闭该场景。

## 四、创建对象和设置地面站位置

在 STK 界面中，可以通过对象插入窗口选择要创建的对象，例如 Facility、Satellite 和 Sensor。

{% asset_img stk-insert-objects.png STK 对象插入窗口，列出了 Facility、Satellite 和 Sensor 等对象类型 %}

*图 2：STK 的对象插入窗口。使用 MATLAB 时，可以通过代码指定对象类型和名称，完成相应的创建操作。*

例如，在场景中创建一个 Facility 对象作为地面站：

```matlab
% 创建地面站
facility = scenario.Children.New('eFacility', 'GroundStation');
```

这行代码可以拆成三个部分理解：

| 写法 | 含义 |
| --- | --- |
| `scenario.Children` | 场景下的子对象集合 |
| `'eFacility'` | 要创建的对象类型 |
| `'GroundStation'` | 新对象的名称 |

创建后，对象树中应出现名为 `GroundStation` 的对象。接着设置它的位置：

```matlab
% 明确距离和角度单位
root.UnitPreferences.Item('DistanceUnit').SetCurrentUnit('km');
root.UnitPreferences.Item('AngleUnit').SetCurrentUnit('deg');

% 不使用地形高程
facility.UseTerrain = false;

% 按纬度、经度、高度的顺序设置位置
facility.Position.AssignGeodetic(39.9, 116.4, 0);
```

`AssignGeodetic` 的参数顺序是纬度、经度、高度。本例设置的是北纬 39.9°、东经 116.4°，高度为 0 km。这里使用的是椭球高，不应直接理解为海拔高度。

## 五、创建卫星并生成轨道

创建卫星的方法与地面站类似，只需要修改对象类型：

```matlab
% 创建卫星对象
satellite = scenario.Children.New('eSatellite', 'Satellite1');
```

创建对象后，还需要计算轨道，才能查看卫星随时间变化的位置。入门阶段可以先使用二体传播器及其默认初始轨道：

```matlab
% 选择二体传播器
satellite.SetPropagatorType('ePropagatorTwoBody');

% 获取传播器
propagator = satellite.Propagator;

% 计算轨道
propagator.Propagate;
```

`Propagate` 可以理解为：根据初始轨道状态，计算卫星在仿真时间段内的运动轨迹。二体模型只考虑中心天体的引力，适合用来理解最基础的轨道传播流程。

这里没有自行指定轨道高度、倾角等参数，主要目的是先完成“创建卫星—选择传播器—生成轨道”的操作。

## 六、完整示例

下面将上述步骤串联起来。可以保存为 `matlab_stk_demo.m`，在 MATLAB 中运行。运行前，确认目标 STK 实例中没有打开其他场景。

```matlab
%% 1. 启动 STK
% 如需指定版本，可改为 STK12.Application 或 STK13.Application
uiApplication = actxserver('STK.Application');
uiApplication.Visible = 1;

% 获取根对象
root = uiApplication.Personality2;

%% 2. 设置单位
root.UnitPreferences.Item('DateFormat').SetCurrentUnit('UTCG');
root.UnitPreferences.Item('DistanceUnit').SetCurrentUnit('km');
root.UnitPreferences.Item('AngleUnit').SetCurrentUnit('deg');

%% 3. 创建场景
root.NewScenario('MATLAB_STK_Demo');
scenario = root.CurrentScenario;

% 设置分析时间，时间采用 UTC
scenario.SetTimePeriod( ...
    '16 Oct 2026 00:00:00.000', ...
    '17 Oct 2026 00:00:00.000');

root.Rewind;

%% 4. 创建地面站
facility = scenario.Children.New('eFacility', 'GroundStation');

% 设置位置：纬度、经度、椭球高
facility.UseTerrain = false;
facility.Position.AssignGeodetic(39.9, 116.4, 0);

%% 5. 创建卫星
satellite = scenario.Children.New('eSatellite', 'Satellite1');

% 使用默认初始轨道进行二体传播
satellite.SetPropagatorType('ePropagatorTwoBody');
propagator = satellite.Propagator;
propagator.Propagate;

%% 6. 返回场景起始时刻
root.Rewind;

disp('场景、地面站和卫星已创建完成。');
```

运行成功后，STK 对象树中应出现以下结构：

```text
MATLAB_STK_Demo
├── GroundStation
└── Satellite1
```

此时可以在 STK 中查看地面站位置和卫星轨道，并使用动画工具观察卫星运动。

## 七、关闭场景和退出 STK

完成操作并保存需要保留的结果后，可以单独运行：

```matlab
% 关闭当前场景
root.CloseScenario;

% 退出 STK
uiApplication.Quit;

% 清除 MATLAB 中的对象变量
clear propagator satellite facility scenario root uiApplication;
```

退出代码没有放在完整示例末尾，便于运行后继续查看结果。仅执行 `clear` 不等于退出 STK。

## 八、初次运行时的常见问题

### 无法启动 STK

先确认 STK 能从桌面正常启动，再检查代码中的程序标识是否与安装版本对应。例如，安装了 STK 12 时，可以尝试：

```matlab
uiApplication = actxserver('STK12.Application');
```

### 创建场景或对象时报错

检查当前是否已经打开场景，以及是否已经存在同名对象。分段重复运行脚本时，容易再次创建 `GroundStation` 或 `Satellite1`。

如果对象已经存在，可以通过名称获取，而不必重复创建：

```matlab
facility = scenario.Children.GetItemByName('GroundStation');
```

### 创建了卫星，但没有看到轨道

检查是否执行了传播器的 `Propagate` 方法。创建卫星对象和计算轨道是两个步骤。如果仍未显示，再检查对象的显示设置和当前视图。

## 参考资料

- [MathWorks：actxserver](https://www.mathworks.com/help/matlab/ref/actxserver.html)，说明 MATLAB COM 接口的基本用法及平台限制。
- [STK：Connecting via COM](https://help.agi.com/stk/content/MATLAB_COM.htm)，包含启动 STK、连接运行实例和获取根对象的示例。
- [STK：MATLAB Code Snippets](https://help.agi.com/stkdevkit/Content/stkObjects/ObjModMatlabCodeSamples.htm)，本文所用的场景、地面站和卫星基础接口可在此查阅。
- [STK：Object Model Tutorial](https://help.agi.com/stkdevkit/Content/stkObjects/ObjectModelTutorial.html)，包含二体传播器的基础用法。
