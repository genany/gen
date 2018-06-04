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

@connect(({ template, loading }) => ({
  template,
  // loading: loading.models.template,
  loading: template.loading,
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
        title: '英文名称',
        key: 'name',
      },
      {
        dataIndex: 'label',
        title: '中文名称',
        key: 'label',
      },
      {
        dataIndex: 'desc',
        title: '简介',
        key: 'desc',
      },
      {
        dataIndex: 'cate_id',
        title: '类别',
        key: 'cate_id',
      },
      {
        dataIndex: 'scaffold.label',
        title: '脚手架',
        key: 'scaffold_id',
        render: (text, record) => {
          let url = '/scaffold/Add/' + record.scaffold_id;
          return (
            <Fragment>
              <Link to={url}>{text}</Link>
            </Fragment>
          );
        }
      },
      // {
      //   dataIndex: 'template',
      //   title: '默认模版',
      //   key: 'template',
      // },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Fragment>
              <Link to={'/template/add/' + record.id}>查看</Link>
              <Divider type="vertical" />
              <Link to={'/template/add/' + record.id}>编辑</Link>
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
      type: 'template/list',
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
      type: 'template/list',
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
      type: 'template/list',
      payload: {},
    });
  }

  deleteSelectRows = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'template/remove',
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
        type: 'template/list',
        payload: values,
      });
    });
  }

  onDelete = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'template/remove',
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
    const { template: {data}, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.columns;

    // const data = {
    //   list: [
    //     {
    //       name: 'form',
    //       label: '表单',
    //       template: '引入HTML、JS、CSS和其它模版文件',
    //     },
    //     {
    //       name: 'list',
    //       label: '表格',
    //       template: '引入HTML、JS、CSS和其它模版文件',
    //     },
    //     {
    //       name: 'detail',
    //       label: '详情',
    //       template: '引入HTML、JS、CSS和其它模版文件',
    //     },
    //   ]
    // };

    return (
      <PageHeaderLayout title="模版列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
                <Link to="/template/add/0">
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
