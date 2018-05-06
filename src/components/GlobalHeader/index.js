import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, Modal, Button, Badge} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import native from '../../utils/native.js';

export default class GlobalHeader extends PureComponent {
  state = {
    isShowLog: false,
    logs: '',
    logCount: 0,
  }
  componentDidMount(){
    setTimeout(() => {
      if(native.isNativeEnable()){
        native.getLog(data => {
          let logs = this.state.logs;
          this.setState({
            logCount: ++ this.state.logCount,
            logs: logs + '<br/>' + data
          });
        });
      }else{
        this.setState({
          logs: '请安装辅助工具在查看'
        });
      }
    }, 1 * 1000);
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  showLogDialog = () => {
    this.setState({
       isShowLog: true,
     });
  }
   handleOk = (e) => {
     console.log(e);
     this.setState({
       isShowLog: false,
     });
   }
   handleCancel = (e) => {
     console.log(e);
     this.setState({
       isShowLog: false,
     });
   }

  render() {
    const {
      currentUser, collapsed, fetchingNotices, isMobile, logo,
      onNoticeVisibleChange, onMenuClick, onNoticeClear,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        {isMobile && (
          [
            (
              <Link to="/" className={styles.logo} key="logo">
                Gen
              </Link>
            ),
            <Divider type="vertical" key="line" />,
          ]
        )}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />



        <div className={styles.right}>
          <a href="https://github.com/daycool/gen" target="_blank" style={{color: 'rgba(0, 0, 0, 0.65)', fontSize: '16px', 'marginRight': '50px', 'textDecoration': 'none'}}>
            <Icon type="github" />
            GitHub
          </a>
          <Link to="/about" style={{color: 'rgba(0, 0, 0, 0.65)', fontSize: '16px', 'marginRight': '50px', 'textDecoration': 'none'}}>
            关于Gen
          </Link>

          <a onClick={this.showLogDialog} href="javascript:;" style={{color: 'rgba(0, 0, 0, 0.65)', fontSize: '16px', 'marginRight': '50px', 'textDecoration': 'none'}}>
            <Badge count={this.state.logCount}  overflowCount={999} offset={{x: 10}}>
            <span style={{paddingRight: 10}}>日志</span>
            </Badge>
          </a>

          {currentUser.user_name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                <span className={styles.name}>{currentUser.user_name}</span>
              </span>
            </Dropdown>
          ) : <Spin size="small" style={{ marginLeft: 8 }} />}
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
