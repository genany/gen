import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row, Col,
  TreeSelect,
  Table, Divider, Switch,
  message,
  Popconfirm,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import FormTemplate from './FormTemplate.js';
import TableTemplate from './TableTemplate.js';
import PageComponent from './PageComponent.js';
import styles from './add.less';
import {uuid, arrToTree} from '../../utils/utils';

const TreeNode = TreeSelect.TreeNode;
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

@connect(({app, page, template, component, valid, inter, loading }) => ({
  app,
  page,
  template,
  component,
  valid,
  inter,
  submitting: loading.effects['page/add'],
}))
@Form.create()
export default class Add extends PureComponent {
  state = {
    // info: this.props.page.info,
  }
  componentWillReceiveProps(nextProps) {
    if ('match' in nextProps) {
      const id = nextProps.match.params.id;
      if(this.props.match.params.id != id){
        this.props.dispatch({
          type: 'page/info',
          payload: {
            id: id,
          },
        });

      }
    }
  }
  componentDidMount(){
    let id = this.props.match.params.id;
    let app_id = +this.props.match.params.app_id || '';
    this.props.form.setFieldsValue({
      app_id: app_id
    });
    this.props.dispatch({
      type: 'page/info',
      payload: {
        id: id,
      },
    });
    this.props.dispatch({
      type: 'app/list',
      payload: {},
    });
    this.props.dispatch({
      type: 'template/list',
      payload: {},
    });
    this.props.dispatch({
      type: 'component/list',
      payload: {},
    });
    this.props.dispatch({
      type: 'valid/list',
      payload: {},
    });
    this.props.dispatch({
      type: 'inter/list',
      payload: {},
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.page.info.id;
        let payload = values;
        if(id){
          payload = {
            ...payload,
            id,
          };
        }

        if(payload.path.indexOf('/') == -1){
          payload.path = '/' + payload.path + '/' + payload.path;
        }else if(payload.path.lastIndexOf('/') == 0){
          payload.path = payload.path + '/' + payload.path;
        }else if(payload.path.indexOf('/') != 0){
          payload.path = '/' + payload.path;
        }

        this.props.dispatch({
          type: 'page/add',
          payload: payload,
          callback: () => {
            message.success('保存成功');

            this.props.dispatch(routerRedux.push('/page/list'));
          }
        });
      }
    });
  }
  preview = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.page.info.id;
        let payload = values;
        if(id){
          payload = {
            ...payload,
            id,
          };
        }

        if(payload.path.indexOf('/') == -1){
          payload.path = '/' + payload.path + '/' + payload.path;
        }else if(payload.path.lastIndexOf('/') == 0){
          payload.path = payload.path + '/' + payload.path;
        }else if(payload.path.indexOf('/') != 0){
          payload.path = '/' + payload.path;
        }

        this.props.dispatch({
          type: 'preview/page',
          payload: payload,
          callback: () => {
            message.success('保存成功');

            // window.location.href = '/#/preview/preview';
            window.open('http://scaffold.sdemo.cn/#/preview/preview');
          }
        });
      }
    });
  }
  cancel = ()=>{
    this.props.dispatch(routerRedux.push('/page/list'));
  }
  addPageComponent = () => {
    let componentId = this.props.form.getFieldValue('component_id');
    let component = this.props.component.data.list.find(item => item.id == componentId);
    // console.log(template, 'obj')
    // let info = this.state.info;
    let addPageComponent = {
      page_id: '',
      component_id: component.id,
      inter_id: '',
      content: {
        ...component,
      }
    };

    this.props.dispatch({
      type: 'page/addPageComponent',
      payload: addPageComponent,
    });
  }
  updatePageComponent = (action) => {
    let info = this.props.page.info;

    info.page_component.forEach((item, index) => {
      if(item.key == action.key){
        info.page_component[index] = action;
      }
    });

    this.props.dispatch({
      type: 'page/updatePageComponent',
      payload: action.payload,
    });
  }

  addPageTemplate = () => {
    let templateId = this.props.form.getFieldValue('template_id');

    if(!templateId){
      message.warning('请选择页面模版');
      return;
    }

    let template = this.props.template.data.list.find(item => item.id === templateId);
    // console.log(template, 'obj')
    // let info = this.state.info;
    let addPageTemplate = {
      page_id: '',
      template_id: template.id,
      inter_id: '',
      content: {
        fields: [],
        ...template,
      }
    };

    this.props.dispatch({
      type: 'page/addPageTemplate',
      payload: addPageTemplate,
    });
  }
  updatePageTemplate = (action) => {
    let info = this.props.page.info;

    info.page_template.forEach((item, index) => {
      if(item.key == action.key){
        info.page_template[index] = action;
      }
    });
    //
    //

    this.props.dispatch({
      type: 'page/updatePageTemplate',
      payload: action.payload,
    });
  }
  renderTemplate = (item) => {
    const { page: {info}, component, valid, inter, submitting } = this.props;
    let templateId = this.props.form.getFieldValue('template_id');
    let template = this.props.template.data.list.find(item => item.id === templateId);
    let name = template && template.name || 'form';
    if(name == 'form'){
      return (
        <FormTemplate
          key={item.id || item.template_id}
          component={component}
          valid={valid}
          inter={inter}
          template={item}
          dispatch={(args)=> {this.updatePageTemplate(args)}}
        ></FormTemplate>
      );
    }else if(name == 'table'){
      return (
        <TableTemplate
          key={item.id || item.template_id}
          component={component}
          valid={valid}
          inter={inter}
          template={item}
          dispatch={(args)=> {this.updatePageTemplate(args)}}
        ></TableTemplate>
      );
    }else if(name == 'chart'){
      return (
        <TableTemplate
          key={item.id || item.template_id}
          component={component}
          valid={valid}
          inter={inter}
          template={item}
          dispatch={(args)=> {this.updatePageTemplate(args)}}
        ></TableTemplate>
      );
    }
  }
  render() {
    const { page: {info}, component, valid, inter, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const templateData = this.props.template.data;
    const componentData = this.props.component.data;
    const appData = this.props.app.data;

    info.page_template.forEach(item => {
      item.key = uuid();
    });
    info.page_component.forEach(item => {
      item.key = uuid();
    });

    return (
      <PageHeaderLayout title="页面编辑" content="用来编辑或创建页面">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="所属App：">
              {getFieldDecorator('app_id', {
                initialValue: info.app_id,
                rules: [{
                  required: true, message: '请选择所属App',
                }],
              })(
                <Select placeholder="请选择所属App">
                  <Option value="">请选择</Option>
                  {appData.list.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>{item.label}</Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="名称：">
              {getFieldDecorator('label', {
                initialValue: info.label,
                rules: [{
                  required: true, message: '请输入名称',
                }],
              })(
                <Input placeholder="请输入名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Path：">
              {getFieldDecorator('path', {
                initialValue: info.path,
                rules: [{
                  required: true, message: '请输入Path',
                }],
              })(
                <Input placeholder="请输入Path" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择页面模版：">
              <Row gutter={8}>
                <Col span={18}>
                  {getFieldDecorator('template_id', {
                    initialValue: info.page_template.length ? info.page_template[0].template_id : info.template_id,
                  })(
                    <Select placeholder="请选择要添加的页面模版">
                      {templateData.list.map(item => {
                        return (
                          <Option value={item.id} key={item.id}>{item.label}</Option>
                        )
                      })}
                    </Select>
                  )}
                </Col>
                <Col span={6}>
                  {info.page_template.length ?
                    (
                      <Popconfirm title="确认更换模版吗，更换后数据不能恢复" onConfirm={() => this.addPageTemplate()}>
                        <Button style={{width: '100%'}}>更换模版</Button>
                      </Popconfirm>
                    )
                    :(
                      <Button onClick={this.addPageTemplate} style={{width: '100%'}}>添加模版</Button>
                    )
                  }
                </Col>
              </Row>
            </FormItem>

            <FormItem {...formItemLayout} label="页面模版：" style={{display: 'none'}}>
              {getFieldDecorator('page_template', {
                initialValue: info.page_template,
              })(
                <Input placeholder="页面模版" />
              )}
            </FormItem>
            {info.page_template.map(item => {
              return this.renderTemplate(item)
            })}
            <FormItem {...formItemLayout} label="添加组件：">
              <Row gutter={8}>
                <Col span={18}>
                  {getFieldDecorator('component_id', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      style={{ width: 300 }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={componentData.treeData}
                      placeholder="请选择组件"
                      treeDefaultExpandAll
                    />

                  )}

                </Col>
                <Col span={6}>
                  <Button onClick={this.addPageComponent} style={{width: '100%'}}>添加</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="组件：" style={{display: 'none'}}>
              {getFieldDecorator('page_component', {
                initialValue: info.page_component,
              })(
                <Input placeholder="组件" />
              )}
            </FormItem>
            {info.page_component.map(item => {
              return (
                <PageComponent
                  key={item.id}
                  valid={valid}
                  inter={inter}
                  component={item}
                  dispatch={(args)=> {this.updatePageComponent(args)}}
                ></PageComponent>
              )
            })}

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={this.preview}  style={{marginLeft: 16}}>
                预览
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
