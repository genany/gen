import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row, Col,
  TreeSelect,
  Table, Divider, Switch,
  message,
  notification,
  Popconfirm,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import _ from 'lodash';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import Attr from '../../components/Attr';
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

const formItemPageLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    md: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 18 },
  },
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
    md: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 14 },
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
    component: null,
    type: '',
    id: '',
    filterExtraField: [],
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
    let component = this.props.component.data.list.find(item => item.name == componentId);
    component = _.cloneDeep(component);
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
  changePageTemplateTips = () => {
    let templateId = this.props.form.getFieldValue('template_id');
    if(!templateId){
      return;
    }
    notification.warning({
     message: '更换模板数据不能恢复',
     // description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
   });
  }
  addPageTemplate = (templateId) => {
    templateId = templateId || this.props.form.getFieldValue('template_id');

    if(!templateId){
      message.warning('请选择页面模版');
      return;
    }

    let template = this.props.template.data.list.find(item => item.id === templateId);
    template = _.cloneDeep(template);
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

    // info.page_template.forEach((item, index) => {
    //   if(item.key == action.key){
    //     info.page_template[index] = action;
    //   }
    // });
    //
    //

    this.props.dispatch({
      type: 'page/updatePageTemplate',
      payload: action.payload,
    });
  }
  onChangeComponent = (component, type, id) => {
    // let templateId = this.props.form.getFieldValue('template_id');
    // let template = this.props.template.data.list.find(item => item.id === templateId);
    // let componentField = template.content.extra_field.find(item => item.id === pureField.id);
    //
    const orignComponent = this.props.component.data.list.find(item => item.id == component.id);

    const filterExtraField = orignComponent.extra_field.filter(item => {
      return !component.extra_field.find(item2 => {item.name == item2.name});
    });

    this.setState({component, type, id, filterExtraField});
    // this.getNotUseComponentExtraField();
  }
  changeTemplateExtraField = (extraField) => {
    let templateId = this.props.form.getFieldValue('template_id');
    let template = this.props.page.info.page_template.find(item => item.template_id === templateId);

    template.content.extra_field = extraField;

    this.props.dispatch({
      type: 'page/updatePageTemplate',
      payload: template,
    });
  }
  changeComponentExtraField = (extraField) => {
    let component = this.state.component;
    let type = this.state.type;
    let templateId = this.state.id;
    // let templateId = this.props.form.getFieldValue('template_id');
    let template = this.props.page.info.page_template.find(item => item.template_id === templateId);
    if(type == 'extra_field'){
      template.content.extra_field.forEach((item, index) => {
        if(item.uuid == component.uuid){
          template.content.extra_field[index] = component;
        }
      });
    }

    this.props.dispatch({
      type: 'page/updatePageTemplate',
      payload: template,
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
          key={templateId}
          component={component}
          valid={valid}
          inter={inter}
          template={item}
          dispatch={(args)=> {this.updatePageTemplate(args)}}
          onChangeComponent={value => this.onChangeComponent(value, 'extra_field', templateId)}
        ></FormTemplate>
      );
    }else if(name == 'table'){
      return (
        <TableTemplate
          key={templateId}
          component={component}
          valid={valid}
          inter={inter}
          template={item}
          dispatch={(args)=> {this.updatePageTemplate(args)}}
          onChangeComponent={value => this.onChangeComponent(value, 'extra_field', templateId)}
        ></TableTemplate>
      );
    }else if(name == 'chart'){
      return (
        <TableTemplate
          key={templateId}
          component={component}
          valid={valid}
          inter={inter}
          template={item}
          dispatch={(args)=> {this.updatePageTemplate(args)}}
          onChangeComponent={value => this.onChangeComponent(value, 'extra_field', templateId)}
        ></TableTemplate>
      );
    }
  }
  renderTemplateExtraField = () => {
    const { page: {info}, component, valid, inter, submitting } = this.props;
    let templateId = this.props.form.getFieldValue('template_id');
    let template = info.page_template.find(item => item.template_id == templateId);
    let extra_field = template && template.content.extra_field || [];

    return (
      <Card title="模板自定义字段">
        {template && extra_field.length ?
          (
            <Attr value={extra_field} onChange={value => this.changeTemplateExtraField(value)} placeholder="配置扩展字段" />
          )
          : ''
        }
      </Card>
    );
  }
  addComponentExtraFieldConfig = (extraFieldId) => {
    const component = this.state.component;
    const filterExtraField = this.state.filterExtraField;
    // const orignComponent = this.props.component.data.list.find(item => item.id == component.id);

    const extraField = filterExtraField.find(item => item.id == extraFieldId);
    const newFilterExtraField = filterExtraField.filter(item => item.id != extraFieldId);


    component.extra_field.push(extraField);
    this.setState({
      component: {
        ...component
      },
      filterExtraField: newFilterExtraField,
    });

  }

  getNotUseComponentExtraField = () => {
    const component = this.state.component;
    const orignComponent = this.props.component.data.list.find(item => item.id == component.id);

    const filterExtraField = orignComponent.extra_field.filter(item => {
      return !component.extra_field.find(item2 => {item.name == item2.name});
    });

    this.setState({filterExtraField});
    // return filterExtraField;
  }

  renderComponentExtraField = () => {
    const component = this.state.component;
    const filterExtraField = this.state.filterExtraField;

    if(!component){
      return (
        <Card title={'组件自定义字段'} style={{marginTop: 6}}>

        </Card>
      );
    }
    const componentName = component.name;

    // const component = this.state.component;
    // const orignComponent = this.props.component.data.list.find(item => item.id == component.id);

    // const filterExtraField = orignComponent.extra_field.filter(item => {
    //   return !component.extra_field.find(item2 => {item.name == item2.name});
    // });

    return (
      <Card title={'组件' + componentName + '自定义字段'} style={{marginTop: 6}}>
        <Select placeholder="请选择扩展字段" onChange={value => this.addComponentExtraFieldConfig(value)} style={{width: '100%'}}>
          <Option value="">请选择扩展字段</Option>
          {filterExtraField.map(item => {
            return (
              <Option value={item.id} key={item.id}>{item.label || item.name}</Option>
            )
          })}
        </Select>
        {component && component.extra_field.length ?
          (
            <Attr value={component.extra_field} onChange={(value) => this.changeComponentExtraField(value)} placeholder="配置扩展字段" />
          )
          : ''
        }
      </Card>
    );
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
      <Row gutter={6}>
        <Col className="gutter-row" span={18}>
          <Card bordered={false}>
            <Form
              onSubmit={this.handleSubmit}
              hideRequiredMark
              style={{ marginTop: 8 }}
            >
              <Row gutter={24}>
                <Col span={8}>
                  <FormItem {...formItemPageLayout} label="所属App：">
                    {getFieldDecorator('app_id', {
                      initialValue: info.app_id,
                      rules: [{
                        required: true, message: '请选择所属App',
                      }],
                    })(
                      <Select placeholder="请选择所属App" >
                        <Option value="">请选择</Option>
                        {appData.list.map(item => {
                          return (
                            <Option value={item.id} key={item.id}>{item.label}</Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemPageLayout} label="名称：">
                    {getFieldDecorator('label', {
                      initialValue: info.label,
                      rules: [{
                        required: true, message: '请输入名称',
                      }],
                    })(
                      <Input placeholder="请输入名称" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemPageLayout} label="Path：">
                    {getFieldDecorator('path', {
                      initialValue: info.path,
                      rules: [{
                        required: true, message: '请输入Path',
                      }],
                    })(
                      <Input placeholder="请输入Path" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem {...formItemLayout} label="选择页面模版：">
                <Row gutter={8}>
                  <Col span={18}>
                    {getFieldDecorator('template_id', {
                      initialValue: info.page_template.length ? info.page_template[0].template_id : info.template_id,
                    })(
                      <Select placeholder="请选择要添加的页面模版" onChange={value => this.addPageTemplate(value)} onFocus={this.changePageTemplateTips} >
                        {templateData.list.map(item => {
                          return (
                            <Option value={item.id} key={item.id}>{item.label}</Option>
                          )
                        })}
                      </Select>
                    )}
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
                <Row>
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
        </Col>
        <Col className="gutter-row" span={6}>
          {this.renderTemplateExtraField()}
          {this.renderComponentExtraField()}
        </Col>
      </Row>
    )
  }

}
