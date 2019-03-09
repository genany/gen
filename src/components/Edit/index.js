import React, { Fragment } from 'react';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Icon,
  Rate,
  Tooltip,
  Input,
  Table,
  Card,
  DatePicker,
  Row,
  Col,
  message,
  Divider,
  Popconfirm,
  Spin
} from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import classNames from 'classnames';
import moment from 'moment';
import { dateFormater, toSecond } from '@/utils/utils';
import UploadImg from '@/components/UploadImg';
import SimpleTable from '../../components/SimpleTable';
import native from '../../utils/native';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Span } from 'glamorous';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    };
  }
  modeName = '';
  dataKey = '';
  addUrl = '';
  delUrl = '';
  updateUrl = '';
  getUrl = '';
  listUrl = '';
  columns = [];
  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getList(values);
      }
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: this.listUrl,
      payload: {}
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.getList({
      pageSize: pagination.pageSize,
      page: pagination.current
    });
  };

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows
    });
  };

  deleteSelectRows = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: this.delUrl,
      payload: {
        id: selectedRows.map(row => row.id)
      },
      callback: () => {
        this.setState({
          selectedRows: []
        });
      }
    });
  };

  onDelete = (item, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: this.delUrl,
      payload: {
        id: [item.id]
      },
      callback: () => {
        message.success('删除成功');
      }
    });
  };

  getList = (params = {}) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let payload = { ...values };

        payload = { ...payload, ...params };

        this.props.dispatch({
          type: this.listUrl,
          payload: {
            ...payload
          }
        });
      } else {
      }
    });
  };

  getData = () => {
    // this.test()
    if (!this.modeName) {
      console.log('请输入modelName');
      return null;
    }
    if (!this.dataKey) {
      console.log('请输入dataKey');
      return null;
    }
    return this.props[this.modeName][this.dataKey];
  };

  getSearchContion = () => {
    const { getFieldDecorator } = this.props.form;

    return (
      <Col xl={12} md={24} sm={24}>
        <FormItem label="名称" className="form-inline-item">
          {getFieldDecorator('name')(<Input />)}
        </FormItem>
      </Col>
    );
  };

  getOperatorBtn = () => {
    const { selectedRows } = this.state;

    return (
      <Fragment>
        <Link to={this.addUrl}>
          <Button icon="plus" type="primary">
            新建
          </Button>
        </Link>
        {selectedRows.length > 0 && (
          <span>
            <Button onClick={this.deleteSelectRows}>批量删除</Button>
          </span>
        )}
      </Fragment>
    );
  };

  getTable = () => {
    const columns = this.columns;
    const data = this.getData();
    if (data == null) {
      return <Spin />;
    }

    return (
      <SimpleTable
        columns={columns}
        rowKey={record => record.id}
        dataSource={data.list}
        pagination={{ ...this.state.pagination, total: data.total }}
        loading={this.props.loading}
        onChange={this.handleTableChange}
        rowSelection={{
          onChange: this.handleSelectRows,
          selectedRowKeys: this.state.selectedRowKeys
        }}
      />
    );
  };

  render() {
    const global = this.props.global;

    return (
      <Card bordered={false}>
        <div className={'tableList'}>
          <div
            className={classNames({
              tableListForm: !global.isMobile,
              tableListFormMobile: global.isMobile
            })}
          >
            <Form layout={global.form.layout} onSubmit={this.handleSubmit}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                {this.getSearchContion()}
                <Col xl={12} md={24} sm={24}>
                  <div className={'submitButtons'}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={this.handleFormReset}
                    >
                      重置
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={'tableListOperator'}>{this.getOperatorBtn()}</div>
          {this.getTable()}
        </div>
      </Card>
    );
  }
}
