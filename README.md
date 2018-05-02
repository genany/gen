如果您对此项目感兴趣欢迎 [star](https://github.com/daycool/gen)，如果您对有问题和建议欢迎 [issues](https://github.com/daycool/gen/issues/new)

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
  3)选择字段使用组件，选择使用组件扩展字段并配置
  4)如果特殊需求自定义添加组件
  5)点击预览按钮查看页面效果（也可以保存后在查看）
1. 进入app管理列表，点击项目下载到本地，之后就跟正常开发一样了

## TODO
1. 模版和组件扩展配置
2. 接口可视化配置
3. 使用electon支持本地预览开发 [辅助工具下载](https://pan.baidu.com/s/1J-E-k-MdbRwGL-Kdsglr5A#list/path=%2Fgen) 
4. 自定义脚手架(vue、react、bootstrap、小程序等)
5. 可拖拽搭建页面
6. 不限语言和框架，通过接口数据生成一切可生成的

## 演示

![扩展字段](http://gen.sdemo.cn/gen.gif)

### 打包bug解决方案

  修改文件node_modules/af-webpack/lib/getConfig.js中test: /\.(js|jsx)$/
  的exclude

    exclude: function(xx){
      console.log(xx)
      var emmetioReg = /node_modules\\@emmetio/;
      var isExclude = /node_modules/.test(xx) && !emmetioReg.test(xx);
      return isExclude;
    },

