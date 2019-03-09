import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import './UserLogin.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ user }) => ({ user }))
export default class UserLogin extends React.Component {
  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'user/login',
          payload: {
            ...values
          },
          callback: res => {
            if (res.code === 200) {
              this.props.dispatch(routerRedux.push('/'));
            } else {
              // message.error(res.msg)
            }
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} styleName="login-form">
        <FormItem>
          {getFieldDecorator('user_name', {
            initialValue: 'yanshi',
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入用户名"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('user_pass', {
            initialValue: '123456',
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请输入密码"
            />
          )}
        </FormItem>
        <FormItem>
          {/* {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>记住我</Checkbox>)}
          <a styleName='login-form-forgot' href=''>忘记密码</a> */}
          <Button size="large" type="primary" htmlType="submit" styleName="login-form-button">
            登录
          </Button>
          {/* <Link to='/user/userRegister'>
            <Button
              size='large'
              type='default'
              htmlType='submit'
              styleName='login-form-button'
              style={{ marginTop: 16 }}
            >
              注册
            </Button>
          </Link> */}
        </FormItem>
      </Form>
    );
  }
}
