import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import {appList,
  pageList,
  scaffoldList,
  intefaceList,
  layoutList,
  templateList,
  componentList,
  validList,
  getActivities,
  getNotice,
  getFakeList } from './mock/api';

import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /api/app/list': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: appList,
          pagination: {
            total: appList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/app/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: appList,
          pagination: {
            total: appList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/app/info': {
    $params: {
      id: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          name: 'sdemo',
          label: 'SDemo网站',
          baseUrl: 'http://api.www.sdemo.cn/',
          interface: '管理后台接口',
          scaffold : 'ant-design',
          layout: '顶栏-侧栏-底栏-布局',
          pageCount: 30
      },
    },
  },
  'GET /api/app/add': {
    $params: {
      id: '',
      name: 'sdemo',
      label: 'SDemo网站',
      baseUrl: 'http://api.www.sdemo.cn/',
      interface: '管理后台接口',
      scaffold : 'ant-design',
      layout: '顶栏-侧栏-底栏-布局',
      pageCount: 30
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '1',
          name: 'sdemo',
          label: 'SDemo网站',
          baseUrl: 'http://api.www.sdemo.cn/',
          interface: '管理后台接口',
          scaffold : 'ant-design',
          layout: '顶栏-侧栏-底栏-布局',
          pageCount: 30
      },
    },
  },
  'GET /api/page/list': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: pageList,
          pagination: {
            total: pageList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/page/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: pageList,
          pagination: {
            total: pageList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/page/info': {
    $params: {
      id: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '',
          app: 'SDemo',
          name: '用户编辑',
          path: '/user/info',
          interface: '用户信息接口',
          template: 'form',
          data: {
            formData: {
              title: '',
              desc: '',
              isValid: true,
              validTipPos: '1',
              fields: [
                {
                  name: 'userName',
                  label: '用户名',
                  placeholder: '',
                  type: 'input',
                  defaultValue: '',
                  rules: [
                    {
                      name: 'required',
                      rule: '/.+/',
                      success: '验证通过',
                      errorMsg: '验证失败',
                    },
                    {
                      name: 'email',
                      rule: "/^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$/",
                      success: '验证通过',
                      errorMsg: '请输入email',
                    },
                  ],

                },
                {
                  name: 'userName',
                  label: '用户名',
                  placeholder: '',
                  type: 'input',
                  defaultValue: '',
                  rules: [
                    {
                      name: 'required',
                      rule: '/.+/',
                      success: '验证通过',
                      errorMsg: '请选择性别',
                    },
                  ],
                }
              ],
              confirm: {
                text: '保存',
                before: `
                    function(){
                      alert('执行逻辑之前处理下')
                    }
                `,
                cb: `
                  function(){
                    alert('执行逻辑比如保存数据')
                  }
                `,
                after: `
                  function(){
                    alert('执行逻辑之后处理下')
                  }
                `,
              },
              cancel: {
                text: '取消',
                before: `
                    function(){
                      alert('执行逻辑之前处理下')
                    }
                `,
                cb: `
                  function(){
                    alert('确认取消并返回')
                  }
                `,
                after: `
                  function(){
                    alert('执行逻辑之后处理下')
                  }
                `,
              },
              customBtns: [
                {
                  key: 'reset',
                  text: '重置',
                  before: `
                      function(){
                        alert('执行逻辑之前处理下')
                      }
                  `,
                  cb: `
                    function(){
                      alert('执行逻辑比如保存数据')
                    }
                  `,
                  after: `
                    function(){
                      alert('执行逻辑之后处理下')
                    }
                  `,
                }
              ],
            }
          },
      },
    },
  },
  'GET /api/page/add': {
    $params: {
      id: '',
      app: 'SDemo',
      name: '用户信息页',
      path: '/user/info',
      interface: '用户信息接口',
      template: '详情页',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '1',
          app: 'SDemo',
          name: '用户信息页',
          path: '/user/info',
          interface: '用户信息接口',
          template: '详情页',
      },
    },
  },
  'GET /api/scaffold/list': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: scaffoldList,
          pagination: {
            total: scaffoldList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/scaffold/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: scaffoldList,
          pagination: {
            total: scaffoldList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/scaffold/info': {
    $params: {
      id: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '',
          name: 'ant-desgin',
          label: 'ant-desgin脚手架',
          scaffold: '/scaffold/ant-desgin-scaffold.zip',
          routeFile: '/src/common/router.js',
          menuFile: '/src/common/menu.js',
          pageDir: '/src/routers/',
          storeDir: '/src/storeDir',
      },
    },
  },
  'GET /api/scaffold/add': {
    $params: {
      id: '',
      name: 'ant-desgin',
      label: 'ant-desgin脚手架',
      scaffold: '/scaffold/ant-desgin-scaffold.zip',
      routeFile: '/src/common/router.js',
      menuFile: '/src/common/menu.js',
      pageDir: '/src/routers/',
      storeDir: '/src/storeDir',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '1',
          name: 'ant-desgin',
          label: 'ant-desgin脚手架',
          scaffold: '/scaffold/ant-desgin-scaffold.zip',
          routeFile: '/src/common/router.js',
          menuFile: '/src/common/menu.js',
          pageDir: '/src/routers/',
          storeDir: '/src/storeDir',
      },
    },
  },
  'GET /api/interface/list': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: templateList,
          pagination: {
            total: templateList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/interface/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: templateList,
          pagination: {
            total: templateList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/interface/info': {
    $params: {
      id: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '',
          name: '获取用户信息',
              cate: '用户相关',
              method: 'GET',
              addr: '/user/userInfo',
              reqData: '{userId: 123}',
              resData: `
                {
                  code: 200,
                  msg: '成功',
                  data: {
                    "id": "1",
                    "app_key": "172139920",
                    "role": "1",
                    "avatar": "",
                    "update_time": 1452562322,
                    "create_time": "1447668570",
                    name: 'daycool',
                    notifyCount: 12,
                  }
                }
              `,
      },
    },
  },
  'GET /api/interface/add': {
    $params: {
      id: '',
      name: '获取用户信息',
          cate: '用户相关',
          method: 'GET',
          addr: '/user/userInfo',
          reqData: '{userId: 123}',
          resData: `
            {
              code: 200,
              msg: '成功',
              data: {
                "id": "1",
                "app_key": "172139920",
                "role": "1",
                "avatar": "",
                "update_time": 1452562322,
                "create_time": "1447668570",
                name: 'daycool',
                notifyCount: 12,
              }
            }
          `,
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '1',
          name: '获取用户信息',
              cate: '用户相关',
              method: 'GET',
              addr: '/user/userInfo',
              reqData: '{userId: 123}',
              resData: `
                {
                  code: 200,
                  msg: '成功',
                  data: {
                    "id": "1",
                    "app_key": "172139920",
                    "role": "1",
                    "avatar": "",
                    "update_time": 1452562322,
                    "create_time": "1447668570",
                    name: 'daycool',
                    notifyCount: 12,
                  }
                }
              `,
      },
    },
  },
  'GET /api/layout/list': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: templateList,
          pagination: {
            total: templateList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/layout/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: templateList,
          pagination: {
            total: templateList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/layout/info': {
    $params: {
      id: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '',
          name: '空白布局',
          template: '布局引入文件',
          htmlTemplate: 'html结构',
          jsTemplate: 'js逻辑',
          cssTemplate : 'css样式',
      },
    },
  },
  'GET /api/layout/add': {
    $params: {
      id: '',
      name: '空白布局',
      template: '布局引入文件',
      htmlTemplate: 'html结构',
      jsTemplate: 'js逻辑',
      cssTemplate : 'css样式',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '1',
          name: '空白布局',
          template: '布局引入文件',
          htmlTemplate: 'html结构',
          jsTemplate: 'js逻辑',
          cssTemplate : 'css样式',
      },
    },
  },
  'GET /api/template/list': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: templateList,
          pagination: {
            total: templateList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/template/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: templateList,
          pagination: {
            total: templateList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/template/info': {
    $params: {
      id: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '',
          name: 'form',
          label: '表单',
          template: '',
          htmlTemplate : `
              <PageHeaderLayout title="页面模版编辑" content="用来编辑或创建页面模版">
                <Card bordered={false}>
                  <Form
                    onSubmit={this.handleSubmit}
                    hideRequiredMark
                    style={{ marginTop: 8 }}
                  >
                    {this.getTemplateContent()}

                    <% for item in data.formFields %>
                      <% for component in componentList %>
                        <% if item.type == component.name %>
                          <$ include component.htmlTemplate $>
                        <% endif %>
                      <% endfor %>
                    <% else %>
                      <li>添加点内容吧</li>
                    <% endfor %>

                    <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                      <Button type="primary" htmlType="submit" loading={submitting}>
                        保存
                      </Button>
                    </FormItem>
                  </Form>
                </Card>
              </PageHeaderLayout>
          `,
          jsTemplate: '',
          cssTemplate: '',
          extTemplates: '',
      },
    },
  },
  'GET /api/template/add': {
    $params: {
      id: '',
      name: 'form',
      label: '表单',
      template: '引入HTML、JS、CSS和其它模版文件',
      htmlTemplate: '',
      jsTemplate: '',
      cssTemplate: '',
      extTemplates: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '1',
          name: 'form',
          label: '表单',
          template: '引入HTML、JS、CSS和其它模版文件',
          htmlTemplate: '',
          jsTemplate: '',
          cssTemplate: '',
          extTemplates: '',
      },
    },
  },
  'GET /api/component/list': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: templateList,
          pagination: {
            total: templateList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/component/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: templateList,
          pagination: {
            total: templateList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/component/info': {
    $params: {
      id: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '',
          templateName: '表单',
          name: 'input',
          label: '文本框',
          htmlTemplate: `
            <FormItem {...formItemLayout} label="<$ data.label $>：">
              {getFieldDecorator('<$ data.name $>', {
                initialValue: '<$ data.name $>',
                <% for item in data.rules %>
                rules: [{
                  required: true, message: '请输入<$ item.errMsg $>',
                }],
                <% endfor %>
              })(
                <Input placeholder="请输入<$ data.label $>" />
              )}
            </FormItem>
          `,
          jsTemplate: '',
          cssTemplate: '',
      },
    },
  },
  'GET /api/component/add': {
    $params: {
      id: '',
      templateName: '表单',
      name: 'input',
      label: '文本框',
      htmlTemplate: `
        <FormItem {...formItemLayout} label="<$ data.label $>：">
          {getFieldDecorator('<$ data.name $>', {
            initialValue: '<$ data.name $>',
            <% for item in data.rules %>
            rules: [{
              required: true, message: '请输入<$ item.errMsg $>',
            }],
            <% endfor %>
          })(
            <Input placeholder="请输入<$ data.label $>" />
          )}
        </FormItem>
      `,
      jsTemplate: '',
      cssTemplate: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '1',
          templateName: '表单',
          name: 'input',
          label: '文本框',
          htmlTemplate: `
            <FormItem {...formItemLayout} label="<$ data.label $>：">
              {getFieldDecorator('<$ data.name $>', {
                initialValue: '<$ data.name $>',
                <% for item in data.rules %>
                rules: [{
                  required: true, message: '请输入<$ item.errMsg $>',
                }],
                <% endfor %>
              })(
                <Input placeholder="请输入<$ data.label $>" />
              )}
            </FormItem>
          `,
          jsTemplate: '',
          cssTemplate: '',
      },
    },
  },
  'GET /api/valid/list': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: validList, validList,
          pagination: {
            total: validList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/valid/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          list: validList,
          pagination: {
            total: validList.length,
            pageSize: 10,
            current: parseInt(1, 10) || 1,
          },
      },
    },
  },
  'GET /api/valid/info': {
    $params: {
      id: '99',
      name: 'required',
      label: '必填项',
      exp: 'function(value) {return !!value;}',
      error: '请输入值',
      success: '正确',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '99',
          name: 'required',
          label: '必填项',
          exp: 'function(value) {return !!value;}',
          error: '请输入值',
          success: '正确',
      },
    },
  },
  'GET /api/valid/add': {
    $params: {
      name: '',
      label: '',
      exp: '',
      error: '',
      success: '',
    },
    $body: {
      "code": 200,
      "message": "成功",
      "data": {
          id: '99',
          name: 'required',
          label: '必填项',
          exp: 'function(value) {return !!value;}',
          error: '请输入值',
          success: '正确',
      },

    },
  },
  // 支持值为 Object 和 Array
  'GET /api/user/userInfo': {
    $desc: "获取当前用户接口",
    $params: {

    },
    $body: {
      "code": 200,
      "message": "登录成功",
      "data": {
          "id": "1",
          "app_key": "172139920",
          "user_name": "admin@admin.com",
          "role": "1",
          "avatar": "",
          "update_time": 1452562322,
          "create_time": "1447668570",
          name: 'Serati Ma',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          userid: '00000001',
          notifyCount: 12,
      },
    },
  },
  // 'GET /api/currentUser': {
  //   $desc: "获取当前用户接口",
  //   $params: {
  //     pageSize: {
  //       desc: '分页',
  //       exp: 2,
  //     },
  //   },
  //   $body: {
  //     name: 'Serati Ma',
  //     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  //     userid: '00000001',
  //     notifyCount: 12,
  //   },
  // },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/user/login': (req, res) => {
    const { password, userName, type } = req.body;
    res.send({
      "code": 200,
      "msg": "登录成功",
      "data": {
        "id": 15,
        "user_name": "daycool",
        "user_nicename": null,
        "user_email": "qmw920@163.com",
        "user_url": null
      }
    });
    return ;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin'
      });
      return ;
    }
    if(password === '123456' && userName === 'user'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user'
      });
      return ;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
  },
  'POST /user/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      "timestamp": 1513932555104,
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

export default noProxy ? {} : delay(proxy, 1000);
