import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  message,
  Checkbox,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './preview.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ valid, loading }) => ({
  valid: valid,
  submitting: loading.effects['valid/add'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentDidMount(){
    let id = 123;
    if(id != 0){
      this.props.dispatch({
        type: 'valid/info',
        payload: {
          id: id,
        },
      });
    }
  }
  handleSubmit = (e) => {
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
  }

  <% for btn in pageTemplateData.customBtns %>
    <$ btn.key + 'BeforeHandle' $> = (e) => {
      <$ btn.before $>
    }
    <$ btn.key + 'Handle' $> = (e) => {
      if(!this.<$ btn.key + 'BeforeHandle()' $>) return ;

      <$ btn.cb $>

      this.<$ btn.key + 'AfterHandle();' $>
    }
    <$ btn.key + 'AfterHandle' $> = (e) => {
      <$ btn.after $>
    }
  <% endfor %>

  render() {
    const { valid: {info}, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
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
        sm: { span: 10, offset: 7 },
      },
    };

    return (
<PageHeaderLayout title="<$ pageData.title $>" content="<$ pageData.desc $>">
  <Card bordered={false}>
    <Form
      onSubmit={this.handleSubmit}
      hideRequiredMark
      style={{ marginTop: 8 }}
    >

      <% for componentItemData in pageComponentData %>
        <$ renderComponentByName(componentItemData) $>
      <% endfor %>

      <% for field in pageTemplateData.fields %>
        <$ renderComponentByName(field) $>
      <% endfor %>

      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <% if pageTemplateData.confirm %>
        <Button type="primary" htmlType="submit" loading={submitting}>
          <$ pageTemplateData.confirm.text $>
        </Button>
        <% endif %>
        <% if pageTemplateData.cancel %>
        <Button type="primary" htmlType="submit" loading={submitting}>
          <$ pageTemplateData.cancel.text $>
        </Button>
        <% endif %>
        <% for btn in pageTemplateData.customBtns %>
          <Button type="reset" onClick={<$ 'this.' + btn.key + 'Handle' $>} htmlType="submit" loading={submitting}>
            <$ btn.text $>
          </Button>
        <% endfor %>
      </FormItem>
    </Form>
  </Card>
</PageHeaderLayout>
    );
  }
}
