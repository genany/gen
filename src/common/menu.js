import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'app管理',
    icon: 'appstore',
    path: 'app',
    children: [
      {
        name: 'app列表',
        path: 'list'
      },
      {
        name: 'app创建',
        path: 'add/0'
      }
    ]
  },
  {
    name: '页面管理',
    icon: 'file',
    path: 'page',
    children: [
      {
        name: 'page列表',
        path: 'list'
      },
      {
        name: 'page创建',
        path: 'add/0/0/0/0'
      }
    ]
  },
  {
    name: '脚手架管理',
    icon: 'table',
    path: 'scaffold',
    children: [
      {
        name: 'scaffold列表',
        path: 'list'
      },
      {
        name: 'scaffold创建',
        path: 'add/0'
      }
    ]
  },
  {
    name: '接口管理',
    icon: 'database',
    path: 'inter',
    children: [
      {
        name: '接口列表',
        path: 'list'
      },
      {
        name: '接口创建',
        path: 'add/0'
      }
    ]
  },
  {
    name: '布局管理',
    icon: 'layout',
    path: 'layout',
    children: [
      {
        name: 'layout列表',
        path: 'list'
      },
      {
        name: 'layout创建',
        path: 'add/0'
      }
    ]
  },
  {
    name: '模版管理',
    icon: 'form',
    path: 'template',
    children: [
      {
        name: '模版列表',
        path: 'list'
      },
      {
        name: '模版创建',
        path: 'add/0'
      }
    ]
  },
  {
    name: '组件管理',
    icon: 'copy',
    path: 'component',
    children: [
      {
        name: '组件列表',
        path: 'list'
      },
      {
        name: '组件创建',
        path: 'add/0'
      }
    ]
  },
  {
    name: '验证管理',
    icon: 'warning',
    path: 'valid',
    children: [
      {
        name: '验证列表',
        path: 'list'
      },
      {
        name: '验证创建',
        path: 'add/0'
      }
    ]
  }
  // {
  //   name: '异常页',
  //   icon: 'warning',
  //   path: 'exception',
  //   children: [{
  //     name: '403',
  //     path: '403',
  //   }, {
  //     name: '404',
  //     path: '404',
  //   }, {
  //     name: '500',
  //     path: '500',
  //   }, {
  //     name: '触发异常',
  //     path: 'trigger',
  //     hideInMenu: true,
  //   }],
  // },
  // {
  //   name: '账户',
  //   icon: 'user',
  //   path: 'user',
  //   authority: 'guest',
  //   children: [{
  //     name: '登录',
  //     path: 'login',
  //   }, {
  //     name: '注册',
  //     path: 'register',
  //   }, {
  //     name: '注册结果',
  //     path: 'register-result',
  //   }
  //   ],
  // }
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
