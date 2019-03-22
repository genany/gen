import React, { Fragment } from 'react';
import { Form, message, Divider, Popconfirm, notification } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import native from '../../utils/native';
import MyList from '../../components/List';

@Form.create()
@connect(({ global, app, loading }) => ({
  global,
  app,
  loading: loading.effects['app/list']
}))
export default class List extends MyList {
  modeName = 'app';
  dataKey = 'data';
  listUrl = 'app/list';
  addUrl = '/app/add/0';
  delUrl = 'app/remove';
  columns = [
    {
      dataIndex: 'name',
      title: '名称',
      key: 'name'
    },
    {
      dataIndex: 'projectPath',
      title: '本地路径',
      key: 'projectPath'
    },
    {
      dataIndex: 'label',
      title: '接口baseUrl',
      key: 'label'
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
        // let pageCount = record.page.length;
        // return <Fragment>{pageCount}</Fragment>;
        return 1;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text, record, index) => {
        // console.log(record)
        // let previewUrl = window.location.protocol + '//' + window.location.host + '/scaffold/' + record.scaffold.name;
        // let previewUrl = 'http://scaffold.sdemo.cn/';
        let previewUrl = this.getPreviewUrl(record);

        return (
          <Fragment>
            <a href={previewUrl} target="_blank">
              预览
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.onDownload(record)}>下载</a>
            <Divider type="vertical" />
            <Link to={'/app/add/' + record.id}>编辑</Link>
            <Divider type="vertical" />
            <Popconfirm title="确认删除吗？" onConfirm={() => this.onDelete(record, index)}>
              <a>删除</a>
            </Popconfirm>

            <a onClick={() => this.onInstall(record)}>安装依赖</a>
            <Divider type="vertical" />
            <a onClick={() => this.onOpenTermimal(record)}>打开命令行</a>
            <Divider type="vertical" />
            <a onClick={() => this.onStart(record)}>启动</a>
            <Divider type="vertical" />
            <a onClick={() => this.onOpenDir(record)}>打开目录</a>
          </Fragment>
        );
      }
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/list'
    });
  }

  onDownload = (item, index) => {
    var downloadUrl = '/api/app/download';
    var reqDataStr = JSON.stringify({ id: item.id });
    var formWrapElem = document.createElement('div');
    var id = 'id_' + Math.random();
    var sdemoDownloadForm = document.getElementById('sdemo-download-form');
    var formStr = `
    <iframe id="download-iframe-${id}" name="download-iframe" src="" frameborder="0"></iframe>
    <form id="sdemo-download-form-${id}" action="${downloadUrl +
      '?r=' +
      Math.random()}" target="download-iframe" method="post">
      <textarea name="data" id="" cols="30" rows="10">${reqDataStr}</textarea>
    </form>`;

    document.body.appendChild(formWrapElem);
    formWrapElem.innerHTML = formStr;
    formWrapElem.style.display = 'none';
    sdemoDownloadForm = document.getElementById('sdemo-download-form-' + id);

    var projectPath = native.selectDir(item.id);
    if (projectPath) {
      this.props.dispatch({
        type: 'app/updateProjectPath',
        payload: {
          id: item.id,
          projectPath
        },
        callback: () => {}
      });
    }

    sdemoDownloadForm.submit();

    var sdemoDownloadIframe = document.getElementById('download-iframe-' + id);
    sdemoDownloadIframe.onload = () => {
      var resDataStr = sdemoDownloadIframe.contentWindow.document.body.innerText.replace(
        /\s+/g,
        ''
      );
      // console.log('resDataStr', resDataStr)
      try {
        var resData = JSON.parse(resDataStr);
        if (resData.code === 1000) {
          this.props.dispatch('showLogin');
        } else if (resData.code > 1000) {
          notification.error({
            message: `下载失败`,
            description: resData.msg
          });
        }
      } catch (e) {
        notification.error({
          message: `下载失败`
        });
      }
    };

    setTimeout(function() {
      sdemoDownloadForm.parentNode.parentNode.removeChild(sdemoDownloadForm.parentNode);
    }, 6 * 1000);

    // dispatch({
    //   type: 'app/download失败，',
    //   payload: {
    //     id: item.id,
    //   },
    //   callback: () => {
    //     message.success('删除成功');
    //   },
    // });
  };
  getPreviewUrl = item => {
    return native.getPreviewUrl(item.id);
  };
  onInstall = (item, index) => {
    native.installApp(item.id, () => {
      message.success('安装依赖成功');
    });
  };
  onStart = (item, index) => {
    native.startApp(item.id, () => {
      message.success('启动成功');
    });
  };
  onOpenTermimal = (item, index) => {
    native.openTermimal(item.id);
  };
  onOpenDir = (item, index) => {
    native.openDir(item.id);
  };
}
