import React from 'react';

import AboutAbout from '../modules/About/About';
import AppList from '../modules/App/List';
import AppAdd from '../modules/App/Add';
import InterList from '../modules/Inter/List';
import InterAdd from '../modules/Inter/Add';
import ScaffoldList from '../modules/Scaffold/List';
import ScaffoldAdd from '../modules/Scaffold/Add';
import LayoutList from '../modules/Layout/List';
import LayoutAdd from '../modules/Layout/Add';
import PageList from '../modules/Page/List';
import PageAdd from '../modules/Page/Add';
import TemplateList from '../modules/Template/List';
import TemplateAdd from '../modules/Template/Add';
import ComponentList from '../modules/Component/List';
import ComponentAdd from '../modules/Component/Add';
import ValidList from '../modules/Valid/List';
import ValidAdd from '../modules/Valid/Add';
import PreviewPreview from '../modules/Preview/Preview';
import Exception403 from '../modules/Exception/403';
import Exception404 from '../modules/Exception/404';
import Exception500 from '../modules/Exception/500';
import ExceptiontriggerException from '../modules/Exception/triggerException';
// import UserLayout from '../modules/UserLayout'
// import UserLogin from '../modules/User/Login'
// import UserRegister from '../modules/User/Register'
// import UserRegisterResult from '../modules/User/RegisterResult'

const NoMatch = props => <h2>404</h2>;

const routerData = [
  {
    path: '/about',
    component: AboutAbout,
    meta: { title: '' }
  },
  {
    path: '/app/list',
    component: AppList,
    meta: { title: '' }
  },
  {
    path: '/app/add/:id',
    component: AppAdd,
    meta: { title: '' }
  },
  {
    path: '/inter/list',
    component: InterList,
    meta: { title: '' }
  },
  {
    path: '/inter/add/:id',
    component: InterAdd,
    meta: { title: '' }
  },
  {
    path: '/scaffold/list',
    component: ScaffoldList,
    meta: { title: '' }
  },
  {
    path: '/scaffold/add/:id',
    component: ScaffoldAdd,
    meta: { title: '' }
  },
  {
    path: '/layout/list',
    component: LayoutList,
    meta: { title: '' }
  },
  {
    path: '/layout/add/:id',
    component: LayoutAdd,
    meta: { title: '' }
  },
  {
    path: '/page/list',
    component: PageList,
    meta: { title: '' }
  },
  {
    path: '/page/add/:app_id/:id/:pid/:inter_id',
    component: PageAdd,
    meta: { title: '' }
  },
  {
    path: '/template/list',
    component: TemplateList,
    meta: { title: '' }
  },
  {
    path: '/template/add/:id',
    component: TemplateAdd,
    meta: { title: '' }
  },
  {
    path: '/component/list',
    component: ComponentList,
    meta: { title: '' }
  },
  {
    path: '/component/add/:id',
    component: ComponentAdd,
    meta: { title: '' }
  },
  {
    path: '/valid/list',
    component: ValidList,
    meta: { title: '' }
  },
  {
    path: '/valid/add/:id',
    component: ValidAdd,
    meta: { title: '' }
  },
  {
    path: '/preview/preview',
    component: PreviewPreview,
    meta: { title: '' }
  },
  {
    path: '/exception/403',
    component: Exception403,
    meta: { title: '' }
  },
  {
    path: '/exception/404',
    component: Exception404,
    meta: { title: '' }
  },
  {
    path: '/exception/500',
    component: Exception500,
    meta: { title: '' }
  }
  // {
  //   path: '/exception/trigger',
  //   component: ExceptiontriggerException,
  //   meta: { title: '' }
  // },
  // {
  //   path: '/user',
  //   component: UserLayout,
  //   meta: { title: '' }
  // },
  // {
  //   path: '/user/login',
  //   component: UserLogin,
  //   meta: { title: '' }
  // },
  // {
  //   path: '/user/register',
  //   component: UserRegister,
  //   meta: { title: '' }
  // }
  // {
  //   path: '/user/register-result',
  //   component: UserRegisterResult,
  //   meta: { title: '' }
  // }
];

export function getRouterData() {
  return routerData;
}

export default getRouterData;
