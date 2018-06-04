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

@connect(({ inter, loading }) => ({
  inter,
  // loading: loading.models.inter,
  loading: inter.loading,
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
        dataIndex: 'label',
        title: '名称',
        key: 'label',
      },
      {
        dataIndex: 'cate_id',
        title: '接口分类',
        key: 'cate_id',
      },
      {
        dataIndex: 'method',
        title: '请求方式',
        key: 'method',
      },
      {
        dataIndex: 'url',
        title: '地址',
        key: 'url',
      },
      {
        dataIndex: 'req_data',
        title: '请求数据',
        key: 'req_data',
      },
      {
        dataIndex: 'res_data',
        title: '响应数据',
        key: 'res_data',
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <Fragment>
              <Link to={'/inter/add/' + record.id}>查看</Link>
              <Divider type="vertical" />
              <Link to={'/inter/add/' + record.id}>编辑</Link>
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
      type: 'inter/list',
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
      type: 'inter/list',
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
      type: 'inter/list',
      payload: {},
    });
  }

  deleteSelectRows = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'inter/remove',
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
        type: 'inter/list',
        payload: values,
      });
    });
  }

  onDelete = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'inter/remove',
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
            <FormItem label="项目">
              <Select defaultValue="项目1">
                <Option value="1">项目1</Option>
                <Option value="2">项目2</Option>
                <Option value="3">项目3</Option>
                <Option value="4">项目4</Option>
                <Option value="5">项目5</Option>
                <Option value="6">项目6</Option>
                <Option value="7">项目7</Option>
              </Select>
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
    const { inter: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.columns;

    // const data = {
    //   list: [
    //     {
    //       name: '获取用户信息',
    //       cate: '用户相关',
    //       method: 'GET',
    //       addr: '/user/userInfo',
    //       reqData: '{userId: 123}',
    //       resData: `
    //         {
    //           code: 200,
    //           msg: '成功',
    //           data: {
    //             "id": "1",
    //             "app_key": "172139920",
    //             "role": "1",
    //             "avatar": "",
    //             "update_time": 1452562322,
    //             "create_time": "1447668570",
    //             name: 'daycool',
    //             notifyCount: 12,
    //           }
    //         }
    //       `,
    //     },
    //     {
    //       name: '保存用户信息',
    //       cate: '用户相关',
    //       method: 'GET',
    //       addr: '/user/saveInfo',
    //       reqData: `
    //         {
    //           code: 200,
    //           msg: '成功',
    //           data: {
    //             "id": "1",
    //             "app_key": "172139920",
    //             "role": "1",
    //             "avatar": "",
    //             "update_time": 1452562322,
    //             "create_time": "1447668570",
    //             name: 'daycool',
    //             notifyCount: 12,
    //           }
    //         }
    //       `,
    //       resData: `
    //         {
    //           code: 200,
    //           msg: '成功',
    //           data: {
    //             "id": "1",
    //             "app_key": "172139920",
    //             "role": "1",
    //             "avatar": "",
    //             "update_time": 1452562322,
    //             "create_time": "1447668570",
    //             name: 'daycool',
    //             notifyCount: 12,
    //           }
    //         }
    //       `,
    //     },
    //     {
    //       name: '获取订单列表用户信息',
    //       cate: '订单相关',
    //       method: 'GET',
    //       addr: '/order/orderList',
    //       reqData: '{page: 1, pageSize: 20}',
    //       resData: `
    //         {
    //           code: 200,
    //           msg: '成功',
    //           data: {
    //             page: 1,
    //             pageSize: 20,
    //             total: 1000,
    //             list: [
    //               {
    //                 "id": "1",
    //                 "app_key": "172139920",
    //                 "role": "1",
    //                 "avatar": "",
    //                 "update_time": 1452562322,
    //                 "create_time": "1447668570",
    //                 name: 'daycool',
    //                 notifyCount: 12,
    //               }
    //             ]
    //           }
    //         }
    //       `,
    //     },
    //   ]
    // };

    return (
      <PageHeaderLayout title="接口列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Link to="/inter/add/0">
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
