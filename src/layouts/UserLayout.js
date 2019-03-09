import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from './GlobalFooter';
import './UserLayout.less';
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: ''
  },
  {
    key: 'privacy',
    title: '隐私',
    href: ''
  },
  {
    key: 'terms',
    title: '条款',
    href: ''
  }
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 Gen
  </Fragment>
);

function getLoginPathWithRedirectPath() {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect
  });
}

class UserLayout extends React.PureComponent {
  getPageTitle() {
    // const { location } = this.props
    // const routerData = getRouterData()
    // const { pathname } = location
    let title = 'Gen';
    // let currRouterData = null
    // // match params path
    // routerData.forEach(item => {
    //   if (pathToRegexp(item.path).test(pathname)) {
    //     currRouterData = item
    //   }
    // })

    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div styleName={'user-layout-container '}>
          <div styleName={'user-layout-content'}>
            <div styleName={'user-layout-top'}>
              <div styleName={'user-layout-header'}>
                <Link to="/">
                  <span styleName={'user-layout-title'}>Gen</span>
                </Link>
              </div>
              <div styleName={'user-layout-desc'} />
            </div>
            <Switch>{this.props.children}</Switch>
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
