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
  Icon,
  Radio,
  Row,
  Col
} from 'antd';
import urlMaps from '../../common/urlMaps';

import ExtraTemplate from '../../components/ExtraTemplate';
import { setToEn } from '../../utils/utils.js';
import { formItemLayout, submitFormLayout, formItemLayoutFull } from '../../utils/formLayout.js';

const Dragger = Upload.Dragger;
const FormItem = Form.Item;

const { TextArea } = Input;

@connect(({ scaffold, loading }) => ({
  scaffold: scaffold,
  submitting: loading.effects['scaffold/add'],
  pullCoding: loading.effects['scaffold/pullCode']
}))
@Form.create()
export default class Add extends PureComponent {
  state = {
    scaffoldFiles: [],
    files: [],
    scaffoldDir: '',
    scaffoldType: ''
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
          callback: resData => {
            if (resData.code === 200) {
              message.success('保存成功');
              this.props.dispatch(routerRedux.push('/scaffold/list'));
            }
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
  getCsrf = () => {
    var keyValue = document.cookie.match('(^|;) ?csrfToken=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
  };
  getUploadProps = () => {
    return {
      name: 'file',
      multiple: false,
      accept: '.zip',
      action: urlMaps.upload + '?_csrf=' + this.getCsrf(),
      onChange: info => {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          const resData = info.file.response;
          if (resData.code === 200) {
            message.success(`${info.file.name} 上传成功`);
            this.props.form.setFieldsValue({
              file: resData.data.path
            });
            this.setState({ scaffoldDir: resData.data.path });
          } else if (resData.code === 10013) {
            message.error(resData.msg);
          } else {
            message.error(`${info.file.name} 上传失败`);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      }
    };
  };
  pullCode = () => {
    const path = this.props.form.getFieldValue('path');
    if (!path) {
      message.warning('请输入git地址');
      return;
    }
    this.props.dispatch({
      type: 'scaffold/pullCode',
      payload: {
        path: path
      },
      callback: resData => {
        if (resData.code === 200) {
          message.success(`拉取成功`);
          this.setState({ scaffoldDir: resData.data.path });
        }
      }
    });
  };
  render() {
    const {
      scaffold: { info },
      submitting
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const scaffoldType = this.state.scaffoldType || info.type;

    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
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
          <FormItem {...formItemLayout} label="脚手架类型：">
            {getFieldDecorator('type', {
              initialValue: info.type
            })(
              <Radio.Group
                onChange={e => {
                  this.setState({ scaffoldType: e.target.value });
                }}
                value={this.state.scaffoldType}
              >
                <Radio value={'zip'}>脚手架压缩包</Radio>
                <Radio value={'git'}>git仓库</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {scaffoldType === 'zip' && (
            <FormItem {...formItemLayout} label="脚手架压缩包">
              {getFieldDecorator('file', {
                initialValue: info.file
              })(
                <Dragger {...this.getUploadProps()}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或拖拽到此区域上传</p>
                  {/* <p className="ant-upload-hint">支持单个或批量上传</p> */}
                </Dragger>
              )}
            </FormItem>
          )}

          {scaffoldType === 'git' && (
            <FormItem {...formItemLayout} label="脚手架git地址">
              <Row gutter={8}>
                <Col span={18}>
                  {getFieldDecorator('path', {
                    initialValue: info.path
                  })(<Input placeholder="请输入git地址" />)}
                </Col>
                <Col span={6}>
                  <Button
                    onClick={this.pullCode}
                    ghost
                    loading={this.props.pullCoding}
                    type="primary"
                  >
                    拉取代码
                  </Button>
                </Col>
              </Row>
            </FormItem>
          )}

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
                scaffoldDir={this.state.scaffoldDir || info.file}
                placeholder="请输入扩展模版"
                dispatch={this.props.dispatch}
              />
            )}
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
