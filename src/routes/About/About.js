import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  message,
  Popconfirm,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 3 },
  },
};

const formItemLayoutFull = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
    md: { span: 21 },
  },
};
@connect((login) => ({
  login
}))

@connect(({ login, loading }) => ({
  login,
  // submitting: loading.effects['app/add'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentWillReceiveProps(nextProps) {

  }
  componentDidMount(){
    //默认登录
    // console.log(this.props.login)
    if(this.props.login.status != 'ok'){
      this.props.dispatch({
        type: 'login/login',
        payload: {
          user_name: 'yanshi',
          user_pass: '123456',
          type: 'account',
        },
      });
    }
  }

  render() {

    return (
        <Card bordered={false}>
          <div className="preview markdown-body"><p>如果您对此项目感兴趣欢迎 <a href="https://github.com/daycool/gen">star</a>，如果您对有问题和建议欢迎 <a href="https://github.com/daycool/gen/issues/new">issues</a></p>
          <h2>What?</h2>
          <p>Gen是generator前三个字母。<br/>
          根据接口生成页面，减少重复性工作！</p>
          <p>目标让用户快速搭建Web App</p>
          <h2>Why?</h2>
          <p>后台管理大部分都是增删改查，大部分都是重复性开发，为解决这个问题创建了Gen这个项目</p>
          <h2>How?</h2>
          <ol>
          <li>创建APP,选择使用脚手架，接口，布局</li>
          <li>创建页面，<br/>
          1)选择页面模版(如： 表单、表格、chart),<br/>
          2)选择接口根据字段自动生成配置<br/>
          3)选择字段使用组件，选择使用组件扩展字段并配置<br/>
          4)如果特殊需求自定义添加组件<br/>
          5)点击预览按钮查看页面效果（也可以保存后在查看）</li>
          <li>进入app管理列表，点击项目下载到本地，之后就跟正常开发一样了</li>
          </ol>
          <h2>TODO</h2>
          <ol>
          <li>模版和组件扩展配置</li>
          <li>接口可视化配置</li>
          <li>使用electon支持本地预览开发 <a href="https://pan.baidu.com/s/1J-E-k-MdbRwGL-Kdsglr5A#list/path=%2Fgen" target="_blank">辅助工具下载</a></li>
          <li>自定义脚手架(vue、react、bootstrap、小程序等)</li>
          <li>可拖拽搭建页面</li>
          <li>不限语言和框架，通过接口数据生成一切可生成的</li>
          </ol>
          <h2>演示</h2>
          <p><img src="http://gen.sdemo.cn/gen.gif" alt="扩展字段" /></p>
          </div>

        </Card>
    );
  }
}
