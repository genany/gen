import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, message, Popconfirm, Form, Input, Select, Button, Card } from 'antd';

import CodeArea from '../../components/CodeArea';
import FileTree from '../../components/FileTree';
import ExtraField from '../../components/ExtraField';
import { uuid } from '../../utils/utils.js';
import { setToEn } from '../../utils/utils.js';

import {
  formItemPageLayout,
  formItemLayout,
  submitFormLayout,
  formItemLayoutFull
} from '../../utils/formLayout.js';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ template, scaffold, loading }) => ({
  template,
  scaffold,
  submitting: loading.effects['template/add']
}))
@Form.create()
export default class Add extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      scaffoldFiles: [],
      files: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('template' in nextProps) {
      let info = nextProps.template.info;
      if (info && info.scaffold_id) {
        this.getSubFiles();
      }
    }
  }
  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'template/info',
      payload: {
        id: id
      }
    });
    this.props.dispatch({
      type: 'scaffold/list',
      payload: {}
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.template.info.id;
        let payload = values;
        if (id) {
          payload = {
            ...payload,
            id
          };
        }
        this.props.dispatch({
          type: 'template/add',
          payload: payload,
          callback: resData => {
            if (resData.code === 200) {
              message.success('保存成功');
              this.props.dispatch(routerRedux.push('/template/list'));
            }
          }
        });
      }
    });
  };
  cancel = () => {
    this.props.dispatch(routerRedux.push('/template/list'));
  };

  getSubFiles = node => {
    return new Promise((resolve, reject) => {
      let scaffoldId =
        this.props.form.getFieldValue('scaffold_id') || this.props.template.info.scaffold_id;
      if (!scaffoldId) {
        message.warning('请选择脚手架');
        return;
      }

      this.props.dispatch({
        type: 'scaffold/files',
        payload: {
          id: scaffoldId,
          dir: node && node.fullName
        },
        callback: data => {
          if (!node) {
            this.setState({ files: data });
          }

          resolve(data);
        }
      });
    });
  };
  changeScaffold = scaffoldId => {
    this.props.template.info.scaffold_id = scaffoldId;
    this.getSubFiles();
  };
  addExtraField = () => {
    let extraField = {
      name: '',
      label: '',
      desc: '',
      type: '',
      options: [],
      default_value: ''
    };

    this.props.dispatch({
      type: 'template/addExtraField',
      payload: extraField
    });
  };

  change = (value, name, record) => {
    const extraField = this.props.template.info.extra_field;
    extraField.forEach(item => {
      if (item.key == record.key) {
        item[name] = value;
      }
    });
    this.props.dispatch({
      type: 'template/updateExtraField',
      payload: extraField
    });
  };

  changeTempalte = filePath => {
    let scaffoldId =
      this.props.form.getFieldValue('scaffold_id') || this.props.template.info.scaffold_id;
    if (!scaffoldId) {
      message.warning('请选择脚手架');
      return;
    }

    this.props.dispatch({
      type: 'scaffold/fileContent',
      payload: {
        id: scaffoldId,
        file: filePath
      },
      callback: data => {
        this.props.dispatch({
          type: 'template/changeTempalte',
          payload: data
        });
      }
    });

    // native.getFileContent(filePath, data => {

    //   // this.change(data, 'template', );
    //   // this.props.form.setFieldsValue('template', data);
    //   // this.props.info.template = data;
    //   this.props.dispatch({
    //     type: 'template/changeTempalte',
    //     payload: data,
    //   });
    // });
  };

  renderExtraField = extra_field => {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return extra_field.map((item, index) => {
      return (
        <FormItem key={item.key} {...formItemLayoutFull} label={'扩展字段' + (index + 1)}>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Input
                value={item.name}
                onChange={e => {
                  this.change(e.target.value, 'name', item);
                }}
                placeholder="请输入英文名称"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <Input
                value={item.label}
                onChange={e => {
                  this.change(e.target.value, 'label', item);
                }}
                placeholder="请输入中文名称"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <TextArea
                rows="1"
                value={item.desc}
                onChange={e => {
                  this.change(e.target.value, 'desc', item);
                }}
                placeholder="请输入简介"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <Select
                value={item.type}
                onChange={e => {
                  this.change(e, 'type', item);
                }}
                placeholder="请选择类型"
              >
                <Option value="">请选择字段类型</Option>
                <Option value="1">文本</Option>
                <Option value="2">下拉选择</Option>
                <Option value="3">复选</Option>
                <Option value="4">单选</Option>
              </Select>
            </Col>
            <Col className="gutter-row" span={8}>
              <TextArea
                rows="1"
                value={item.options}
                onChange={e => {
                  this.change(e.target.value, 'options', item);
                }}
                placeholder="请输入选项"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <TextArea
                rows="1"
                value={item.default_value}
                onChange={e => {
                  this.change(e.target.value, 'default_value', item);
                }}
                placeholder="请输入默认值"
              />
            </Col>
          </Row>
        </FormItem>
      );
    });
  };

  render() {
    const {
      template: { info },
      submitting
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const scaffoldData = this.props.scaffold.data;
    info.extra_field.forEach(item => {
      item.key = item.key || uuid();
    });

    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="脚手架：">
            {getFieldDecorator('scaffold_id', {
              initialValue: info.scaffold_id,
              rules: [
                {
                  required: true,
                  message: '脚手架'
                }
              ]
            })(
              <Select onSelect={value => this.changeScaffold(value)}>
                {scaffoldData.list.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="类别：">
            {getFieldDecorator('cate_id', {
              initialValue: info.cate_id,
              rules: [
                {
                  required: true,
                  message: '类别'
                }
              ]
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
            })(<TextArea placeholder="请输入简介" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择模版：">
            <FileTree
              treeData={this.state.files}
              onSelect={(value, node, extra) => {
                this.changeTempalte(node.fullName, extra);
              }}
              onLoadData={this.getSubFiles}
            />
          </FormItem>
          <FormItem {...formItemLayoutFull} label="模板：">
            {getFieldDecorator('template', {
              initialValue: info.template,
              rules: [
                {
                  required: true,
                  message: '请输入模板'
                }
              ]
            })(<CodeArea height="300px" placeholder="模板名称" />)}
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
