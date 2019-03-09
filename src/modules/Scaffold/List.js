import React, { Fragment } from 'react';
import { Form, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import MyList from '../../components/List';

@Form.create()
@connect(({ global, scaffold, loading }) => ({
  global,
  scaffold,
  loading: loading.effects['scaffold/getList']
}))
export default class List extends MyList {
  modeName = 'scaffold';
  dataKey = 'data';
  listUrl = 'scaffold/list';
  addUrl = '/scaffold/add/0';
  delUrl = 'scaffold/remove';
  columns = [
    {
      dataIndex: 'name',
      title: '英文名称',
      key: 'name'
    },
    {
      dataIndex: 'label',
      title: '名称',
      key: 'label'
    },
    {
      dataIndex: 'file',
      title: '压缩包',
      key: 'file'
    },
    {
      dataIndex: 'router_file_path',
      title: '路由文件',
      key: 'router_file_path'
    },
    {
      dataIndex: 'menu_file_path',
      title: '菜单导航文件',
      key: 'menu_file_path'
    },
    {
      dataIndex: 'page_dir',
      title: '页面目录',
      key: 'page_dir'
    },
    {
      dataIndex: 'store_dir',
      title: 'Store目录',
      key: 'store_dir'
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
      type: 'scaffold/list'
    });
  }
}
