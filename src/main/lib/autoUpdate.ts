import {is} from '@electron-toolkit/utils'
import {app, dialog} from 'electron'
import {autoUpdater} from 'electron-updater'
import logger from 'electron-log'


export function autoUpdateApp() {
  app.commandLine.appendSwitch('disable-http2');
  autoUpdater.requestHeaders = {'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'}
  autoUpdater.logger = logger
// 自动下载更新
  autoUpdater.autoDownload = false
// 退出时自动安装更新
  autoUpdater.autoInstallOnAppQuit = false
// 禁用通过 Web 浏览器下载更新安装程序的功能
//   autoUpdater.disableWebInstaller = true
  logger.info("666666666666666666666666")
  // 每次启动自动更新检查更新版本
  if (is.dev) {
    // 强制在开发环境进行更新检查
    autoUpdater.forceDevUpdateConfig = true;
  }
  // autoUpdater.checkForUpdates();
  // 初始化自动更新器
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("error", (error) => {
    logger.info(["检查更新失败", error]);
  });
  // 当有可用更新的时候触发。 更新将自动下载。
  autoUpdater.on("update-available", (info) => {
    logger.info("检查到有更新，开始下载新版本");
    const {version} = info;
    logger.info(`最新版本为： ${version}`);
    // 这里做的是检测到更新，直接就下载
    autoUpdater.downloadUpdate();
  });
  // 当没有可用更新的时候触发，其实就是啥也不用做
  autoUpdater.on("update-not-available", () => {
    logger.info("没有可用更新");
  });
  // 下载更新包的进度，可以用于显示下载进度与前端交互等
  autoUpdater.on("download-progress", (progress) => {
    logger.info(progress);
  });
  // 在更新下载完成的时候触发。
  autoUpdater.on("update-downloaded", (res) => {
    console.log(666666666666666666666)
    logger.info("下载完毕, 提示安装更新", res);
    // 这里需要注意，Electron.dialog 想要使用，必须在 BrowserWindow 创建之后
    dialog
      .showMessageBox({
        title: "更新应用",
        message: "已为您下载最新应用，点击确定马上替换为最新版本！",
      })
      .then(() => {
        logger.info("退出应用，安装开始！");
        // 重启应用并在下载后安装更新，它只应在发出 update-downloaded 这个事件后方可被调用。
        autoUpdater.quitAndInstall();
      });
  });
}
