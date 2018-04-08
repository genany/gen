import React, { PureComponent } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import {
  message,
  Checkbox,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip
} from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from "./preview.less";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ valid, loading }) => ({
  valid: valid,
  submitting: loading.effects["valid/add"]
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentDidMount() {
    let id = 123;
    if (id != 0) {
      this.props.dispatch({
        type: "valid/info",
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
          type: "valid/add",
          payload: values,
          callback: () => {
            message.success("保存成功");

            this.props.dispatch(routerRedux.push("/valid/list"));
          }
        });
      }
    });
  };

  render() {
    const { valid: { info }, submitting } = this.props;
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
            style={{ marginTop: 8 }}>
            <div>额外字段： label: 确认 name: confirm</div>
            <FormItem {...formItemLayout} label="多行：">
              {getFieldDecorator("textarea", {
                initialValue: "textarea"
              })(<TextArea size="" disabled="" placeholder="请输入多行" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="下拉框：">
              <Select defaultValue="lucy">
                <Option value="jack">Jack</Option>
              </Select>
            </FormItem>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator("userName", {
                  rules: [
                    { required: true, message: "Please input your username!" }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Username"
                  />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator("remember", {
                  valuePropName: "checked",
                  initialValue: true
                })(<Checkbox>Remember me</Checkbox>)}
                <a className="login-form-forgot" href="">
                  Forgot password
                </a>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button">
                  Log in
                </Button>
                Or <a href="">register now!</a>
              </FormItem>
            </Form>
            <FormItem {...formItemLayout} label="用户名：">
              {getFieldDecorator("name", {
                initialValue: "name"
              })(<TextArea size="" disabled="" placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="：">
              {getFieldDecorator("email", {
                initialValue: "email"
              })(<Input size="" disabled="" placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="：">
              <Select defaultValue="lucy">
                <Option value="jack">Jack</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="：">
              {getFieldDecorator("sex", {
                initialValue: "sex"
              })(<Checkbox>复选框</Checkbox>)}
            </FormItem>
            <FormItem {...formItemLayout} label="：">
              <Select defaultValue="lucy">
                <Option value="jack">Jack</Option>
              </Select>
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }} />
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
