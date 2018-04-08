import { parse } from 'url';

export const appList = [
  {
    name: 'sdemo',
    label: 'SDemo网站',
    baseUrl: 'http://api.www.sdemo.cn/',
    interface: '管理后台接口',
    scaffold : 'ant-design',
    layout: '顶栏-侧栏-底栏-布局',
    pageCount: 30
  },
  {
    name: 'sdemo',
    label: 'SDemo网站',
    baseUrl: 'http://api.www.sdemo.cn/',
    interface: '管理后台接口',
    scaffold : 'ant-design',
    layout: '顶栏-侧栏-底栏-布局',
    pageCount: 30
  },
  {
    name: 'sdemo',
    label: 'SDemo网站',
    baseUrl: 'http://api.www.sdemo.cn/',
    interface: '管理后台接口',
    scaffold : 'ant-design',
    layout: '顶栏-侧栏-底栏-布局',
    pageCount: 30
  },
  {
    name: 'sdemo',
    label: 'SDemo网站',
    baseUrl: 'http://api.www.sdemo.cn/',
    interface: '管理后台接口',
    scaffold : 'ant-design',
    layout: '顶栏-侧栏-底栏-布局',
    pageCount: 30
  },
];

export const pageList = [
  {
    app: 'SDemo',
    name: '用户信息页',
    path: '/user/info',
    interface: '用户信息接口',
    template: '详情页',
  },
  {
    app: 'SDemo',
    name: '用户列表页',
    path: '/user/list',
    interface: '用户列表接口',
    template: '列表',
  },
  {
    app: 'SDemo',
    name: '用户编辑页',
    path: '/user/edit',
    interface: '用户编辑接口',
    template: '表单',
  },
];
export const scaffoldList = [
  {
    name: 'ant-desgin',
    label: 'ant-desgin脚手架',
    scaffold: '/scaffold/ant-desgin-scaffold.zip',
    routeFile: '/src/common/router.js',
    menuFile: '/src/common/menu.js',
    pageDir: '/src/routers/',
    storeDir: '/src/storeDir',
  },
  {
    name: 'element',
    label: 'ElementUI脚手架',
    scaffold: '/scaffold/Element-scaffold.zip',
    routeFile: '/src/common/router.js',
    menuFile: '/src/common/menu.js',
    pageDir: '/src/routers/',
    storeDir: '/src/storeDir',
  },
  {
    name: 'Bootstrap',
    label: 'Bootstrap脚手架',
    scaffold: '/scaffold/Bootstrap-scaffold.zip',
    routeFile: '/src/common/router.js',
    menuFile: '/src/common/menu.js',
    pageDir: '/src/routers/',
    storeDir: '/src/storeDir',
  },
];
export const interfaceList = [
  {
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
  {
    name: '保存用户信息',
    cate: '用户相关',
    method: 'GET',
    addr: '/user/saveInfo',
    reqData: `
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
  {
    name: '获取订单列表用户信息',
    cate: '订单相关',
    method: 'GET',
    addr: '/order/orderList',
    reqData: '{page: 1, pageSize: 20}',
    resData: `
      {
        code: 200,
        msg: '成功',
        data: {
          page: 1,
          pageSize: 20,
          total: 1000,
          list: [
            {
              "id": "1",
              "app_key": "172139920",
              "role": "1",
              "avatar": "",
              "update_time": 1452562322,
              "create_time": "1447668570",
              name: 'daycool',
              notifyCount: 12,
            }
          ]
        }
      }
    `,
  },
];
export const layoutList = [
  {
    name: '空白布局',
    template: '布局引入文件',
    htmlTemplate: 'html结构',
    jsTemplate: 'js逻辑',
    cssTemplate : 'css样式',
  },
  {
    name: '固定顶栏-底栏响应式布局',
    template: '布局引入文件',
    htmlTemplate: 'html结构',
    jsTemplate: 'js逻辑',
    cssTemplate : 'css样式',
  },
  {
    name: '顶栏-侧栏-底栏-布局',
    template: '布局引入文件',
    htmlTemplate: 'html结构',
    jsTemplate: 'js逻辑',
    cssTemplate : 'css样式',
  },
  {
    name: '顶栏-侧栏-底栏-响应式布局',
    template: '布局引入文件',
    htmlTemplate: 'html结构',
    jsTemplate: 'js逻辑',
    cssTemplate : 'css样式',
  },
  {
    name: '顶栏-底栏布局',
    template: '布局引入文件',
    htmlTemplate: 'html结构',
    jsTemplate: 'js逻辑',
    cssTemplate : 'css样式',
  },
];
export const componentList = [
  {
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
  {
    templateName: '表单',
    name: 'textarea',
    label: '多行',
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
          <TextArea placeholder="请输入<$ data.label $>" />
        )}
      </FormItem>
    `,
    jsTemplate: '',
    cssTemplate: '',
  },
  {
    templateName: '表单',
    name: 'checkbox',
    label: '复选框',
    htmlTemplate: `<FormItem {...formItemLayout} label="<$ data.label $>：">
        {getFieldDecorator('<$ data.name $>', {
          initialValue: '<$ data.name $>',
          <% for item in data.rules %>
          rules: [{
            required: true, message: '请输入<$ item.errMsg $>',
          }],
          <% endfor %>
        })(
        <Checkbox >复选框</Checkbox>
        )}
      </FormItem>`,
    jsTemplate: '',
    cssTemplate: '',
  },
  {
    templateName: '表单',
    name: 'select',
    label: '下拉框',
    htmlTemplate: `<FormItem  label="<$ data.label $>：">
          <Select defaultValue="lucy" style={{ width: 120 }} >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
      </FormItem>`,
    jsTemplate: '',
    cssTemplate: '',
  },
];

export const templateList = [
  {
    name: 'form',
    label: '表单',
    template: '引入HTML、JS、CSS和其它模版文件',
  },
  {
    name: 'list',
    label: '表格',
    template: '引入HTML、JS、CSS和其它模版文件',
  },
  {
    name: 'detail',
    label: '详情',
    template: '引入HTML、JS、CSS和其它模版文件',
  },
];

export const validList = [{
  "id": 2,
  "name": "required",
  "label": "必填项",
  "exp": "function(value) {return !!value;}",
  "error": "请输入值",
  "success": "正确"
}, {
  "id": 3,
  "name": "email",
  "label": "邮箱",
  "exp": "/^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$/",
  "error": "请输入合法邮箱",
  "success": "正确"
}, {
  "id": 4,
  "name": "phone",
  "label": "手机号",
  "exp": "/^1[35789]\\d{9}$/",
  "error": "请输入合法手机号",
  "success": "正确"
}, {
  "id": 5,
  "name": "custom",
  "label": "自定义",
  "exp": null,
  "error": null,
  "success": "正确"
}, {
  "id": 6,
  "name": "username",
  "label": "验证用户名",
  "exp": "/\\d/",
  "error": "失败",
  "success": "成功"
}];

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/uVZonEtjWwmUZPBQfycs.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

export function fakeList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      avatar: avatars[i % 8],
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
      status: ['active', 'exception', 'normal'][i % 3],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - (1000 * 60 * 60 * 2 * i)),
      createdAt: new Date(new Date().getTime() - (1000 * 60 * 60 * 2 * i)),
      subDescription: desc[i % 5],
      description: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content: '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
        },
      ],
    });
  }

  return list;
}

