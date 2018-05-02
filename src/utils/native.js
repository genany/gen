import {notification, message} from 'antd';

export function fixedZero(val) {
  if(window.selectDir){
    selectDir();
  }
}

function isNativeEnable(){
  let enable = !!window.selectDir && !!window.window.startApp && !!window.installApp;
  return enable;
}

function checkNativeEnable(){
  let enable = isNativeEnable();
  if(!enable){
    message.warning('辅助工具即将面世请稍后使用');
  }
  return enable;
}

const native = {
  isNativeEnable: isNativeEnable,
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
      window.selectDir(id);
    }
  },
  openDir: function(id){
    if(checkNativeEnable()){
      window.openDir(id);
    }
  },
  startApp: function(id){
    if(checkNativeEnable()){
      window.startApp(id);
    }
  },
  installApp: function(id){
    if(checkNativeEnable()){
      window.installApp(id);
    }
  },
  openTermimal: function(id){
    if(checkNativeEnable()){
      window.openTermimal(id);
    }
  },
  showLog: function(id){
    if(checkNativeEnable()){
      window.showLog(id);
    }
  }
}

export default native;
