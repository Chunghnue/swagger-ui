import React, { Component, PropTypes } from "react"
// import { highlight } from "core/utils"
import SyntaxHighlighter from "react-syntax-highlighter"
import { monokai } from "react-syntax-highlighter/dist/styles"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  componentDidMount() {
    // highlight(this.refs.el)
  }

  componentDidUpdate() {
    // highlight(this.refs.el)
  }

  render () {
    let { value, className } = this.props
    className = className || ""
    return <SyntaxHighlighter className="response-col_description" style={monokai}>{ value }</SyntaxHighlighter>
    // return <pre ref="el" className={className + " microlight"}>{ value }</pre>
  }
}
