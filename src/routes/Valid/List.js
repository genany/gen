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

@connect(({ valid, loading }) => ({
  valid,
  // loading: loading.models.valid,
  loading: valid.loading,
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
        dataIndex: 'name',
        title: '规则名称',
        key: 'name',
      },
      {
        dataIndex: 'label',
        title: '规则类型',
        key: 'label',
      },
      {
        dataIndex: 'rule',
        title: '验证规则',
        key: 'rule',
      },
      {
        dataIndex: 'error',
        title: '验证失败信息',
        key: 'error',
      },
      {
        dataIndex: 'success',
        title: '验证成功信息',
        key: 'success',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Fragment>
              <Link to={'/valid/add/' + record.id}>编辑</Link>
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
      type: 'valid/list',
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
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'valid/list',
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
      type: 'valid/list',
      payload: {},
    });
  }

  deleteSelectRows = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'valid/remove',
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
        type: 'valid/list',
        payload: values,
      });
    });
  }

  onDelete = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'valid/remove',
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
            <FormItem label="规则名称">
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
    const { valid: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.columns;

    return (
      <PageHeaderLayout title="验证规则">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Link to="/valid/add/0">
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
