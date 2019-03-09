import React from 'react';
import { Icon } from 'antd';

import CodeMirror from 'codemirror';
// import emmet from '@emmetio/codemirror-plugin';
import './index.css';

// require('codemirror/lib/codemirror.js')
require('codemirror/lib/codemirror.css');
require('codemirror/theme/yeti.css');

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/gfm/gfm');
require('codemirror/mode/clike/clike');
require('codemirror/mode/meta');
require('codemirror/mode/jsx/jsx');
require('codemirror/keymap/sublime');
require('codemirror/addon/display/placeholder');
require('codemirror/addon/scroll/simplescrollbars');
require('codemirror/addon/dialog/dialog');

require('codemirror/addon/scroll/annotatescrollbar');
require('codemirror/addon/search/jump-to-line');
require('codemirror/addon/search/matchesonscrollbar');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/search/match-highlighter');

require('codemirror/addon/edit/continuelist');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/matchtags');
require('codemirror/addon/edit/closetag');
require('codemirror/addon/display/fullscreen');
require('codemirror/addon/display/fullscreen.css');

require('codemirror/addon/comment/comment');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/tern/tern');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/brace-fold');
require('codemirror/addon/fold/xml-fold');
require('codemirror/addon/fold/indent-fold');
require('codemirror/addon/fold/markdown-fold');
require('codemirror/addon/fold/comment-fold');

require('codemirror/addon/fold/foldgutter.css');

// require('codemirror/theme/eclipse.css')
require('codemirror/addon/dialog/dialog.css');
require('codemirror/addon/scroll/simplescrollbars.css');
require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/tern/tern.css');

// emmet(CodeMirror);

export default class CodeArea extends React.Component {
  constructor(props) {
    super(props);

    // const value = this.props.value || '';
    this.state = {
      code: '',
      isFullscreen: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      if (value !== this.state.code) {
        this.setState({ code: value }, () => {
          this.setCode(value);
        });
      }
    }
  }
  componentDidMount() {
    this.createCodeEditor();
  }
  componentWillUnmount() {
    this.codeEditor = null;
  }
  createCodeEditor() {
    let type = this.props.type;
    let code = this.props.value;
    let lineNumbers = false;
    let placeholder = this.props.placeholder || '请输入';
    let readOnly = this.props.readOnly || false;
    let height = this.props.height;

    type = type || 'jsx';
    var opt = {
      theme: 'night',
      lineNumbers: !!lineNumbers,
      matchBrackets: true,
      keyMap: 'sublime',
      dragDrop: true,
      tabSize: 2,
      lineWrapping: true,
      scrollbarStyle: 'simple',
      // extraKeys: {"Enter": "newlineAndIndentContinueComment"},
      readOnly: readOnly,
      // extraKeys: {
      //   'Tab': 'emmetExpandAbbreviation',
      //   'Enter': 'emmetInsertLineBreak'
      // },
      // theme: 'eclipse',
      // theme: 'yeti',
      theme: 'default',
      extraKeys: {
        'Ctrl-Q': function(cm) {
          cm.foldCode(cm.getCursor());
        }
      },
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
      extraKeys: {
        F11: cm => {
          this.fullScreen();
        },
        Esc: cm => {
          if (cm.getOption('fullScreen')) {
            this.setState({ isFullscreen: false });
            cm.setOption('fullScreen', false);
          }
        }
      }
      // value: val
    };

    switch (type) {
      case 'jsx':
        opt.mode = 'jsx';
        opt.tabMode = 'indent';
        opt.placeholder = placeholder;
        break;
      case 'html':
        opt.mode = 'htmlmixed';
        opt.tabMode = 'indent';
        opt.profile = 'xhtml';
        opt.placeholder = placeholder;
        break;
      case 'js':
        opt.mode = 'javascript';
        opt.placeholder = placeholder;

        break;
      case 'css':
        opt.mode = 'css';
        opt.placeholder = placeholder;
        break;
      case 'markdown':
        opt.mode = 'gfm';
        opt.placeholder = placeholder;
        break;
    }

    // var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    //   lineNumbers: true,
    //   mode: "javascript"
    // });

    this.codeEditor = CodeMirror(this.refs.code, opt);
    this.codeEditor.on('change', () => {
      let code = this.codeEditor.getDoc().getValue();
      this.setState({ code: code }, () => {
        this.triggerChange(code);
      });
    });
    this.codeEditor.on('blur', () => {
      let code = this.codeEditor.getDoc().getValue();
      this.triggerBlur(code);
    });

    // this.setCode(code);

    // this.$emit('cm', this.codeEditor);
  }
  setCode(code) {
    code = code || '';
    if (this.codeEditor) {
      try {
        let currCode = this.codeEditor.getDoc().getValue();
        if (code !== currCode) {
          this.codeEditor.getDoc().setValue(code);
        }
      } catch (e) {
        debugger;
      }
    }
  }
  fullScreen = () => {
    let isFullscreen = !this.codeEditor.getOption('fullScreen');
    this.setState({ isFullscreen: isFullscreen });
    this.codeEditor.setOption('fullScreen', isFullscreen);
  };
  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };
  triggerBlur = changedValue => {
    // Should provide an event to pass value to Form.
    const onBlur = this.props.onBlur;
    if (onBlur) {
      onBlur(changedValue);
    }
  };
  renderIcon = () => {
    const isFullscreen = this.state.isFullscreen;
    if (isFullscreen) {
      return (
        <span
          onClick={this.fullScreen}
          className="fullscreen-btn fullscreen-open"
        >
          <Icon type="shrink" />
        </span>
      );
    } else {
      return (
        <span onClick={this.fullScreen} className="fullscreen-btn">
          <Icon type="arrows-alt" />
        </span>
      );
    }
  };
  render() {
    const { size } = this.props;
    const state = this.state;
    const style = {};
    if (this.props.height) {
      style.height = this.props.height;
    }
    return (
      <div ref="code" className="code" style={style}>
        {this.renderIcon()}
      </div>
    );
  }
}
