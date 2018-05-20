import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Link } from 'react-router-dom';
import {
  Tree,
  Divider,
  Popconfirm,
  message,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import styles from './add.less';
import {setToEn} from '../../utils/utils.js';

const TreeNode = Tree.TreeNode;
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

@connect(({ app, interApp, scaffold, layout, loading }) => ({
  app,
  interApp,
  scaffold,
  layout,
  submitting: loading.effects['app/add'],
}))
@Form.create()
export default class Add extends PureComponent {
  componentWillReceiveProps(nextProps) {

  }
  componentDidMount(){
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'app/info',
      payload: {
        id: id,
      },
    });
    this.props.dispatch({
      type: 'interApp/list',
      payload: {},
    });
    this.props.dispatch({
      type: 'scaffold/list',
      payload: {},
    });
    this.props.dispatch({
      type: 'layout/list',
      payload: {},
    });
  }
  state = {
    treeData: [
      {
        label: 'app管理',
        app_id: 1,
        id: '1',
        children: [
          {
            label: 'app列表',
            app_id: 1,
            id: '2',

          },
          {
            label: 'app创建',
            app_id: 1,
            id: '3',

          }
        ]
      },
      {
        label: '脚手架管理',
        app_id: 1,
        id: '4',
        children: [
          {
            label: 'scaffold列表',
            app_id: 1,
            id: '5',

          },
          {
            label: 'scaffold创建',
            app_id: 1,
            id: '6',

          }
        ]
      },
      {
        label: '接口管理',
        app_id: 1,
        id: '7',
        children: [
          {
            label: 'inter列表',
            app_id: 1,
            id: '8',

          },
          {
            label: 'inter创建',
            app_id: 1,
            id: '9',

          }
        ]
      },

    ],
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.app.info.id;
        let payload = values;
        if(id){
          payload = {
            ...payload,
            id,
          };
        }
        this.props.dispatch({
          type: 'app/add',
          payload: payload,
          callback: () => {
            message.success('保存成功');

            this.props.dispatch(routerRedux.push('/app/list'));
          }
        });
      }
    });
  }
  cancel = ()=>{
    this.props.dispatch(routerRedux.push('/app/list'));
  }
  handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }
  onDeleteNode = (id, arr) => {
    let removeIndex = null;
    arr.map((item, index) => {
      if(item.key == id){
        removeIndex = index;
      }
    });

    arr.splice(removeIndex, 1);
    this.setState({
      treeData: [...this.state.treeData]
    });
  }
  renderMenuNode(text){
    return (
      <div>
        {text}
        <Link to="/page/add">
          <Button size="small" type="primary" style={{marginLeft: 10}}>添加子页面</Button>
        </Link>
        <Divider type="vertical"/>
        <Popconfirm title="确认删除吗？" onConfirm={() => this.onDeleteNode(11)}>
          <Button size="small" type="danger">删除</Button>
        </Popconfirm>
      </div>
    );
  }
  getEditPageUrl(id, pid){
    let appId = this.props.app.info.id;
    id = id || 0;
    pid = pid || 0;
    return '/page/add/' + appId + '/' + id + '/' + pid;
  }
  getAddPageUrl(pid){
    let appId = this.props.app.info.id;
    pid = pid || 0;
    return '/page/add/' + appId + '/0/' + pid;
  }
  addPage = (pid) => {
    if(!this.props.app.info.id){
      message.warning('请创建App后在添加页面');
      return ;
    }
    let addPageUrl = this.getAddPageUrl(pid);
    this.props.dispatch(routerRedux.push(addPageUrl));
  }
  zh2En = (value) => {
    zh2En(value.target.value).then((data) => {
      this.props.form.setFieldsValue({
        name: data
      });
    });
  }
  renderNode(item, arr){
    return (
      <div>
        {item.label}
        <Link to={this.getEditPageUrl(item.id, item.pid)}>
          <Button size="small" type="primary" style={{marginLeft: 10}}>编辑</Button>
        </Link>
        <Button onClick={() => this.addPage(item.id)} size="small" type="primary" style={{marginLeft: 10}}>添加子页面</Button>
        <Divider type="vertical"/>
        <Popconfirm title="确认删除吗？" onConfirm={() => this.onDeleteNode(item.id, arr)}>
          <Button size="small" type="danger">删除</Button>
        </Popconfirm>
      </div>
    );
  }
  renderTreeNodes = (data) => {
    return data.map((item, index) => {
      index = index || 'page-';
      if (item.children) {
        return (
          <TreeNode title={this.renderNode(item, data)} key={index + '-' + item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={this.renderNode(item, data)} key={index + '-' + item.id} dataRef={item} />;
    });
  }
  render() {
    const { app: {info}, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const interAppData = this.props.interApp.data;
    const scaffoldData = this.props.scaffold.data;
    const layoutData = this.props.layout.data;
    // const newPage = [...info.page];
    const pageTreeData = info.pageTreeData;

    return (
      <PageHeaderLayout title="APP编辑" content="用来编辑或创建APP">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="中文名称：">
              {getFieldDecorator('label', {
                initialValue: info.label,
                rules: [{
                  required: true, message: '中文名称',
                }],
              })(
                <Input onBlur={(e) => {setToEn.bind(this, e.target.value, 'name')()}} placeholder="请输入中文名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="英文名称：">
              {getFieldDecorator('name', {
                initialValue: info.name,
                rules: [{
                  required: true, message: '英文名称',
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
            <FormItem {...formItemLayout} label="接口：">
              {getFieldDecorator('inter_app_id', {
                initialValue: info.inter_app_id,
                rules: [{
                  required: true, message: '接口baseUrl',
                }],
              })(
                <Select>
                  {
                    interAppData.list.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>{item.label}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="接口baseUrl：">
              {getFieldDecorator('base_url', {
                initialValue: info.base_url,
                rules: [{
                  required: true, message: '接口baseUrl',
                }],
              })(
                <Input placeholder="请输入接口baseUrl" />
              )}
            </FormItem>
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
            <FormItem {...formItemLayout} label="布局：">
              {getFieldDecorator('layout_id', {
                initialValue: info.layout_id,
                rules: [{
                  required: true, message: '接口baseUrl',
                }],
              })(
                <Select>
                  {
                    layoutData.list.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>{item.label}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayoutFull} label="页面：">
              <Button onClick={() => this.addPage(0)} size="small" type="primary">添加页面</Button>
              <Tree
                showLine
                defaultExpandedKeys={['0-0-0']}
                onSelect={this.onSelect}
              >
                {
                  this.renderTreeNodes(pageTreeData)
                }
              </Tree>
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
