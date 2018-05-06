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
    notification.warning({
      message: '请安装辅助工具',
      description: (<a href="https://pan.baidu.com/s/1J-E-k-MdbRwGL-Kdsglr5A#list/path=%2Fgen" target="_blank">辅助工具下载</a>),
    });
  }
  return enable;
}

const native = {
  isNativeEnable: isNativeEnable,
  getProject: function(id){
    if(checkNativeEnable()){
      return window.getProject(id);
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
  getLog: function(id){
    if(checkNativeEnable()){
      window.getLog(id);
    }
  }
}

export default native;
