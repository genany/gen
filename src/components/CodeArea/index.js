import { Form, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

import CodeMirror from 'codemirror'
import emmet from '@emmetio/codemirror-plugin';
import styles from './index.less';
 // require('codemirror/lib/codemirror.js')
require('codemirror/lib/codemirror.css')
require('codemirror/theme/yeti.css')

require('codemirror/mode/xml/xml.js')
require('codemirror/mode/javascript/javascript.js')
require('codemirror/mode/htmlmixed/htmlmixed.js')
require('codemirror/mode/markdown/markdown.js')
require('codemirror/mode/gfm/gfm.js')
require('codemirror/mode/clike/clike.js')
require('codemirror/mode/meta.js')
require('codemirror/mode/jsx/jsx.js')
require('codemirror/keymap/sublime.js')
require('codemirror/addon/display/placeholder.js')
require('codemirror/addon/scroll/simplescrollbars.js')
require('codemirror/addon/dialog/dialog.js')

require('codemirror/addon/scroll/annotatescrollbar.js')
require('codemirror/addon/search/jump-to-line.js')
require('codemirror/addon/search/matchesonscrollbar.js')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/search/match-highlighter.js')

require('codemirror/addon/edit/continuelist.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/edit/closebrackets.js')
require('codemirror/addon/edit/matchtags.js')
require('codemirror/addon/edit/closetag.js')
require('codemirror/addon/display/fullscreen.js')
require('codemirror/addon/display/fullscreen.css')

require('codemirror/addon/comment/comment.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/tern/tern.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')

require('codemirror/addon/fold/foldgutter.css')

// require('codemirror/theme/eclipse.css')
require('codemirror/addon/dialog/dialog.css')
require('codemirror/addon/scroll/simplescrollbars.css')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/tern/tern.css')

emmet(CodeMirror);



export default class CodeArea extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || '';
    this.state = {
      code: value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({code: value});
      this.setCode(value);

    }
  }
  componentDidMount(){
    this.createCodeEditor();
  }
  componentWillUnmount(){
    this.codeEditor = null;
  }
  createCodeEditor(){
    let type = this.props.type;
    let code = this.props.value;
    let lineNumbers = false;
    let placeholder = this.props.placeholder || '请输入';
    let readOnly = this.props.readOnly || false;


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
      extraKeys: {
        'Tab': 'emmetExpandAbbreviation',
        'Enter': 'emmetInsertLineBreak'
      },
      // theme: 'eclipse',
      // theme: 'yeti',
      theme: 'default',
      extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
      extraKeys: {
        "F11": function(cm) {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
      }


      // value: val
    };

    switch (type) {
      case 'jsx':
        opt.mode = "jsx";
        opt.tabMode = "indent";
        opt.placeholder = placeholder;
        break;
      case 'html':
        opt.mode = "htmlmixed";
        opt.tabMode = "indent";
        opt.profile = 'xhtml';
        opt.placeholder = placeholder;
        break;
      case 'js':
        opt.mode = "javascript";
        opt.placeholder = placeholder;

        break;
      case 'css':
        opt.mode = "css";
        opt.placeholder = placeholder;
        break;
      case 'markdown':
        opt.mode = "gfm";
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
      this.setState({code: code});
      this.triggerChange(code);
    });
    this.codeEditor.on('blur', () => {
      let code = this.codeEditor.getDoc().getValue();
      this.triggerBlur(code);
    });

    // this.setCode(code);

    // this.$emit('cm', this.codeEditor);
  }
  setCode(code){
    code = code || '';
    if (this.codeEditor) {
      try{
        let currCode = this.codeEditor.getDoc().getValue();
        if(code != currCode){
          this.codeEditor.getDoc().setValue(code);
        }
      }catch(e){
        debugger;
      }
    }
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }
  triggerBlur = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onBlur = this.props.onBlur;
    if (onBlur) {
      onBlur(changedValue);
    }
  }
  render() {
    const { size } = this.props;
    const state = this.state;
    return (
      <span>
        <div ref="code" className="code"></div>
      </span>
    );
  }
}
