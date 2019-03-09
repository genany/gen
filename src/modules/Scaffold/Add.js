import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Upload,
  message,
  Popconfirm,
  Form,
  Input,
  Button,
  Card,
  Icon
} from 'antd';

import ExtraTemplate from '../../components/ExtraTemplate';
import { setToEn } from '../../utils/utils.js';
import {
  formItemLayout,
  submitFormLayout,
  formItemLayoutFull
} from '../../utils/formLayout.js';

const Dragger = Upload.Dragger;
const FormItem = Form.Item;

const { TextArea } = Input;

@connect(({ scaffold, loading }) => ({
  scaffold: scaffold,
  submitting: loading.effects['scaffold/add']
}))
@Form.create()
export default class Add extends PureComponent {
  state = {
    scaffoldFiles: [],
    files: []
  };
  componentWillReceiveProps(nextProps) {}
  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'scaffold/info',
      payload: {
        id: id
      }
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.scaffold.info.id;
        let payload = values;
        if (id) {
          payload = {
            ...payload,
            id
          };
        }
        this.props.dispatch({
          type: 'scaffold/add',
          payload: payload,
          callback: () => {
            message.success('保存成功');
            this.props.dispatch(routerRedux.push('/scaffold/list'));
          }
        });
      }
    });
  };
  cancel = () => {
    this.props.dispatch(routerRedux.push('/scaffold/list'));
  };
  edit = () => {
    message.warning('开发中');
  };
  changeFile = node => {};
  render() {
    const {
      scaffold: { info },
      submitting
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    const props = {
      name: 'file',
      multiple: true,
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };

    return (
      <Card bordered={false}>
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          style={{ marginTop: 8 }}
        >
          <FormItem {...formItemLayout} label="中文名称：">
            {getFieldDecorator('label', {
              initialValue: info.label,
              rules: [
                {
                  required: true,
                  message: '中文名称'
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
                  message: '英文名称'
                }
              ]
            })(<Input placeholder="请输入英文名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="简介：">
            {getFieldDecorator('desc', {
              initialValue: info.desc
            })(<TextArea placeholder="请输入简介" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="脚手架压缩包">
            {getFieldDecorator('file', {
              initialValue: info.file
            })(
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖拽到此区域上传</p>
                <p className="ant-upload-hint">支持单个或批量上传</p>
              </Dragger>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="页面目录：">
            {getFieldDecorator('page_dir', {
              initialValue: info.page_dir,
              rules: [
                {
                  required: true,
                  message: '请输入页面目录'
                }
              ]
            })(<Input placeholder="请输入页面目录" />)}
          </FormItem>
          <FormItem {...formItemLayoutFull} label="扩展模版：">
            {getFieldDecorator('extra_template', {
              initialValue: info.extra_template,
              rules: [
                {
                  required: true,
                  message: '请输入扩展模版'
                }
              ]
            })(
              <ExtraTemplate
                extra={info.extra_template}
                scaffoldId={info.id}
                placeholder="请输入扩展模版"
                dispatch={this.props.dispatch}
              />
            )}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="路由文件：">
              {getFieldDecorator('router_file_path', {
                initialValue: info.router_file_path,
                 rules: [{
                   required: true, message: '请输入路由文件',
                 }],
               })(
                <Input placeholder="请输入路由文件" />
              )}
            </FormItem>
            <FormItem {...formItemLayoutFull} label="路由模板：">
              {getFieldDecorator('router_template', {
                initialValue: info.router_template,
                rules: [{
                  required: true, message: '请输入路由模板',
                }],
              })(
                <CodeArea placeholder="路由模板名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="菜单导航文件：">
              {getFieldDecorator('menu_file_path', {
                initialValue: info.menu_file_path,
                 rules: [{
                   required: true, message: '请输入菜单导航文件',
                 }],
               })(
                <Input placeholder="请输入菜单导航文件" />
              )}
            </FormItem>
            <FormItem {...formItemLayoutFull} label="菜单模板：">
              {getFieldDecorator('menu_template', {
                initialValue: info.menu_template,
                rules: [{
                  required: true, message: '请输入菜单模板',
                }],
              })(
                <CodeArea placeholder="菜单模板名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Store目录：">
              {getFieldDecorator('store_dir', {
                initialValue: info.store_dir,
                 rules: [{
                   required: true, message: '请输入Store目录',
                 }],
               })(
                <Input placeholder="请输入Store目录" />
              )}
            </FormItem>
            <FormItem {...formItemLayoutFull} label="Store模板：">
              {getFieldDecorator('store_template', {
                initialValue: info.store_template,
                rules: [{
                  required: true, message: '请输入Store模板',
                }],
              })(
                <CodeArea placeholder="Data模板名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="页面目录：">
              {getFieldDecorator('page_dir', {
                initialValue: info.page_dir,
                 rules: [{
                   required: true, message: '请输入页面目录',
                 }],
               })(
                <Input placeholder="请输入页面目录" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Store目录：">
              {getFieldDecorator('store_dir', {
                initialValue: info.store_dir,
                 rules: [{
                   required: true, message: '请输入Store目录',
                 }],
               })(
                <Input placeholder="请输入Store目录" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Service模版：">
              {getFieldDecorator('service_template', {
                initialValue: info.service_template,
                 rules: [{
                   required: true, message: '输入Service模版',
                 }],
               })(
                <CodeArea placeholder="输入Service模版" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Service目录：">
              {getFieldDecorator('service_dir', {
                initialValue: info.service_dir,
                 rules: [{
                   required: true, message: '输入Service目录',
                 }],
               })(
                <Input placeholder="请输入Service目录" />
              )}
            </FormItem> */}

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              保存
            </Button>
            <Popconfirm
              title="修改不会保存，确认取消吗？"
              onConfirm={this.cancel}
            >
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
