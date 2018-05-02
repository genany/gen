import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from "react-router-dom";
import moment from 'moment';
import {Spin, Popconfirm , notification, Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import native from '../../utils/native.js';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ app, loading }) => ({
  app,
  // loading: loading.models.app,
  loading: app.loading,
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
        title: '名称',
        key: 'name',
      },
      {
        dataIndex: 'label',
        title: '接口baseUrl',
        key: 'label',
      },
      {
        dataIndex: 'inter_app.label',
        title: '接口',
        key: 'inter_app_id',
        render: (text, record, index) => {
          let url = '/inter/Add/' + record.inter_app_id;
          return (
            <Fragment>
              <Link to={url}>{text}</Link>
            </Fragment>
          );
        }
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
      {
        dataIndex: 'layout.label',
        title: '布局',
        key: 'layout_id',
        render: (text, record) => {
          let url = '/layout/Add/' + record.layout_id;
          return (
            <Fragment>
              <Link to={url}>{text}</Link>
            </Fragment>
          );
        }
      },
      {
        title: '页面数量',
        key: 'pageCount',
        render: (text, record) => {
          let pageCount = record.page.length
          return (
            <Fragment>
              {pageCount}
            </Fragment>
          );
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          // console.log(record)
          // let previewUrl = window.location.protocol + '//' + window.location.host + '/scaffold/' + record.scaffold.name;
          // let previewUrl = 'http://scaffold.sdemo.cn/';
          let previewUrl = this.getPreviewUrl(record);

          return (
            <Fragment>
              <a href={previewUrl} target="_blank">预览</a>
              <Divider type="vertical" />
              <Link to={'/app/add/' + record.id}>编辑</Link>
              <Divider type="vertical" />
              <Popconfirm title="确认删除吗？" onConfirm={() => this.onDelete(record, index)}>
                <a href="#">删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => this.onDownload(record)}>下载</a>
              <Divider type="vertical" />
              <a onClick={() => this.onInstall(record)}>安装依赖</a>
              <Divider type="vertical" />
              <a onClick={() => this.onStart(record)}>启动</a>
              <Divider type="vertical" />
              <a onClick={() => this.onOpenTermimal(record)}>打开命令行</a>
              <Divider type="vertical" />
              <a onClick={() => this.onOpenDir(record)}>打开目录</a>
            </Fragment>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/list',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      // newObj[key] = getValue(filtersArg[key]);
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
      type: 'app/list',
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
      type: 'app/list',
      payload: {},
    });
  }

  deleteSelectRows = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'app/remove',
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
        type: 'app/list',
        payload: values,
      });
    });
  }

  onDownload = (item, index) => {
    var downloadUrl = '/api/app/download';
    var reqDataStr = JSON.stringify({id: item.id});
    var formWrapElem = document.createElement('div');
    var id = 'id_' + Math.random();
    var sdemoDownloadForm = document.getElementById('sdemo-download-form');
    var formStr = `
    <iframe id="download-iframe-${id}" name="download-iframe" src="" frameborder="0"></iframe>
    <form id="sdemo-download-form-${id}" action="${downloadUrl + '?r=' + Math.random() }" target="download-iframe" method="post">
      <textarea name="data" id="" cols="30" rows="10">${reqDataStr}</textarea>
    </form>`;

    document.body.appendChild(formWrapElem);
    formWrapElem.innerHTML = formStr;
    formWrapElem.style.display = 'none';
    var sdemoDownloadForm = document.getElementById('sdemo-download-form-' + id);

    native.selectDir(item.id);

    sdemoDownloadForm.submit();

    var sdemoDownloadIframe = document.getElementById('download-iframe-' + id);
    sdemoDownloadIframe.onload = () => {
      var resDataStr = sdemoDownloadIframe.contentWindow.document.body.innerText.replace(/\s+/g, '');
  // console.log('resDataStr', resDataStr)
      try{
        var resData = JSON.parse(resDataStr);
        if(resData.code == 1000){
          this.props.dispatch('showLogin');
        }else if(resData.code > 1000){
          notification.error({
            message: `下载失败`,
            description: resData.msg,
          });
        }
      }catch(e){
        notification.error({
          message: `下载失败`,
        });
      }
    };

    setTimeout(function(){
      sdemoDownloadForm.parentNode.parentNode.removeChild(sdemoDownloadForm.parentNode);
    }, 2000);

    // dispatch({
    //   type: 'app/download失败，',
    //   payload: {
    //     id: item.id,
    //   },
    //   callback: () => {
    //     message.success('删除成功');
    //   },
    // });
  }
  getPreviewUrl = (item) => {
    return native.getPreviewUrl(item.id);
  }
  onInstall = (item, index) => {
      native.installApp(item.id, () => {
        message.success('安装依赖成功');
      });
  }
  onStart = (item, index) => {
      native.startApp(item.id, () => {
        message.success('启动成功');
      });
  }
  onOpenTermimal = (item, index) => {
      native.openTermimal(item.id);
  }
  onOpenDir = (item, index) => {
      native.openDir(item.id);
  }
  onDelete = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'app/remove',
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
    const { app: {data}, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.columns;

    return (
      <PageHeaderLayout title="App列表">
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
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
