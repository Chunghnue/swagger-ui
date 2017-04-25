import React, { Component, PropTypes } from "react"
import shallowCompare from "react-addons-shallow-compare"
import { fromJS, List } from "immutable"
import { getSampleSchema } from "core/utils"
import CodeMirror from "react-codemirror"
require('codemirror/lib/codemirror.css')
require('codemirror/theme/eclipse.css')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/xml/xml')
require('codemirror/addon/lint/lint')
require('codemirror/addon/edit/closebrackets')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/edit/trailingspace')
require('codemirror/addon/edit/continuelist')
// require('jsonlint')
// require('codemirror/addon/lint/json-lint')
const NOOP = Function.prototype

export default class ParamBody extends Component {

  static propTypes = {
    param: PropTypes.object,
    onChange: PropTypes.func,
    onChangeConsumes: PropTypes.func,
    consumes: PropTypes.object,
    consumesValue: PropTypes.string,
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    isExecute: PropTypes.bool,
    specSelectors: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired
  };

  static defaultProp = {
    consumes: fromJS(["application/json"]),
    param: fromJS({}),
    onChange: NOOP,
    onChangeConsumes: NOOP,
  };

  constructor(props, context) {
    super(props, context)

    this.state = {
      isEditBox: false,
      value: ""
    }

  }

  componentDidMount() {
    this.updateValues.call(this, this.props)
  }

  shouldComponentUpdate(props, state) {
    return shallowCompare(this, props, state)
  }

  componentWillReceiveProps(nextProps) {
    this.updateValues.call(this, nextProps)
  }

  updateValues = (props) => {
    let { specSelectors, pathMethod, param, isExecute, consumesValue = "" } = props
    let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name")) : {}
    let isXml = /xml/i.test(consumesValue)
    let paramValue = parameter ? (isXml ? parameter.get("value_xml") : parameter.get("value")) : null

    if (paramValue !== undefined) {
      let val = !paramValue && !isXml ? "{}" : paramValue
      this.setState({ value: val })
      this.onChange(val, { isXml: isXml, isEditBox: isExecute })
    } else {
      if (isXml) {
        this.onChange(this.sample("xml"), { isXml: isXml, isEditBox: isExecute })
      } else {
        this.onChange(this.sample(), { isEditBox: isExecute })
      }
    }
  }

  sample = (xml) => {
    let { param, fn: { inferSchema } } = this.props
    let schema = inferSchema(param.toJS())

    return getSampleSchema(schema, xml)
  }

  onChange = (value, { isEditBox, isXml }) => {
    this.setState({ value, isEditBox })
    this._onChange(value, isXml)
  }

  _onChange = (val, isXml) => { (this.props.onChange || NOOP)(this.props.param, val, isXml) }

  handleOnChange = val => {
    let { consumesValue } = this.props
    this.onChange(val.trim(), { isXml: /xml/i.test(consumesValue) })
  }

  toggleIsEditBox = () => this.setState(state => ({ isEditBox: !state.isEditBox }))

  render() {
    let {
      onChangeConsumes,
      param,
      isExecute,
      specSelectors,
      pathMethod,

      getComponent,
    } = this.props

    const Button = getComponent("Button")
    const TextArea = getComponent("TextArea")
    const HighlightCode = getComponent("highlightCode")
    const ContentType = getComponent("contentType")
    console.log('ContentType', ContentType);
    // for domains where specSelectors not passed
    let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name")) : param
    let errors = parameter.get("errors", List())
    let consumesValue = specSelectors.contentTypeValues(pathMethod).get("requestContentType")
    let consumes = this.props.consumes && this.props.consumes.size ? this.props.consumes : ParamBody.defaultProp.consumes
    let isXml = /xml/i.test(consumesValue)

    let { value, isEditBox } = this.state
    let options = {
      mode: isXml ? "xml" : "application/json",
      lineNumbers: true,
      tabMode: "indent",
      gutters: ["CodeMirror-lint-markers"],
      lint: true,
      viewportMargin: Infinity,
      autoRefresh: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      theme: 'eclipse'
    }
    return (
      <div className="body-param">
        {
          isEditBox && isExecute
            ? // <TextArea className={"body-param__text" + (errors.count() ? " invalid" : "")} value={value} onChange={this.handleOnChange} />
            <CodeMirror value={value} onChange={this.handleOnChange} options={options} />
            : (value && <HighlightCode className="body-param__example"
              value={value} />)
        }
        <div className="body-param-options">

          <label htmlFor="">
            <span>Parameter content type</span>
            <ContentType value={consumesValue} contentTypes={consumes} onChange={onChangeConsumes} className="body-param-content-type" />
          </label>
        </div>

      </div>
    )

  }
}
