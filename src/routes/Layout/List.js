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

@connect(({ layout, loading }) => ({
  layout,
  // loading: loading.models.layout,
  loading: layout.loading,
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
        dataIndex: 'label',
        title: '名称',
        key: 'label',
      },
      {
        dataIndex: 'scaffold.label',
        title: '脚手架',
        key: 'scaffold',
        render: (text, record) => {
          let url = '/scaffold/Add/' + record.scaffold_id;
          return (
            <Fragment>
              <Link to={url}>{text}</Link>
            </Fragment>
          );
        }
      },
      {
        dataIndex: 'desc',
        title: '简介',
        key: 'desc',
      },
      {
        dataIndex: 'template',
        title: '模版',
        key: 'template',
      },
      // {
      //   dataIndex: 'htmlTemplate',
      //   title: 'html模版',
      // key: 'htmlTemplate',
      // },
      // {
      //   dataIndex: 'jsTemplate',
      //   title: 'js模版',
      // key: 'jsTemplate',
      // },
      // {
      //   dataIndex: 'cssTemplate',
      //   title: 'css模版',
      // key: 'cssTemplate',
      // },

      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Fragment>
              <Link to={'/layout/add/' + record.id}>预览</Link>
              <Divider type="vertical" />
              <Link to={'/layout/add/' + record.id}>查看</Link>
              <Divider type="vertical" />
              <Link to={'/layout/add/' + record.id}>编辑</Link>
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
      type: 'layout/list',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
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
      type: 'layout/list',
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
      type: 'layout/list',
      payload: {},
    });
  }

  deleteSelectRows = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'layout/remove',
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
        type: 'layout/list',
        payload: values,
      });
    });
  }

  onDelete = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'layout/remove',
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
    const { layout: {data}, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.columns;

    // const data = {
    //   list: [
    //     {
    //       name: '空白布局',
    //       template: '布局引入文件',
    //       htmlTemplate: 'html结构',
    //       jsTemplate: 'js逻辑',
    //       cssTemplate : 'css样式',
    //     },
    //     {
    //       name: '固定顶栏-底栏响应式布局',
    //       template: '布局引入文件',
    //       htmlTemplate: 'html结构',
    //       jsTemplate: 'js逻辑',
    //       cssTemplate : 'css样式',
    //     },
    //     {
    //       name: '顶栏-侧栏-底栏-布局',
    //       template: '布局引入文件',
    //       htmlTemplate: 'html结构',
    //       jsTemplate: 'js逻辑',
    //       cssTemplate : 'css样式',
    //     },
    //     {
    //       name: '顶栏-侧栏-底栏-响应式布局',
    //       template: '布局引入文件',
    //       htmlTemplate: 'html结构',
    //       jsTemplate: 'js逻辑',
    //       cssTemplate : 'css样式',
    //     },
    //     {
    //       name: '顶栏-底栏布局',
    //       template: '布局引入文件',
    //       htmlTemplate: 'html结构',
    //       jsTemplate: 'js逻辑',
    //       cssTemplate : 'css样式',
    //     },
    //   ]
    // };

    return (
      <PageHeaderLayout title="布局列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Link to="/app/add/0">
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
