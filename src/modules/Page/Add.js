import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row,
  Col,
  message,
  notification,
  Popconfirm,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Card
} from 'antd';
import _ from 'lodash';
import Debounce from 'lodash-decorators/debounce';
import Template from './Template';
import CommonTemplate from './CommonTemplate';

import ComponentExtraField from './ComponentExtraField.js';
import ComponentTree from './ComponentTree.js';
import CodeArea from '../../components/CodeArea';
import { uuid } from '../../utils/utils';
import native from '../../utils/native.js';
import { formItemPageLayout, formItemLayout, submitFormLayout } from '../../utils/formLayout.js';

const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;

@connect(({ app, page, scaffold, template, component, valid, inter, loading }) => ({
  app,
  page,
  scaffold,
  template,
  component,
  valid,
  inter,
  submitting: loading.effects['page/add']
}))
@Form.create()
export default class Add extends PureComponent {
  state = {
    currComponent: null,
    latestComponent: null,
    type: '',
    id: '',
    extra_field_value: '',
    req: '',
    res: '',
    interInfo: ''
  };
  componentWillReceiveProps(nextProps) {}
  componentDidMount() {
    let id = this.props.match.params.id;
    let app_id = +this.props.match.params.app_id || '';
    let inter_id = +this.props.match.params.inter_id || '';
    this.props.form.setFieldsValue({
      app_id: app_id
    });
    this.props.dispatch({
      type: 'page/info',
      payload: {
        id: id
      }
    });
    this.props.dispatch({
      type: 'app/list',
      payload: {}
    });
    this.props.dispatch({
      type: 'scaffold/list',
      payload: {}
    });
    this.props.dispatch({
      type: 'template/list',
      payload: {}
    });
    this.props.dispatch({
      type: 'component/list',
      payload: {}
    });
    this.props.dispatch({
      type: 'valid/list',
      payload: {}
    });
    this.props.dispatch({
      type: 'inter/list',
      payload: {},
      callback: res => {
        if (res.code === 200) {
          if (inter_id) {
            this.props.form.setFieldsValue({ inter_id });
            this.selectInter(inter_id);
          }
        }
      }
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('TCL: Add -> componentWillReceiveProps -> values', values);
      if (!err) {
        let id = this.props.page.info.id;
        let payload = values;
        if (id) {
          payload = {
            ...payload,
            id
          };
        }

        if (payload.path.indexOf('/') === -1) {
          payload.path = '/' + payload.path + '/' + payload.path;
        } else if (payload.path.lastIndexOf('/') === 0) {
          payload.path = payload.path + '/' + payload.path;
        } else if (payload.path.indexOf('/') !== 0) {
          payload.path = '/' + payload.path;
        }

        // this.nativeHandlePage(payload, 'save');
        // return;

        this.props.dispatch({
          type: 'page/add',
          payload: payload,
          callback: resData => {
            if (resData.code === 200) {
              message.success('保存成功');
              this.nativeHandlePage(payload, 'save');
              this.props.dispatch(routerRedux.push('/page/list'));
            }
          }
        });
      }
    });
  };
  preview = e => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.page.info.id;
        let payload = values;
        if (id) {
          payload = {
            ...payload,
            id
          };
        }

        payload.path = '/preview/preview';

        if (!payload.inter_id) {
          message.warning('请选择接口');
          return;
        }

        if (native.isEnablePreview(payload.app_id)) {
          this.nativeHandlePage(payload, 'preview');
          return;
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
  };
  nativeHandlePage = (payload, type) => {
    let newPayload = { ...payload };
    if (native.isEnablePreview(newPayload.app_id)) {
      const interId = newPayload.inter_id;
      const appData = this.props.app.data.list.find(item => item.id === newPayload.app_id);
      const scaffoldData = appData.scaffold;
      const interData = this.props.inter.data.list.find(item => item.id === interId);
      if (type === 'preview') {
        newPayload.path = '/preview/preview';
        native.preview(newPayload, appData, scaffoldData, interData);
      } else if (type === 'save') {
        native.savePage(newPayload, appData, scaffoldData, interData);
      }
    }
  };
  cancel = () => {
    this.props.dispatch(routerRedux.push('/page/list'));
  };
  @Debounce(400)
  realTimePreview() {
    this.preview();
  }

  setCurrComponent = component => {
    this.setState({ latestComponent: null, currComponent: component });
  };

