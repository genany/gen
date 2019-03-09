import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import './UserLogin.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ user }) => ({ user }))
export default class UserRegister extends React.Component {
  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'user/register',
          payload: {
            ...values
          },
          callback: res => {
            if (res.code === 200) {
              this.props.dispatch(routerRedux.push('/user/userLogin'));
            }
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.props.user);
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('account', {
            initialValue: '',
            rules: [{ required: true, message: '请输入登录号' }]
          })(
            <Input
              size="large"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入登录号"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('name', {
            initialValue: '',
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
          {getFieldDecorator('password', {
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
          {getFieldDecorator('confirmPassword', {
            rules: [
              { required: true, message: '请输入确认密码' },
              {
                validator: (rule, value, callback) => {
                  const form = this.props.form;
                  if (value && value !== form.getFieldValue('password')) {
                    callback('两次输入密码不一致');
                  } else {
                    callback();
                  }
                }
              }
            ]
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请输入确认密码"
            />
          )}
        </FormItem>
        <FormItem>
          {/* {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>记住我</Checkbox>)}
          <a className='login-form-forgot' href=''>忘记密码</a> */}
          <Button size="large" type="primary" htmlType="submit" className="login-form-button">
            注册
          </Button>
          <Link to="/user/userLogin">
            <Button
              size="large"
              type="default"
              htmlType="submit"
              className="login-form-button"
              style={{ marginTop: 16 }}
            >
              登录
            </Button>
          </Link>
        </FormItem>
      </Form>
    );
  }
}
