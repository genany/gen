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
  Tabs,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import _ from 'lodash';
import Debounce from 'lodash-decorators/debounce';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import Attr from '../../components/Attr';
import FormTemplate from './FormTemplate.js';
import TableTemplate from './TableTemplate.js';
import PageComponent from './PageComponent.js';
import ComponentExtraField from './ComponentExtraField.js';
import ComponentTree from './ComponentTree.js';
import styles from './add.less';
import {uuid, arrToTree} from '../../utils/utils';
import native from '../../utils/native.js';

const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

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

@connect(({app, page, scaffold, template, component, valid, inter, loading }) => ({
  app,
  page,
  scaffold,
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
    // filterExtraField: [],
    extra_field_value: '',
    // info: this.props.page.info,
  }
  componentWillReceiveProps(nextProps) {

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
      type: 'scaffold/list',
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

        if(!payload.page_template[0].content.children[0]){
          message.warning('请选择接口');
          return ;
        }

        // this.nativeHandlePage(payload, 'save');
        // return;

        this.props.dispatch({
          type: 'page/add',
          payload: payload,
          callback: () => {
            message.success('保存成功');
            this.nativeHandlePage(payload, 'save');
            this.props.dispatch(routerRedux.push('/page/list'));
          }
        });
      }
    });
  }
  preview = (e) => {
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

        payload.path = '/preview/preview';

        if(!payload.page_template[0].content.children[0].inter_id){
          message.warning('请选择接口');
          return ;
        }



        if(native.isEnablePreview(payload.app_id)){
          this.nativeHandlePage(payload, 'preview');
          return ;
        }

        this.props.dispatch({
          type: 'preview/preview',
          payload: payload,
          callback: () => {
            // message.success('保存成功');

            // window.location.href = '/#/preview/preview';
            // window.open('http://scaffold.sdemo.cn/#/preview/preview');
          }
        });
      }
    });
  }
  nativeHandlePage = (payload, type) => {
    let newPayload = {...payload};
    if(native.isEnablePreview(newPayload.app_id)){
      const interId = newPayload.page_template[0].content.children[0].inter_id;
      const appData = this.props.app.data.list.find(item => item.id == newPayload.app_id);
      // const scaffoldData = this.props.scaffold.data.list.find(item => item.id == appData.scaffold_id);
      const scaffoldData = appData.scaffold;
      const interData = this.props.inter.data.list.find(item => item.id == interId);
      if(type == 'preview'){
        newPayload.path = '/preview/preview'
        native.preview(newPayload, appData, scaffoldData, interData);
      }else if(type ='save'){
        native.savePage(newPayload, appData, scaffoldData, interData);
      }
    }
  }
  cancel = ()=>{
    this.props.dispatch(routerRedux.push('/page/list'));
  }
  @Debounce(800)
  realTimePreview(){
    this.preview();
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
    this.realTimePreview();
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
    this.realTimePreview();
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
    this.realTimePreview();
  }
  addPageTemplate = (templateId) => {
    templateId = templateId || this.props.form.getFieldValue('template_id');

    if(!templateId){
      message.warning('请选择页面模版');
      return;
    }

    let template = this.props.template.data.list.find(item => item.id === templateId);
    let formComponent = this.props.component.data.list.find(item => item.name === 'form');
    template = _.cloneDeep(template);
    // console.log(template, 'obj')
    // let info = this.state.info;
    let addPageTemplate = {
      key: uuid(),
      page_id: '',
      template_id: template.id,
      inter_id: '',
      content: {
        children: [
          {
            ...formComponent,
            key: uuid(),
            extra_field: [],
            origin_extra_field: [...formComponent.extra_field],
            children: [],
          }
        ],
        ...template,
        extra_field: [],
        origin_extra_field: [...template.extra_field],
        key: uuid(),
      }
    };

    this.props.dispatch({
      type: 'page/addPageTemplate',
      payload: addPageTemplate,
    });
    this.realTimePreview();
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
    this.realTimePreview();
  }
  onChangeComponent = (component, type, id) => {
    // let templateId = this.props.form.getFieldValue('template_id');
    // let template = this.props.template.data.list.find(item => item.id === templateId);
    // let componentField = template.content.extra_field.find(item => item.id === pureField.id);
    //
    //之前版本可能没有extra_field
    component.extra_field = component.extra_field || [];

    const orignComponent = this.props.component.data.list.find(item => item.id == component.id);

    const filterExtraField = orignComponent.extra_field.filter(item => {
      return !component.extra_field.find(item2 => item.name == item2.name);
    });

    this.setState({component, type, id, filterExtraField});
    this.realTimePreview();
    // this.getNotUseComponentExtraField();
  }
  setCurrComponent = (component) => {
    this.setState({component});
  }

  getTargetComponent = (data, key) => {


    let target = null;

    transList(data, key);
    return target;
    function transList(data){
      if(data.key == key){
        target = data;
      }

      if(data.children){
        data.children.some(item => {
          transList(item, key);
        })
      }
    }

  }


  getPreviewIframeUrl = () => {
    return native.getPreviewPageUrl(this.props.match.params.app_id, '/preview/preview');
  }

  getComponentTreeData = () => {
    let templates = this.props.page.info.page_template;
    if(templates.length){
      return [templates[0].content];  //页面模版和组件类似
    }else{
      return [];
    }
  }

  changeComponent = (component) => {
    this.setState({component}, () => {
      let templateId = this.props.form.getFieldValue('template_id');
      let template = this.props.page.info.page_template.find(item => item.template_id === templateId);
      let targetComponent = this.getTargetComponent(template.content, this.state.component.key);

      targetComponent.extra_field = this.state.component.extra_field;

      this.props.dispatch({
        type: 'page/updatePageTemplate',
        payload: template,
      });
      this.realTimePreview();
    });
  }

  renderTemplate = (pageItem) => {
    const { page: {info}, component, valid, inter, submitting } = this.props;
    let item = pageItem.content.children[0]; //组件  form或table组件
    // let templateId = this.props.form.getFieldValue('template_id');
    let templateId = pageItem.template_id;
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
          onChangeComponent={(value) => this.setCurrComponent(value)}
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
          onChangeComponent={(value) => this.setCurrComponent(value)}
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
          onChangeComponent={(value) => this.setCurrComponent(value)}
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
      item.key = item.key || uuid();
    });
    info.page_component.forEach(item => {
      item.key = item.key || uuid();
    });

    return (
      <Row gutter={6}>
        <Col className="gutter-row" span={18}>
          <Tabs animated={false} defaultActiveKey="1"  style={{width: '100%', height: '100%', marginTop: -25}}>
            <TabPane tab="编辑" key="1">
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
                            pattern: /^(\/)?[a-zA-Z]+([a-zA-Z0-9_\/]*)$/, message: '请输入以字母开头,只包含字母、数字、下划线字符',
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
            </TabPane>
            <TabPane tab="预览" key="2" forceRender={true} style={{width: '100%', height: '800px'}}>
              <iframe src={this.getPreviewIframeUrl()} sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" allowtransparency="true" frameBorder="0" className="preview" style={{width: '100%', height: '100%'}}></iframe>
            </TabPane>
          </Tabs>
        </Col>
        <Col className="gutter-row" span={6} style={{paddingTop: 28}}>
          <ComponentExtraField
            component={this.state.component}
            onChange={(component) => this.changeComponent(component)}
          ></ComponentExtraField>
          <Card title="组件树" style={{marginTop: 6}}>
            <ComponentTree data={this.getComponentTreeData()} currComponent={this.state.component} onSelectNode={(component) => this.setCurrComponent(component)}></ComponentTree>
          </Card>
        </Col>
      </Row>

    )
  }

}
