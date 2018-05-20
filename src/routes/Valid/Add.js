import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  message,
  Popconfirm,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import styles from './add.less';
import {setToEn} from '../../utils/utils.js';

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

@connect(({ valid, loading }) => ({
  valid: valid,
  submitting: loading.effects['valid/add'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentWillReceiveProps(nextProps) {

  }
  componentDidMount(){
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'valid/info',
      payload: {
        id: id,
      },
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.valid.info.id;
        let payload = values;
        if(id){
          payload = {
            ...payload,
            id,
          };
        }
        this.props.dispatch({
          type: 'valid/add',
          payload: payload,
          callback: () => {
            message.success('保存成功');

            this.props.dispatch(routerRedux.push('/valid/list'));
          }
        });
      }
    });
  }
  cancel = ()=>{
    this.props.dispatch(routerRedux.push('/valid/list'));
  }
  checkPrice = (rule, value, callback) => {
    if (value.number > 0) {
      callback();
      return;
    }
    callback('Price must greater than zero!');
  }
  render() {
    const { valid: {info}, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <PageHeaderLayout title="基础表单" content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="中文名称：">
              {getFieldDecorator('label', {
                initialValue: info.label,
                rules: [{
                  required: true, message: '中文名称',
                }],
              })(
                <Input onBlur={(e) => {setToEn.bind(this, e.target.value, 'name')()}} placeholder="请输入中文名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="英文名称：">
              {getFieldDecorator('name', {
                initialValue: info.name,
                rules: [{
                  required: true, message: '英文名称',
                }],
              })(
                <Input placeholder="请输入英文名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="简介：">
              {getFieldDecorator('desc', {
                initialValue: info.desc,
              })(
                <TextArea placeholder="简介" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="验证规则：">
              {getFieldDecorator('rule', {
                initialValue: info.rule,
                rules: [{
                  required: true, message: '验证规则',
                }],
              })(
                <CodeArea placeholder="请输入验证规则" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="验证失败信息：">
              {getFieldDecorator('error_msg', {
                initialValue: info.error_msg,
                rules: [{
                  required: true, message: '验证失败信息',
                }],
              })(
                <Input placeholder="请输入验证失败信息" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="验证成功信息：">
              {getFieldDecorator('success_msg', {
                initialValue: info.success_msg,
                rules: [{
                  required: true, message: '验证成功信息',
                }],
              })(
                <Input placeholder="请输入验证成功信息" />
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
