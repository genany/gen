import React from 'react';
import { Form, Menu, Icon, Spin, Avatar, Badge, Modal, Dropdown } from 'antd';
import BaseMenu from '../../components/SiderMenu/BaseMenu';

import { Link } from 'dva/router';
import { connect } from 'dva';
import native from '../../utils/native.js';

import './index.less';

@Form.create()
@connect(({ user }) => ({
  user
}))
export default class GlobalHeader extends React.Component {
  state = {
    currentUser: { name: 'daycool' },
    isShowLog: false,
    logs: '',
    logCount: 0
  };
  componentDidMount() {
    setTimeout(() => {
      if (native.isNativeEnable()) {
        native.getLog(data => {
          let logs = this.state.logs;
          this.setState({
            logCount: this.state.logCount + 1,
            logs: logs + '<br/>' + data
          });
        });
      } else {
        this.setState({
          logs: '请安装辅助工具在查看'
        });
      }
    }, 1 * 1000);
  }
  showLogDialog = () => {
    this.setState({
      isShowLog: true,
      logCount: 0
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      isShowLog: false
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      isShowLog: false
    });
  };

  onMenuClick = ({ key }) => {
    // if (key  ===  'triggerError') {
    //   this.props.dispatch(routerRedux.push('/exception/trigger'))
    //   return
    // }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'user/logout',
        payload: {},
        callback: res => {
          if (res.code === 200) {
            // this.props.dispatch(routerRedux.push('/user/userLogin'))
            window.location.reload();
          }
        }
      });
    }
  };

  render() {
    const currentUser = this.state.currentUser;
    const menu = (
      <Menu styleName="menu" selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />
          个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />
          设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <div styleName="header">
        <div styleName="logo">
          <h1>Gen</h1>
        </div>
        <BaseMenu {...this.props} style={{ border: 'none' }} />
        <div styleName="right">
          <a
            href="https://github.com/daycool/gen"
            target="_blank"
            styleName="link-item"
          >
            <Icon type="github" />
            GitHub
          </a>
          <a
            href="http://doc.gen.sdemo.cn"
            target="_blank"
            styleName="link-item"
          >
            文档
          </a>

          {!this.props.isMobile && (
            <span>
              <Link to="/about" styleName="link-item">
                关于Gen
              </Link>
              <a
                onClick={this.showLogDialog}
                href="javascript:;"
                styleName="link-item"
              >
                <Badge
                  count={this.state.logCount}
                  overflowCount={999}
                  offset={{ x: 10 }}
                >
                  <span style={{ paddingRight: 10 }}>日志</span>
                </Badge>
              </a>
            </span>
          )}
          {currentUser.name ? (
            <Dropdown overlay={menu} placement="topCenter">
              <span styleName={`account`}>
                <Avatar
                  size="small"
                  styleName="avatar"
                  src={currentUser.avatar}
                />
                <span styleName="name">{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
        <Modal
          title="日志"
          visible={this.state.isShowLog}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div dangerouslySetInnerHTML={{ __html: this.state.logs }} />
        </Modal>
      </div>
    );
  }
}
