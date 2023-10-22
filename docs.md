一些有用的探索：
能够正常运行的有2.9.15以下的vite、nodered、nocodb、rubick，但其他用了nodejs的esm语法的都会有些问题。

https://github.com/Hk-Gosuto/ChatGPT-Next-Web-LangChain 适配了一些插件

可以用它来拉起动态博客

进程依赖关系

另开的browser window作为容器，websocket通信  跟rubick一样

靠electron的node的话，目前能做到最好差不多就是那样了，utools和rubick都是那么整的

eagle的插件系统好像也是这个路线

![0498e6e0f4285cbd574edaa9305f04a6](https://github.com/terwer/siyuan-plugin-local-service/assets/3259282/5e488ba0-4091-4949-b5c9-20f59e124bbc)

windows端用start，linux用nohup，创建一个进程管理器比较好。

可以用pm2  这个试过能跑起来

等remote没了，我们就直接用操作系统的进程

所以我觉得最好在上面封装一个抽象层

这样到时候改底层就好了

通过preload注入变量


里面有基本的服务管理、服务间IPC调用、服务向主窗口注入的扩展代码、还有服务路由啥的

https://github.com/leolee9086/noobService
https://github.com/leolee9086/noobBazaar