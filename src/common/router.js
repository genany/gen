import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/about': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../routes/About/About')),
    },
    '/app/list': {
      component: dynamicWrapper(app, ['app', 'preview'], () => import('../routes/App/List')),
    },
    '/app/add/:id': {
      component: dynamicWrapper(app, ['app', 'interApp', 'scaffold', 'layout', 'preview'], () => import('../routes/App/Add')),
    },
    '/inter/list': {
      component: dynamicWrapper(app, ['inter'], () => import('../routes/Inter/List')),
    },
    '/inter/add/:id': {
      component: dynamicWrapper(app, ['inter', 'interApp'], () => import('../routes/Inter/Add')),
    },
    '/scaffold/list': {
      component: dynamicWrapper(app, ['scaffold'], () => import('../routes/Scaffold/List')),
    },
    '/scaffold/add/:id': {
      component: dynamicWrapper(app, ['scaffold'], () => import('../routes/Scaffold/Add')),
    },
    '/layout/list': {
      component: dynamicWrapper(app, ['layout', 'scaffold'], () => import('../routes/Layout/List')),
    },
    '/layout/add/:id': {
      component: dynamicWrapper(app, ['layout'], () => import('../routes/Layout/Add')),
    },
    '/page/list': {
      component: dynamicWrapper(app, ['page', 'preview', 'scaffold'], () => import('../routes/Page/List')),
    },
    '/page/add/:app_id/:id/:pid': {
      component: dynamicWrapper(app, ['app', 'page', 'template', 'component', 'valid', 'inter', 'preview'], () => import('../routes/Page/Add')),
    },
    '/template/list': {
      component: dynamicWrapper(app, ['template'], () => import('../routes/Template/List')),
    },
    '/template/add/:id': {
      component: dynamicWrapper(app, ['template', 'scaffold'], () => import('../routes/Template/Add')),
    },
    '/component/list': {
      component: dynamicWrapper(app, ['component', 'template'], () => import('../routes/Component/List')),
    },
    '/component/add/:id': {
      component: dynamicWrapper(app, ['component'], () => import('../routes/Component/Add')),
    },
    '/valid/list': {
      component: dynamicWrapper(app, ['valid'], () => import('../routes/Valid/List')),
    },
    '/valid/add/:id': {
      component: dynamicWrapper(app, ['valid'], () => import('../routes/Valid/Add')),
    },
    '/preview/preview': {
      component: dynamicWrapper(app, ['valid'], () => import('../routes/Preview/Preview')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
