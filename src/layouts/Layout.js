import React from 'react';
import connect from 'dva';
import { Route, Redirect } from 'dva/router';
import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';
import UserLogin from '@/modules/User/UserLogin';
import UserRegister from '@/modules/User/UserRegister';

import { getRouterData } from '@/common/router';

export default class Layout extends React.Component {
  render() {
    const app = this.props.app;
    const userInfo = app._store.getState().user.userInfo;

    const routerData = getRouterData(app);
    const isLogin = !!userInfo.name || !!localStorage.getItem('user');
    const pathname = this.props.location.pathname;
    const isAbout =
      pathname === '/about' || pathname === '' || pathname === '/';

    return isLogin || isAbout ? (
      <BasicLayout {...this.props}>
        {routerData.map(item => (
          <Route key={item.path} path={item.path} component={item.component} />
        ))}
        <Redirect
          to={{
            pathname: '/about'
          }}
        />
      </BasicLayout>
    ) : (
      <UserLayout {...this.props}>
        <Route path="/user/userLogin" component={UserLogin} />
        <Route path="/user/userRegister" component={UserRegister} />
        <Redirect
          to={{
            pathname: '/user/userLogin'
          }}
        />
      </UserLayout>
    );
  }
}
