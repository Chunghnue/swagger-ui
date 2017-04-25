import React, { Component, PropTypes } from "react"
import shallowCompare from "react-addons-shallow-compare"
import { fromJS, List } from "immutable"
import { getSampleSchema } from "core/utils"
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/json'
import 'brace/mode/xml'
import 'brace/theme/github'

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
      isEditBox: true,
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

  onChange = (value, { isXml }) => {
    this.setState({ value })
    this._onChange(value, isXml)
  }

  _onChange = (val, isXml) => { (this.props.onChange || NOOP)(this.props.param, val, isXml) }

  handleOnChange = val => {
    let { consumesValue } = this.props
    this.onChange(val.trim(), { isEditBox: true, isXml: /xml/i.test(consumesValue) })
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
    // for domains where specSelectors not passed
    let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name")) : param
    let errors = parameter.get("errors", List())
    let consumesValue = specSelectors.contentTypeValues(pathMethod).get("requestContentType")
    let consumes = this.props.consumes && this.props.consumes.size ? this.props.consumes : ParamBody.defaultProp.consumes
    let isXml = /xml/i.test(consumesValue)

    let { value, isEditBox } = this.state
    let mode = isXml ? "xml" : "json"
    let options = {
      autoScrollEditorIntoView: true,
      highlightGutterLine: true,
      lineHeight: 2
    }
    let styles = {
      lineHeight: 1.5
    }
    return (
      <div className="body-param">
        {
          isEditBox && isExecute
            ? // <TextArea className={"body-param__text" + (errors.count() ? " invalid" : "")} value={value} onChange={this.handleOnChange} />
            <AceEditor 
            value={value} 
            onChange={this.handleOnChange} 
            mode={mode}
            theme="github"
            width="auto"
            height={200}
            fontSize={14}
            useSoftTabs={true}
            tabSize={2}
            lineHeight={2}
            style={styles} 
            editorProps={options} />
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
