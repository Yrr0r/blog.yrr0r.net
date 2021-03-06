---
permalink: 4ac307c9-ae6c-41aa-bfa8-e7e689479442
---
# Your computer isn’t yours

 

Take this spyware to protect your privacy.

 

原文：

https://sneak.berlin/20201112/your-computer-isnt-yours/

Louis Rossmann评论：

https://www.youtube.com/watch?v=aS2lJNQn3NA

 

摘取要点翻译一下：

1. Apple OCSP - 这是Apple推行的一个项目，在Mac上启动任意应用时macOS都会向 [oscp.apple.com](http://oscp.apple.com) 发送一串包含应用ID，日期时间地区和IP地址的请求信息。该信息不加密，上游设备（路由器/ISP）可轻易窃听。
2. OCSP在未连接网络时不激活，但一旦连接网络，如果该请求未得到响应，则App不会启动。这意味着启动软件时严重卡顿的原因可能跟性能无关，只是因为网速慢。
3. OCSP的监控行为由系统进程 trustd 执行。禁止该进程联网或将[oscp.apple.com](http://oscp.apple.com)拉黑（hosts或路由器）都可以阻止该程序并让应用更快启动。
4. 在macOS 11 Big Sur中，防火墙策略被升级，trustd 不再受防火墙管理，但其他方法未测试。
5. 受影响的系统版本：10.15以上所有版本，11以上版本加入系统盘签名功能之后系统进程无法被更改。

 

除此以外：

- OCSP功能原本目的是用于反盗版软件（盗版软件会启动不了），但该功能的设计已经让它暴露了大量用户隐私并成为监控数据的重要来源。
- iMessage/FaceTime 的端对端加密不再安全。当iCloud备份开启时，iMessage的私钥也会被备份到iCloud服务器，同时此备份不由用户自己的密钥加密。端对端加密中，私钥的持有者（Apple）将可以无效化加密。
- iOS设备也有类似机制，但由于其反破解机制，目前无可靠办法。

 

最后说说看法：

使用不加密的连接传输敏感信息是一种疯狂行为。现在能拥有你相关隐私的人已经不仅仅是苹果公司，而是所有一切可以监听你网络数据的人，大到国家和ISP，小到你的路由器或者网吧老板，每一个给你提供网络的设备和中间人都可以看到未加密的内容，这是对用户极度不负责任的行为。

就算你认为隐私无所谓，拉黑这个服务也可以解决一些系统卡顿问题，比如应用图标在Dock里弹跳很久打不开（因为macOS会先等待请求结束后再启动应用）。除此以外，这个项目的另一个重要问题是，苹果不仅掌握了你的行为，并且对此具有了决定权。OSCP有权力决定你要用的软件可不可以打开。虽然它打击了盗版，但它同样也可以用于打击任何个人开发者，甚至是看不惯谁就可以让他开发的软件启动不了（比如最近苹果连续这样封杀了好几个惠普打印机的驱动）。

另外再讲个笑话，Apple Silicon最近推出的三款机型（Pro, Air, Mac Mini）都使用同一款M1芯片（集成CPU+显卡+内存），这意味着三者基本上没有性能差别，区别就只剩了外观和电池续航（但价格还是原来系列的价格23333）。