# pc

## 说明

* 聊天室逻辑代码可直接参考 <font color="#B22222">chatroom-pc-demo</font> 目录

* chatroom-pc-demo/index.html 可作为单独的 web 网页运行

## 支持平台

### macOS

对于 macOS 仅提供64位版本，并且只支持 macOS 10.9 或更高版本。

### windows

仅支持 Windows 7 或更高版本, 旧版操作系统已不再支持(并且无法运行).

对于 Windows 提供 `ia32` (`x86`) 和 `amd64` (`x64`) 版本。需要注意的是 `ARM` 版本的 Windows 目前尚不支持。

## 安装环境

1. 安装 nodejs 5.3.0 版本

​       Windows: [https://nodejs.org/dist/v5.3.0/node-v5.3.0-x86.msi](https://nodejs.org/dist/v5.3.0/node-v5.3.0-x86.msi) （打包32位的安装程序，兼容32/64位系统)

​       Mac: [https://nodejs.org/dist/v5.3.0/node-v5.3.0.pkg](https://nodejs.org/dist/v5.3.0/node-v5.3.0.pkg)

2. 安装第三方依赖库

```
  npm install
```

## 运行方法

```
  npm start
```

## 制作安装包

1. 说明

* Windows 下制作安装包前请修改安装包项目文件中的参数(desktop_setup.iss).项目文件中除了修改必要的参数（注释中有说明）,还需要修改 AppId(方法: 菜单中 Tools/Generate GUID)
  
* mac 打包后文件(*.app)内如果有任何文件改动,需重新签名, 否则 .app 文件下载后会提示 “.app”已损坏，打不开. 您应该将它移到废纸篓


2. 打包

* OS X

```
npm run package:mac
```

* Windows

```
npm run package:win
```

3. Mac 下签名

* 签名说明: [https://github.com/nwjs/nw.js/wiki/MAS%3A-Requesting-certificates](https://github.com/nwjs/nw.js/wiki/MAS%3A-Requesting-certificates)

4. 制作安装包:

* OS X

```
npm run installer:mac
```
   
* Windows

```
 打开项目文件 desktop_setup.iss, 选择菜单 Build/Compile
```

## 图标说明(res 目录)

```json
{
  "app.icns": "Mac 程序图标(1024 * 1024)",
  "app.ico": "Win 程序图标(256 * 256)",
  "app.png": "Win 气泡图标, Linux 程序图标(1024 * 1024)",
  "bg.png": "Mac 安装界面背景(600 * 400)" ,
  "Mac_Remind_icon_white.png": "Mac 托盘闪烁时图标(23 * 23)",
  "Mac_Template.png": "Mac 托盘图标(23 * 23)",
  "Mac_TemplateWhite.png": "Mac 托盘按下时的图标(23 * 23)",
  "Windows_icon.png": "Win 托盘图标(16 * 16)",
  "Windows_Remind_icon.png": "Win 托盘闪烁时图标(64 * 64)",
  "Windows_offline_icon": "Win 离线时托盘图标, 暂未使用(16 * 16)"
}
```
