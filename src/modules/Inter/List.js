import React, { Fragment } from 'react';
import { Form, Divider, Popconfirm, Button, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import MyList from '../../components/List';

@Form.create()
@connect(({ global, inter, loading }) => ({
  global,
  inter,
  loading: loading.effects['inter/list']
}))
export default class List extends MyList {
  modeName = 'inter';
  dataKey = 'data';
  listUrl = 'inter/list';
  addUrl = '/inter/add/0';
  delUrl = 'inter/remove';
  columns = [
    {
      dataIndex: 'label',
      title: '名称',
      key: 'label'
    },
    {
      dataIndex: 'cate_id',
      title: '接口分类',
      key: 'cate_id'
    },
    {
      dataIndex: 'method',
      title: '请求方式',
      key: 'method'
    },
    {
      dataIndex: 'url',
      title: '地址',
      key: 'url'
    },
    {
      dataIndex: 'req_data',
      title: '请求数据',
      key: 'req_data'
    },
    {
      dataIndex: 'res_data',
      title: '响应数据',
      key: 'res_data'
    },
    {
      title: '操作',
      render: (text, record, index) => {
        return (
          <Fragment>
            <Link to={`/page/add/${record.inter_app_id}/0/0/${record.id}`}>生成页面</Link>
            <Divider type="vertical" />
            <Link to={'/inter/add/' + record.id}>查看</Link>
            <Divider type="vertical" />
            <Link to={'/inter/add/' + record.id}>编辑</Link>
            <Divider type="vertical" />
            <Popconfirm title="确认删除吗？" onConfirm={() => this.onDelete(record, index)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        );
      }
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inter/list'
    });
  }

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
            <Button type="danger" onClick={this.deleteSelectRows}>
              批量删除
            </Button>
            <Button
              onClick={this.deleteSelectRows}
              onClick={() => message.warn('开发中，敬请期待。。。')}
            >
              批量生成
            </Button>
          </span>
        )}
      </Fragment>
    );
  };
}
