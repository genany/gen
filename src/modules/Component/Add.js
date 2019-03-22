import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { message, Popconfirm, Form, Input, Select, Button, Card, Radio } from 'antd';

import CodeArea from '../../components/CodeArea';
import ExtraField from '../../components/ExtraField';
import { setToEn } from '../../utils/utils.js';
import { formItemLayout, submitFormLayout, formItemLayoutFull } from '../../utils/formLayout.js';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(({ component, template, loading }) => ({
  component,
  template,
  submitting: loading.effects['component/add']
}))
@Form.create()
export default class Add extends PureComponent {
  componentWillReceiveProps(nextProps) {}
  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'component/info',
      payload: {
        id: id
      }
    });
    this.props.dispatch({
      type: 'component/list',
      payload: {}
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.component.info.id;
        let payload = values;
        if (id) {
          payload = {
            ...payload,
            id
          };
        }
        this.props.dispatch({
          type: 'component/add',
          payload: payload,
          callback: resData => {
            if (resData.code === 200) {
              message.success('保存成功');
              this.props.dispatch(routerRedux.push('/component/list'));
            }
          }
        });
      }
    });
  };
  cancel = () => {
    this.props.dispatch(routerRedux.push('/component/list'));
  };
  render() {
    const {
      component: { info },
      submitting
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const componentData = this.props.component.data || { list: [] };

    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="父组件：">
            {getFieldDecorator('pid', {
              initialValue: info.pid || ''
            })(
              <Select>
                <Option value="">无</Option>
                {componentData.list &&
                  componentData.list.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.label}
                      </Option>
                    );
                  })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="独立组件：">
            {getFieldDecorator('dependent', {
              initialValue: info.dependent,
              rules: [
                {
                  required: true,
                  message: '请选择是否独立组件'
                }
              ]
            })(
              <RadioGroup>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="中文名称：">
            {getFieldDecorator('label', {
              initialValue: info.label,
              rules: [
                {
                  required: true,
                  message: '请输入中文名称'
                }
              ]
            })(
              <Input
                onBlur={e => {
                  setToEn.bind(this, e.target.value, 'name')();
                }}
                placeholder="请输入中文名称"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="英文名称：">
            {getFieldDecorator('name', {
              initialValue: info.name,
              rules: [
                {
                  required: true,
                  message: '请输入英文名称'
                }
              ]
            })(<Input placeholder="请输入英文名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="简介：">
            {getFieldDecorator('desc', {
              initialValue: info.desc
            })(<Input placeholder="请输入简介" />)}
          </FormItem>
          <FormItem {...formItemLayoutFull} label="模板：">
            {getFieldDecorator('template', {
              initialValue: info.template,
              rules: [
                {
                  required: true,
                  message: '模板'
                }
              ]
            })(<CodeArea height="200px" placeholder="请输入模板" />)}
          </FormItem>
          <FormItem {...formItemLayoutFull}>
            {getFieldDecorator('extra_field', {
              initialValue: info.extra_field
            })(<ExtraField placeholder="扩展字段" />)}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              保存
            </Button>
            <Popconfirm title="修改不会保存，确认取消吗？" onConfirm={this.cancel}>
              <Button type="danger" style={{ marginLeft: 16 }}>
                取消
              </Button>
            </Popconfirm>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
