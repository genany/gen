

## What?
  Gen是generator前三个字母。
  根据接口生成页面，减少重复性工作！

  目标让用户快速搭建Web App
  
## Why?

  后台管理大部分都是增删改查，大部分都是重复性开发，为解决这个问题创建了Gen这个项目

## How?
  
1. 创建APP,选择使用脚手架，接口，布局
1. 创建页面，
  1)选择页面模版(如： 表单、表格、chart),
  2)选择接口根据字段自动生成配置
  3)如果特殊需求自定义添加组件
  4)点击预览按钮查看页面效果（也可以保存后在查看）
1. 进入app管理列表，点击项目下载到本地，之后就跟正常开发一样了


## Install dependencies

```
yarn
```

## Start server

```
npm start
```


## 打包bug解决方案
修改文件node_modules/af-webpack/lib/getConfig.js中test: /\.(js|jsx)$/
的exclude， 记得引入path
        

exclude: function(xx){
  var sep = path.sep;
  console.log(xx)
  var emmetioPath = 'node_modules' + sep + '@emmetio';
  // var emmetioReg = new RegExp(emmetioPath);
  var emmetioReg = /node_modules\\@emmetio/;
  var isExclude = /node_modules/.test(xx) && !emmetioReg.test(xx);

  if(!isExclude){
    // console.log(xx, isExclude)

  }

  return isExclude;
}

