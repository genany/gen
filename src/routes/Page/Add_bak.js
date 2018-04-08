import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Tree,
  Table, Divider, Switch,
  message,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './add.less';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let uuid = 0;

@connect(({page, component, valid, loading }) => ({
  page,
  component,
  valid,
  submitting: loading.effects['page/add'],
}))
@Form.create()
export default class Add extends PureComponent {
  state = {
    info: this.props.page.info,
  }
  componentDidMount(){
    let id = this.props.match.params.id;
    if(id != 0){
      this.props.dispatch({
        type: 'page/info',
        payload: {
          id: id,
        },
      });
    }
    this.props.dispatch({
      type: 'component/list',
      payload: {},
    });
    this.props.dispatch({
      type: 'valid/list',
      payload: {},
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'page/add',
          payload: values,
          callback: () => {
            message.success('保存成功');

            this.props.dispatch(routerRedux.push('/page/list'));
          }
        });
      }
    });
  }

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  changeValid(value, item, templateItem){
    item.rule = value;
    // this.state.info.forEach(template => {
    //   if(template == templateItem){
    //     template.rules.forEach(rule => {

    //     });
    //   }
    // });
    console.log(this.state.info, 'changeValid')
  }
  preview(){
    window.location.href = '/#/preview/preview';
  }
  addTemplate = () => {
    console.log(this)
    // let info = this.props.page.info;
    let template = {
      template_id: '1',
      data: {
        title: '用户编辑',
        desc: '用来编辑或创建用户',
        isValid: true,
        validTipPos: '1',
        inter_id: 1,
        fields: [
          {
            name: 'userName',
            label: '用户名',
            placeholder: '',
            type: 'input',
            defaultValue: '',
            rules: [
              {
                name: 'required',
                rule: '/.+/',
                success: '验证通过',
                errorMsg: '验证失败',
              },
              {
                name: 'email',
                rule: "/^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$/",
                success: '验证通过',
                errorMsg: '请输入email',
              },
            ],

          },
          {
            name: 'userName',
            label: '用户名',
            placeholder: '',
            type: 'input',
            defaultValue: '',
            rules: [
              {
                name: 'required',
                rule: '/.+/',
                success: '验证通过',
                errorMsg: '请选择性别',
              },
            ],
          }
        ],
        confirm: {
          text: '保存',
          before: `
              function(){
                alert('执行逻辑之前处理下')
              }
          `,
          cb: `
            function(){
              alert('执行逻辑比如保存数据')
            }
          `,
          after: `
            function(){
              alert('执行逻辑之后处理下')
            }
          `,
        },
        cancel: {
          text: '取消',
          before: `
            alert('执行逻辑之前处理下')
          `,
          cb: `
            function(){
              alert('确认取消并返回')
            }
          `,
          after: `
            alert('执行逻辑之后处理下')
          `,
        },
        customBtns: [
          {
            key: 'reset',
            text: '重置',
            before: `
              alert('执行逻辑之前处理下')
            `,
            cb: `
              alert('执行逻辑比如保存数据')
            `,
            after: `
              alert('执行逻辑之后处理下')
            `,
          }
        ],
      }
    };
    // info.templates.push(template);
    this.props.dispatch({
      type: 'page/addTemplate',
      payload: template,
    });
  }
  renderTemplates(templates){
    const { page: {info}, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const componentData = this.props.component.data;
    const validData = this.props.valid.data;

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

    const formItemLayoutFull = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '自定义按钮' : ''}
          required={false}
          key={k}
        >
          <Input placeholder="按钮文本" style={{ width: '60%', marginRight: 8 }} />
          <Select defaultValue="跳转页面">
            <Option value="9">跳转页面</Option>
            <Option value="11">留在这里</Option>
            <Option value="10">提示是否跳转</Option>
            <Option value="101">自定义</Option>
          </Select>
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
           ) : null}
        </FormItem>
      );
    });

    const formColumns = [
      {
        dataIndex: 'name',
        title: '字段',
      },
      {
        dataIndex: 'type',
        title: '类型',
        render: (text, record) => {
          return (
            <Select defaultValue="文本框">
              {
                componentData.list.map(item => {
                  return (
                    <Option value={item.name}>{item.label}</Option>
                  )
                })
              }
            </Select>
          );
        }
      },
      {
        dataIndex: 'label',
        title: 'Label',
        render: (text, record) => {
          return (
            <Input value={record.name}/>
          );
        }
      },
      {
        dataIndex: 'default_value',
        title: '默认值',
        render: (text, record) => {
          return (
            <Input value={record.name}/>
          );
        }
      },
      {
        dataIndex: 'placeholder',
        title: 'Placeholder',
        render: (text, record) => {
          return (
            <Input value={record.name}/>
          );
        }
      },
      {
        dataIndex: 'is_valid',
        title: '是否验证',
        render: (text, record) => {
          return (
            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
          );
        }
      },

      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="#">删除</a>
            <Divider type="vertical" />
            <a href="#">上移</a>
            <Divider type="vertical" />
            <a href="#">下移</a>
          </span>
        ),
      }
    ];

    const formFieldData = [
      {
        name: 'userName',
        type: '',
        label: '',
        default_value: '',
        placeholder: '',
        is_valid: '',
      },
      {
        name: 'gender',
        type: '',
        label: '',
        default_value: '',
        placeholder: '',
        is_valid: '',
      },
      {
        name: 'age',
        type: '',
        label: '',
        default_value: '',
        placeholder: '',
        is_valid: '',
      },
    ];

    const expandedRowRender = (templateRecord) => {
      const columns = [
        {
          dataIndex: 'name',
          title: '名称',
          render: (text, record) => {
            return (
              <Select onChange={(value) => {this.changeValid(value, record, templateRecord)}} >
                {
                  validData.list.map(item => {
                    return (
                      <Option value={item.name}>{item.label}</Option>
                    )
                  })
                }
              </Select>
            );
          }
        },
        {
          dataIndex: 'rule',
          title: '规则',
          render: (text, record) => {
            return (
              <Input value="/^1[35789]\d{9}$/"/>
            );
          }
        },
        {
          dataIndex: 'errMsg',
          title: '错误',
          render: (text, record) => {
            return (
              <Input value={record.errMsg}/>
            );
          }
        },
        {
          dataIndex: 'succMsg',
          title: '成功',
          render: (text, record) => {
            return (
              <Input value={record.succMsg}/>
            );
          }
        },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          render: () => (
            <span className="table-operation">
              <a href="#">添加</a>
              <Divider type="vertical" />
              <a href="#">删除</a>
            </span>
          ),
        },
      ];

      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          name: '邮箱',
          errMsg: '验证失败',
          succMsg: '验证通过',
        });
      }
      return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      );
    };

    let templateAll = templates.map(item => {

      return (
        <div>
          <FormItem {...formItemLayout} label="接口：">
            {getFieldDecorator('inter_id', {
              initialValue: item.inter_id,
            })(
              <Select>
                <Option value="1">获取用户信息</Option>
                <Option value="2">登录</Option>
                <Option value="3">用户列表</Option>
                <Option value="33">搜索用户列表</Option>
                <Option value="4">编辑用户</Option>
                <Option value="5">删除用户</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayoutFull} label="验证提示方式：">
            {getFieldDecorator('validTipPos', {
              initialValue: item.validTipPos,
            })(
              <Select>
                <Option value="0">字段后面提示</Option>
                <Option value="1">字段下面提示</Option>
                <Option value="2">字段浮层提示</Option>
                <Option value="3">页面弹窗提示</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayoutFull} label="表单页面配置：">
            <Table
              columns={formColumns}
              dataSource={formFieldData}
              expandedRowRender={expandedRowRender}
              pagination={false}
            />
            <Button>
              添加
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} label="表单按钮提交：">
            <Select defaultValue="跳转页面">
              <Option value="9">跳转页面</Option>
              <Option value="11">留在这里</Option>
              <Option value="10">提示是否跳转</Option>
              <Option value="101">自定义</Option>
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="表单按钮取消：">
            <Select defaultValue="跳转页面">
              <Option value="9">跳转页面</Option>
              <Option value="11">留在这里</Option>
              <Option value="10">提示是否跳转</Option>
              <Option value="101">自定义</Option>
            </Select>
          </FormItem>
          {formItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Add field
            </Button>
          </FormItem>
        </div>

      );

    });
// console.log(templateAll, 3333333)

    return templateAll;
  }
  render() {
    const { page, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const info = this.state.info;

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

    const formItemLayoutFull = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };



    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '自定义按钮' : ''}
          required={false}
          key={k}
        >
          <Input placeholder="按钮文本" style={{ width: '60%', marginRight: 8 }} />
          <Select defaultValue="跳转页面">
            <Option value="9">跳转页面</Option>
            <Option value="11">留在这里</Option>
            <Option value="10">提示是否跳转</Option>
            <Option value="101">自定义</Option>
          </Select>
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
           ) : null}
        </FormItem>
      );
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
                  required: true, message: '所属App',
                }],
              })(
                <Select>
                  <Option value="1">SDemo</Option>
                  <Option value="2">ant-design</Option>
                  <Option value="3">ElementUI</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="父页面：">
              {getFieldDecorator('pid', {
                initialValue: info.pid,
              })(
                <Input disabled placeholder="请输入父页面" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="名称：">
              {getFieldDecorator('label', {
                initialValue: info.label,
                rules: [{
                  required: true, message: '名称',
                }],
              })(
                <Input placeholder="请输入名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Path：">
              {getFieldDecorator('path', {
                initialValue: info.path,
                rules: [{
                  required: true, message: 'Path',
                }],
              })(
                <Input placeholder="请输入Path" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="页面模版：">
              {getFieldDecorator('template', {
                initialValue: info.template,
                rules: [{
                  required: true, message: '名称',
                }],
              })(
                <Select>
                  <Option value="1">表单</Option>
                  <Option value="2">列表</Option>
                  <Option value="3">详情</Option>
                  <Option value="4">商品详情</Option>
                  <Option value="5">登录</Option>
                  <Option value="6">图表</Option>
                  <Option value="7">模态框</Option>
                  <Option value="8">异常</Option>
                </Select>
              )}
              <Button onClick={this.addTemplate}>添加模版</Button>
            </FormItem>
            <FormItem {...formItemLayout} label="模版们：">
              {getFieldDecorator('page_template', {
                initialValue: JSON.stringify(info.page_template),
                rules: [{
                  required: true, message: 'Path',
                }],
              })(
                <Input placeholder="请输入模版们" />
              )}
            </FormItem>
            {this.renderTemplates(info.page_template)}

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={this.preview} loading={submitting}>
                预览
              </Button>
              <Button type="danger" htmlType="submit" loading={submitting}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
