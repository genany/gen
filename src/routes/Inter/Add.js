import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Tree,
  message,
  Popconfirm,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import styles from './add.less';
import {setToEn} from '../../utils/utils.js'

const TreeNode = Tree.TreeNode;
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

@connect(({ inter, interApp, loading }) => ({
  inter,
  interApp,
  submitting: loading.effects['inter/add'],
}))
@Form.create()
export default class Add extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if ('match' in nextProps) {
      const id = nextProps.match.params.id;
      if(this.props.match.params.id != id){
        this.props.dispatch({
          type: 'inter/info',
          payload: {
            id: id,
          },
        });
      }
    }
  }
  componentDidMount(){
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'inter/info',
      payload: {
        id: id,
      },
    });
    this.props.dispatch({
      type: 'interApp/list',
      payload: {},
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.inter.info.id;
        let payload = values;
        if(id){
          payload = {
            ...payload,
            id,
          };
        }
        this.props.dispatch({
          type: 'inter/add',
          payload: payload,
          callback: () => {
            message.success('保存成功');

            this.props.dispatch(routerRedux.push('/inter/list'));
          }
        });
      }
    });
  }
  cancel = ()=>{
    this.props.dispatch(routerRedux.push('/page/list'));
  }
  render() {
    const { inter: {info}, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const interAppData = this.props.interApp.data;

    return (
      <PageHeaderLayout title="接口编辑" content="用来编辑或创建接口">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="所属项目：">
            {getFieldDecorator('inter_app_id', {
              initialValue: info.inter_app_id,
              rules: [{
                required: true, message: '所属项目',
              }],
            })(
                <Select>
                  <Option value="">请选择所属项目</Option>
                  {
                    interAppData.list.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>{item.label}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="名称：">
              {getFieldDecorator('label', {
                initialValue: info.label,
                rules: [{
                  required: true, message: '名称',
                }],
              })(
                <Input placeholder="请输入名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="接口分类：">
            {getFieldDecorator('cate_id', {
              initialValue: info.cate_id,
              rules: [{
                required: true, message: '接口分类',
              }],
            })(
              <Select>
                <Option value="1">用户</Option>
                <Option value="2">帖子</Option>
                <Option value="3">视频</Option>
                <Option value="4">支付</Option>
                <Option value="5">订单</Option>
                <Option value="6">商品</Option>
                <Option value="7">公用</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="请求方式：">
            {getFieldDecorator('method', {
              initialValue: info.method,
              rules: [{
                required: true, message: '请求方式',
              }],
            })(
              <Select>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                  <Option value="PUT">PUT</Option>
                  <Option value="OPTIONS">OPTIONS</Option>
                  <Option value="DELETE">DELETE</Option>
                  <Option value="HEAD">HEAD</Option>
                  <Option value="PATCH">PATCH</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="地址：">
              {getFieldDecorator('url', {
                initialValue: info.url,
                rules: [{
                  required: true, message: '地址',
                }],
              })(
                <Input placeholder="/user/userInfo" />
              )}
            </FormItem>
            <FormItem {...formItemLayoutFull} label="请求数据：">
              {getFieldDecorator('req_data', {
                initialValue: info.req_data,
                rules: [{
                  required: true, message: '请求数据',
                }],
              })(
                <CodeArea></CodeArea>
              )}
            </FormItem>
            <FormItem {...formItemLayoutFull} label="响应数据：">
              {getFieldDecorator('res_data', {
                initialValue: info.res_data,
                rules: [{
                  required: true, message: '响应数据',
                }],
              })(
                <CodeArea></CodeArea>
              )}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Popconfirm title="修改不会保存，确认取消吗？" onConfirm={this.cancel}>
                <Button type="danger"  style={{marginLeft: 16}}>
                  取消
                </Button>
              </Popconfirm>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
