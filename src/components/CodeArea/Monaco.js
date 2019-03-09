import React from 'react';
import { Icon, Tooltip } from 'antd';

import MonacoEditor from '../MonacoEditor/index';
import './monaco.less';

export default class Monaco extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.value,
      isFullscreen: false
    };
    this.hjson = null;
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      let value = nextProps.value;

      if (value !== this.state.code) {
        this.setState({ code: value });
      }
    }
  }
  editorDidMount = (editor, monaco) => {
    // console.log('editorDidMount', editor)
    editor.focus();
  };
  onChange = (newValue, e) => {
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  };
  fullScreen = e => {
    let isFullscreen = this.state.isFullscreen;
    this.setState({ isFullscreen: !isFullscreen });
  };
  fullScreenChange = e => {
    const keyCode = e.keyCode;
    if (keyCode === 27) {
      this.setState({ isFullscreen: false });
      e.stopPropagation();
    } else if (keyCode === 122) {
      e.preventDefault();
      this.fullScreen();
    }

    return false;
  };

  renderIcon = () => {
    const isFullscreen = this.state.isFullscreen;
    if (isFullscreen) {
      return (
        <span onClick={this.fullScreen} styleName="fullscreen-btn fullscreen-open">
          <Icon type="shrink" />
        </span>
      );
    } else {
      return (
        <Tooltip placement="topLeft" title="全屏" arrowPointAtCenter>
          <span onClick={this.fullScreen} styleName="fullscreen-btn">
            <Icon type="arrows-alt" />
          </span>
        </Tooltip>
      );
    }
  };
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };
    let type = this.props.type;
    // let lineNumbers = false
    // let placeholder = this.props.placeholder || '请输入'
    // let readOnly = this.props.readOnly || false
    let height = parseInt(this.props.height) || 26;
    height = isNaN(height) || this.state.isFullscreen ? '100%' : height;

    return (
      <div
        styleName={this.state.isFullscreen ? 'code fullscreen-open' : 'code'}
        onKeyDown={this.fullScreenChange}
      >
        {this.renderIcon()}
        <MonacoEditor
          height={height}
          language={type}
          theme="vs"
          value={code}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
      </div>
    );
  }
}
