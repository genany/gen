import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  message,
  Checkbox,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ valid, loading }) => ({
  valid: valid,
  submitting: loading.effects['valid/add']
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentDidMount() {
    let id = 123;
    if (id != 0) {
      this.props.dispatch({
        type: 'valid/info',
        payload: {
          id: id
        }
      });
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'valid/add',
          payload: values,
          callback: () => {
            message.success('保存成功');

            this.props.dispatch(routerRedux.push('/valid/list'));
          }
        });
      }
    });
  };

  render() {
    const {
      valid: { info },
      submitting
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };

    return (
      <PageHeaderLayout title="" content="">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <div>额外字段： label: 确认 name: confirm</div>
            <FormItem {...formItemLayout} label="文本框：">
              {getFieldDecorator('input', {
                initialValue: 'input'
              })(<Input size="" disabled="" placeholder="请输入文本框" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="a：">
              {getFieldDecorator('name', {
                initialValue: 'name'
              })(<Input size="" disabled="" placeholder="请输入a" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="s：">
              {getFieldDecorator('email', {
                initialValue: 'email'
              })(<TextArea size="" disabled="" placeholder="请输入s" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="d：">
              <Select defaultValue="lucy">
                <Option value="jack">Jack</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="f：">
              {getFieldDecorator('sex', {
                initialValue: 'sex'
              })(<Checkbox>复选框</Checkbox>)}
            </FormItem>
            <FormItem {...formItemLayout} label="g：">
              {getFieldDecorator('age', {
                initialValue: 'age'
              })(<Input size="" disabled="" placeholder="请输入g" />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ marginLeft: 6 }}
              >
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
