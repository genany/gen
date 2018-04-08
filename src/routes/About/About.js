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

@Form.create()
export default class BasicForms extends PureComponent {
  componentWillReceiveProps(nextProps) {

  }
  componentDidMount(){

  }

  render() {

    return (
        <Card bordered={false}>
          <div className="preview markdown-body">
          <h2>What?</h2>
          <pre><code>Gen是generator前三个字母。
          根据接口生成页面，减少重复性工作！

          目标让用户快速搭建Web App
          </code></pre>
          <h2>Why?</h2>
          <pre><code>后台管理大部分都是增删改查，大部分都是重复性开发，为解决这个问题创建了Gen这个项目
          </code></pre>
          <h2>How?</h2>
          <ol>
          <li>创建APP,选择使用脚手架，接口，布局</li>
          <li>创建页面，<br/>
            1.选择页面模版如： 表单、表格、chart <br/>
            2.选择接口根据字段自动生成配置<br/>
            3.如果特殊需求自定义添加组件<br/>
            4.点击预览按钮查看页面效果, 也可以保存后在查看</li>
          <li>进入app管理列表，点击项目下载到本地，之后就跟正常开发一样了</li>
          </ol>
          </div>


        </Card>
    );
  }
}
