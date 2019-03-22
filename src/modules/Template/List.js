import React, { Fragment } from 'react';
import { Form, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import MyList from '../../components/List';

@Form.create()
@connect(({ global, template, loading }) => ({
  global,
  template,
  loading: loading.effects['template/list']
}))
export default class List extends MyList {
  modeName = 'template';
  dataKey = 'data';
  listUrl = 'template/list';
  addUrl = '/template/add/0';
  delUrl = 'template/remove';
  columns = [
    {
      dataIndex: 'name',
      title: '英文名称',
      key: 'name'
    },
    {
      dataIndex: 'label',
      title: '中文名称',
      key: 'label'
    },
    {
      dataIndex: 'desc',
      title: '简介',
      key: 'desc'
    },
    {
      dataIndex: 'cate_id',
      title: '类别',
      key: 'cate_id'
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
      type: 'template/list'
    });
  }
}
