import React from 'react';
import { Link } from 'dva/router';
import PageHeader from '../components/PageHeader';
import './PageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div className={wrapperClassName}>
    {top}
    <PageHeader key="pageheader" {...restProps} linkElement={Link} />
    {children ? <div styleName={'content'}>{children}</div> : null}
  </div>
);