export function getFakeList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  const count = (params.count * 1) || 20;

  const result = fakeList(count);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export const getNotice = [
  {
    id: 'xxx1',
    title: titles[0],
    logo: avatars[0],
    description: '那是一种内在的东西，他们到达不了，也无法触及的',
    updatedAt: new Date(),
    member: '科学搬砖组',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx2',
    title: titles[1],
    logo: avatars[1],
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    updatedAt: new Date('2017-07-24'),
    member: '全组都是吴彦祖',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx3',
    title: titles[2],
    logo: avatars[2],
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    updatedAt: new Date(),
    member: '中二少女团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx4',
    title: titles[3],
    logo: avatars[3],
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    updatedAt: new Date('2017-07-23'),
    member: '程序员日常',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx5',
    title: titles[4],
    logo: avatars[4],
    description: '凛冬将至',
    updatedAt: new Date('2017-07-23'),
    member: '高逼格设计天团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx6',
    title: titles[5],
    logo: avatars[5],
    description: '生命就像一盒巧克力，结果往往出人意料',
    updatedAt: new Date('2017-07-23'),
    member: '骗你来学计算机',
    href: '',
    memberLink: '',
  },
];

export const getActivities = [
  {
    id: 'trend-1',
    updatedAt: new Date(),
    user: {
      name: '曲丽丽',
      avatar: avatars2[0],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-2',
    updatedAt: new Date(),
    user: {
      name: '付小小',
      avatar: avatars2[1],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-3',
    updatedAt: new Date(),
    user: {
      name: '林东东',
      avatar: avatars2[2],
    },
    group: {
      name: '中二少女团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-4',
    updatedAt: new Date(),
    user: {
      name: '周星星',
      avatar: avatars2[4],
    },
    project: {
      name: '5 月日常迭代',
      link: 'http://github.com/',
    },
    template: '将 @{project} 更新至已发布状态',
  },
  {
    id: 'trend-5',
    updatedAt: new Date(),
    user: {
      name: '朱偏右',
      avatar: avatars2[3],
    },
    project: {
      name: '工程效能',
      link: 'http://github.com/',
    },
    comment: {
      name: '留言',
      link: 'http://github.com/',
    },
    template: '在 @{project} 发布了 @{comment}',
  },
  {
    id: 'trend-6',
    updatedAt: new Date(),
    user: {
      name: '乐哥',
      avatar: avatars2[5],
    },
    group: {
      name: '程序员日常',
      link: 'http://github.com/',
    },
    project: {
      name: '品牌迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
];


export default {
  getNotice,
  getActivities,
  getFakeList,
};
