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

@connect(({ scaffold, loading }) => ({
  scaffold,
  // loading: loading.models.scaffold,
  loading: scaffold.loading,
}))
@Form.create()
export default class List extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  constructor(props){
    super(props);

    this.columns = [
      {
        dataIndex: 'name',
        title: '英文名称',
        key: 'name',
      },
      {
        dataIndex: 'label',
        title: '名称',
        key: 'label',
      },
      {
        dataIndex: 'file',
        title: '压缩包',
        key: 'file',
      },
      {
        dataIndex: 'router_file_path',
        title: '路由文件',
        key: 'router_file_path',
      },
      {
        dataIndex: 'menu_file_path',
        title: '菜单导航文件',
        key: 'menu_file_path',
      },
      {
        dataIndex: 'page_dir',
        title: '页面目录',
        key: 'page_dir',
      },
      {
        dataIndex: 'store_dir',
        title: 'Store目录',
        key: 'store_dir',
      },
      // {
      //   dataIndex: 'service_template',
      //   title: 'service模版',
      //   key: 'service_template',
      // },
      // {
      //   dataIndex: 'service_dir',
      //   title: 'service目录',
      //   key: 'service_dir',
      // },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Fragment>
              <Link to={'/scaffold/add/' + record.id}>查看</Link>
              <Divider type="vertical" />
              <Link to={'/scaffold/add/' + record.id}>编辑</Link>
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
      type: 'scaffold/list',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'scaffold/list',
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
      type: 'scaffold/list',
      payload: {},
    });
  }

  deleteSelectRows = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'scaffold/remove',
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
        type: 'scaffold/list',
        payload: values,
      });
    });
  }

  onDelete = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'scaffold/remove',
      payload: {
        id: [item.id],
      },
      callback: () => {
        message.success('删除成功');
      },
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
    const { scaffold: {data}, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.columns;

    // const data = {
    //   list: [
    //     {
    //       name: 'ant-desgin',
    //       label: 'ant-desgin脚手架',
    //       scaffold: '/scaffold/ant-desgin-scaffold.zip',
    //       routeFile: '/src/common/router.js',
    //       menuFile: '/src/common/menu.js',
    //       pageDir: '/src/routers/',
    //       storeDir: '/src/storeDir',
    //     },
    //     {
    //       name: 'element',
    //       label: 'ElementUI脚手架',
    //       scaffold: '/scaffold/Element-scaffold.zip',
    //       routeFile: '/src/common/router.js',
    //       menuFile: '/src/common/menu.js',
    //       pageDir: '/src/routers/',
    //       storeDir: '/src/storeDir',
    //     },
    //     {
    //       name: 'Bootstrap',
    //       label: 'Bootstrap脚手架',
    //       scaffold: '/scaffold/Bootstrap-scaffold.zip',
    //       routeFile: '/src/common/router.js',
    //       menuFile: '/src/common/menu.js',
    //       pageDir: '/src/routers/',
    //       storeDir: '/src/storeDir',
    //     },
    //   ]
    // };

    return (
      <PageHeaderLayout title="脚手架列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Link to="/scaffold/add/0">
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
