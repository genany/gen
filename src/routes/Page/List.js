import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from "react-router-dom";
import moment from 'moment';
import {Popconfirm , Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ page, scaffold, loading }) => ({
  page,
  scaffold,
  // loading: loading.models.page,
  loading: page.loading,
}))
@Form.create()
export default class List extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  constructor(props){
    super(props);
    this.columns = [
      {
        dataIndex: 'app.label',
        title: '所属APP',
        key: 'app_id',
        render: (text, record) => {
          let url = '/app/Add/' + record.app_id;
          return (
            <Fragment>
              <Link to={url}>{text}</Link>
            </Fragment>
          );
        }
      },
      {
        dataIndex: 'label',
        title: '名称',
        key: 'label',
      },
      {
        dataIndex: 'path',
        title: '路径',
        key: 'path',
      },
      // {
      //   dataIndex: 'interface',
      //   title: '接口',
      // },
      // {
      //   dataIndex: 'template',
      //   title: '模版',
      // },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          let app_id = record.app_id;
          let id = record.id;
          let pid = record.pid || 0;
          let params = '/' + app_id + '/' + id + '/' + pid;

          return (
            <Fragment>
              <a href={this.getPreviewUrl(record)} target="_blank">预览</a>
              <Divider type="vertical" />
              <Link to={'/page/add' + params}>编辑</Link>
              <Divider type="vertical" />
              <Popconfirm title="确认删除吗？" onConfirm={() => this.onDelete(record, index)}>
                <a href="#">删除</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'page/list',
    });
    dispatch({
      type: 'scaffold/list',
    });
  }

  getPreviewUrl(record){
    let scaffold = this.props.scaffold.data.list.find(item => item.id == record.app.scaffold_id);
    let previewUrl = '';
    if(scaffold){
      // previewUrl = window.location.protocol + '//' + window.location.host + '/scaffold/' + scaffold.name + '/' + record.path;
      previewUrl = 'http://scaffold.sdemo.cn/#' + record.path;
    }
    return previewUrl;
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'page/list',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'page/list',
      payload: {},
    });
  }

  deleteSelectRows = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'page/remove',
      payload: {
        id: selectedRows.map(row => row.id),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'page/list',
        payload: values,
      });
    });
  }


  onDelete = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'page/remove',
      payload: {
        id: [item.id],
      },
      callback: () => {
        message.success('删除成功');
      },
    });
  }

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'page/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    // console.log(this.props, 'this.props')
    const { page: {data}, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.columns;

    // const data = {
    //   list: [
    //     {
    //       app: 'SDemo',
    //       name: '用户信息页',
    //       path: '/user/info',
    //       interface: '用户信息接口',
    //       template: '详情页',
    //     },
    //     {
    //       app: 'SDemo',
    //       name: '用户列表页',
    //       path: '/user/list',
    //       interface: '用户列表接口',
    //       template: '列表',
    //     },
    //     {
    //       app: 'SDemo',
    //       name: '用户编辑页',
    //       path: '/user/edit',
    //       interface: '用户编辑接口',
    //       template: '表单',
    //     },
    //   ]
    // }

    return (
      <PageHeaderLayout title="App列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Link to="/page/add/0/0/0">
                <Button icon="plus" type="primary">
                  新建
                </Button>
              </Link>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button onClick={this.deleteSelectRows}>批量删除</Button>
                  </span>
                )
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
