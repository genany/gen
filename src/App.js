import React from 'react';
import { routerRedux, Route, Switch, Link, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Layout from './layouts/Layout';

import UserLogin from '@/modules/User/UserLogin';

// import Authorized from './utils/Authorized'
// import { getQueryPath } from './utils/utils'

const { ConnectedRouter } = routerRedux;
// const { AuthorizedRoute } = Authorized

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Layout app={app} />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
