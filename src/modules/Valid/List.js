import React, { Fragment } from 'react';
import { Form, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import MyList from '../../components/List';

@Form.create()
@connect(({ global, valid, loading }) => ({
  global,
  valid,
  loading: loading.effects['valid/list']
}))
export default class List extends MyList {
  modeName = 'valid';
  dataKey = 'data';
  listUrl = 'valid/list';
  addUrl = '/valid/add/0';
  delUrl = 'valid/remove';
  columns = [
    {
      dataIndex: 'name',
      title: '规则名称',
      key: 'name'
    },
    {
      dataIndex: 'label',
      title: '规则类型',
      key: 'label'
    },
    {
      dataIndex: 'rule',
      title: '验证规则',
      key: 'rule'
    },
    {
      dataIndex: 'error',
      title: '验证失败信息',
      key: 'error'
    },
    {
      dataIndex: 'success',
      title: '验证成功信息',
      key: 'success'
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
      type: 'valid/list'
    });
  }
}
