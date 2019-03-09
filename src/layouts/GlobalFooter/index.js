import React from 'react';
import { Icon } from 'antd';
import './index.less';

class GlobalFooter extends React.Component {
  state = {};
  render() {
    return (
      <div styleName="footer">
        <div styleName={'links'}>
          <a href="http://www.sdemo.cn" target="_blank">
            SDemo
          </a>
          <a href="https://github.com/daycool/gen" target="_blank">
            <Icon type="github" />
          </a>
          <a href="http://gen.sdemo.cn" target="_blank">
            Gen
          </a>
        </div>
        Copyright <Icon type="copyright" /> 2018 Daycool
      </div>
    );
  }
}

export default GlobalFooter;
