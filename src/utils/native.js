import {notification, message} from 'antd';

function isNativeEnable(){
  let enable = !!window.selectDir && !!window.window.startApp && !!window.installApp;
  return enable;
}

function checkNativeEnable(){
  let enable = isNativeEnable();
  if(!enable){
    notification.warning({
      message: '请安装辅助工具',
      description: (<a href="https://pan.baidu.com/s/1J-E-k-MdbRwGL-Kdsglr5A#list/path=%2Fgen" target="_blank">辅助工具下载</a>),
    });
  }
  return enable;
}


const native = {
  isNativeEnable: isNativeEnable,
  checkNativeEnable: checkNativeEnable,
  checkIsStart: function(id){

  },
  isEnablePreview: function(id){
    if(isNativeEnable()){
      if(this.checkIsDownloadProject(id)){
        return true;
      }
    }
    return false;
  },
  checkIsDownloadProject: function(id){
    let project = this.getProject(id);
    let isDownloaded = !! (project && project.projectPath);
    if(!isDownloaded){
      message.warning({
        message: '请先下载app到本地',
      });
    }

    return isDownloaded;
  },
  getProject: function(id){
    if(checkNativeEnable()){
      return window.getProject(id);
    }
  },
  scaffoldFiles: function(scaffoldData, cb){
    if(checkNativeEnable()){
      window.scaffoldFiles(scaffoldData, cb);
    }
  },
  getFileContent: function(data, cb){
    if(checkNativeEnable()){
      window.getFileContent(data.file, cb);
    }
  },
  preview: function(pageData, appData, scaffoldData, interData, cb){
    if(this.isEnablePreview(pageData.app_id)){
      window.preview(pageData, appData, scaffoldData, interData, cb);
    }
  },
  savePage: function(pageData, appData, scaffoldData, interData, cb){
    if(this.isEnablePreview(pageData.app_id)){
      window.savePage(pageData, appData, scaffoldData, interData, cb);
    }
  },
  getPreviewUrl: function(id){
    if(isNativeEnable()){
      return window.getPreviewUrl(id);
    }else{
      return 'http://scaffold.sdemo.cn';
    }
  },
  getPreviewPageUrl: function(id, path){
    if(isNativeEnable()){
      return window.getPreviewPageUrl(id, path);
    }else{
      return 'http://scaffold.sdemo.cn/#' + path;
    }
  },
  selectDir: function(id){
    if(checkNativeEnable()){
      return window.selectDir(id);
    }
  },
  openDir: function(id){
    if(checkNativeEnable()){
      if(!this.checkIsDownloadProject(id)){
        return ;
      }
      window.openDir(id);
    }
  },
  startApp: function(id){
    if(checkNativeEnable()){
      if(!this.checkIsDownloadProject(id)){
        return ;
      }
      window.startApp(id);
    }
  },
  installApp: function(id){
    if(checkNativeEnable()){
      if(!this.checkIsDownloadProject(id)){
        return ;
      }
      window.installApp(id);
    }
  },
  openTermimal: function(id){
    if(checkNativeEnable()){
      if(!this.checkIsDownloadProject(id)){
        return ;
      }
      window.openTermimal(id);
    }
  },
  getLog: function(id){
    if(checkNativeEnable()){
      window.getLog(id);
    }
  }
}

export default native;
