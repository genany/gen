import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row, Col,
  message,
  Popconfirm,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import ExtraField from '../../components/ExtraField';
import { uuid } from '../../utils/utils.js';
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

@connect(({ template, scaffold, loading }) => ({
  template,
  scaffold,
  submitting: loading.effects['template/add'],
}))
@Form.create()
export default class Add extends PureComponent {

  componentWillReceiveProps(nextProps) {

  }
  componentDidMount(){
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'template/info',
      payload: {
        id: id,
      },
    });
    this.props.dispatch({
      type: 'scaffold/list',
      payload: {},
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.template.info.id;
        let payload = values;
        if(id){
          payload = {
            ...payload,
            id,
          };
        }
        this.props.dispatch({
          type: 'template/add',
          payload: payload,
          callback: () => {
            message.success('保存成功');

            this.props.dispatch(routerRedux.push('/template/list'));
          }
        });
      }
    });
  }
  cancel = ()=>{
    this.props.dispatch(routerRedux.push('/template/list'));
  }
  addExtraField = () => {
    let extraField = {
      name: '',
      label: '',
      desc: '',
      type: '',
      options: [],
      default_value: '',
    };

    this.props.dispatch({
      type: 'template/addExtraField',
      payload: extraField,
    });
  }

  change = (value, name, record) => {
    const extraField = this.props.template.info.extra_field;
    extraField.forEach(item => {
      if(item.key == record.key){
        item[name] = value;
      }
    });
    this.props.dispatch({
      type: 'template/updateExtraField',
      payload: extraField
    });
  }

  renderExtraField = (extra_field) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return extra_field.map((item, index) => {
      return (
        <FormItem key={item.key} {...formItemLayoutFull} label={'扩展字段' + (index + 1)}>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Input value={item.name} onChange={e => {this.change(e.target.value, 'name', item)}} placeholder="请输入英文名称"/>
            </Col>
            <Col className="gutter-row" span={8}>
              <Input value={item.label} onChange={e => {this.change(e.target.value, 'label', item)}} placeholder="请输入中文名称"/>
            </Col>
            <Col className="gutter-row" span={8}>
              <TextArea rows="1" value={item.desc} onChange={e => {this.change(e.target.value, 'desc', item)}} placeholder="请输入简介" />
            </Col>
            <Col className="gutter-row" span={8}>
              <Select value={item.type} onChange={e => {this.change(e, 'type', item)}} placeholder="请选择类型">
                <Option value="">请选择字段类型</Option>
                <Option value="1">文本</Option>
                <Option value="2">下拉选择</Option>
                <Option value="3">复选</Option>
                <Option value="4">单选</Option>
              </Select>
            </Col>
            <Col className="gutter-row" span={8}>
              <TextArea rows="1" value={item.options} onChange={e => {this.change(e.target.value, 'options', item)}} placeholder="请输入选项" />
            </Col>
            <Col className="gutter-row" span={8}>
              <TextArea rows="1" value={item.default_value} onChange={e => {this.change(e.target.value, 'default_value', item)}} placeholder="请输入默认值" />
            </Col>
          </Row>
        </FormItem>
      );
    });
  }

  render() {
    const { template: {info}, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const scaffoldData = this.props.scaffold.data;
    info.extra_field.forEach(item => {
      item.key = item.key || uuid();
    });

    return (
      <PageHeaderLayout title="页面模版编辑" content="用来编辑或创建页面模版">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="脚手架：">
              {getFieldDecorator('scaffold_id', {
                initialValue: info.scaffold_id,
                rules: [{
                  required: true, message: '脚手架',
                }],
              })(
                <Select>
                  {
                    scaffoldData.list.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>{item.label}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="类别：">
              {getFieldDecorator('cate_id', {
                initialValue: info.cate_id,
                rules: [{
                  required: true, message: '类别',
                }],
              })(
                <Select>
                  <Option value="1">表单</Option>
                  <Option value="2">列表</Option>
                  <Option value="3">图表</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="中文名称：">
              {getFieldDecorator('label', {
                initialValue: info.label,
                rules: [{
                  required: true, message: '请输入中文名称',
                }],
              })(
                <Input onBlur={(e) => {setToEn.bind(this, e.target.value, 'name')()}} placeholder="请输入中文名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="英文名称：">
              {getFieldDecorator('name', {
                initialValue: info.name,
                rules: [{
                  required: true, message: '请输入英文名称',
                }],
              })(
                <Input placeholder="请输入英文名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="简介：">
              {getFieldDecorator('desc', {
                initialValue: info.desc,
              })(
                <TextArea placeholder="请输入简介" />
              )}
            </FormItem>
            <FormItem {...formItemLayoutFull} label="模板：">
              {getFieldDecorator('template', {
                initialValue: info.template,
                rules: [{
                  required: true, message: '请输入模板',
                }],
              })(
                <CodeArea placeholder="模板名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayoutFull}>
              {getFieldDecorator('extra_field', {
                initialValue: info.extra_field,
              })(
                <ExtraField placeholder="扩展字段" />
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