  getPreviewIframeUrl = () => {
    return native.getPreviewPageUrl(this.props.match.params.app_id, '/preview/preview');
  };

  getComponentTreeData = () => {};

  changeComponent = component => {
    this.setState({ latestComponent: { ...component } }, () => {
      this.realTimePreview();
    });
  };

  selectInter = value => {
    const { setFieldsValue } = this.props.form;
    const interData = { ...this.props.inter.data };
    let interInfo = interData.list.find(item => {
      return item.id === value;
    });
    this.setState({ interInfo });
    setFieldsValue({ interInfo });
    if (!this.props.page.info.path) {
      setFieldsValue({ path: interInfo.url });
    }
    if (!this.props.page.info.label) {
      setFieldsValue({ label: interInfo.label });
    }
    if (!this.props.page.info.app_id) {
      setFieldsValue({ app_id: interInfo.inter_app_id });
    }
  };

  render() {
    const {
      page: { info },
      submitting
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    // const componentData = this.props.component.data;
    const appData = this.props.app.data;
    const interData = this.props.inter.data;

    return (
      <Row gutter={6}>
        <Col className="gutter-row" span={18}>
          <Tabs animated={false} defaultActiveKey="1" style={{ width: '100%', height: '100%' }}>
            <TabPane tab="编辑" key="1">
              <Card bordered={false}>
                <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                  <Row gutter={24}>
                    <Col span={24}>
                      <FormItem {...formItemLayout} label="使用接口：">
                        {getFieldDecorator('inter_id', {
                          initialValue: info.inter_id,
                          rules: [
                            {
                              required: true,
                              message: '请选择接口'
                            }
                          ]
                        })(
                          <Select
                            onChange={value => {
                              this.selectInter(value);
                            }}
                            placeholder="选择接口自动生成"
                          >
                            {interData.list.map(item => {
                              return (
                                <Option value={item.id} key={item.id}>
                                  {item.label}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={8}>
                      <FormItem {...formItemPageLayout} label="所属App：">
                        {getFieldDecorator('app_id', {
                          initialValue: info.app_id,
                          rules: [
                            {
                              required: true,
                              message: '请选择所属App'
                            }
                          ]
                        })(
                          <Select placeholder="请选择所属App">
                            <Option value="">请选择</Option>
                            {appData.list.map(item => {
                              return (
                                <Option value={item.id} key={item.id}>
                                  {item.label}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemPageLayout} label="名称：">
                        {getFieldDecorator('label', {
                          initialValue: info.label,
                          rules: [
                            {
                              required: true,
                              message: '请输入名称'
                            }
                          ]
                        })(<Input placeholder="请输入名称" />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemPageLayout} label="Path：">
                        {getFieldDecorator('path', {
                          initialValue: info.path,
                          rules: [
                            { required: true, message: '请输入Path' },
                            {
                              pattern: /^(\/)?[a-zA-Z]+([a-zA-Z0-9_\/]*)$/,
                              message: '请输入以字母开头,只包含字母、数字、下划线字符'
                            }
                          ]
                        })(<Input placeholder="请输入Path" />)}
                      </FormItem>
                    </Col>
                  </Row>

                  {getFieldDecorator('interInfo', {
                    initialValue: info.interInfo
                  })(
                    <CommonTemplate
                      currComponent={this.state.latestComponent}
                      onChange={() => this.realTimePreview()}
                      onSelectedComponent={value => this.setCurrComponent(value)}
                    />
                  )}

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
            </TabPane>
            <TabPane tab="预览" key="2" forceRender style={{ width: '100%', height: '800px' }}>
              <iframe
                src={this.getPreviewIframeUrl()}
                sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms"
                allowtransparency="true"
                frameBorder="0"
                className="preview"
                style={{ width: '100%', height: '100%' }}
              />
            </TabPane>
          </Tabs>
        </Col>
        <Col className="gutter-row" span={6} style={{ paddingTop: 53 }}>
          <ComponentExtraField
            currComponent={this.state.currComponent}
            onChange={component => this.changeComponent(component)}
          />
          {/* <Card title="组件树" style={{ marginTop: 6 }}>
            <ComponentTree
              data={this.getComponentTreeData()}
              currComponent={this.state.component}
              onSelectNode={component => this.setCurrComponent(component)}
            />
          </Card> */}
        </Col>
      </Row>
    );
  }
}
