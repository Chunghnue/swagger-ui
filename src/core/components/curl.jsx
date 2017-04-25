import React, { PropTypes } from "react"
import curlify from "core/curlify"

export default class Curl extends React.Component {
  static propTypes = {
    request: PropTypes.object.isRequired
  }

  handleFocus(e) {
    e.target.select()
    document.execCommand("copy")
  }

  render() {
    let { request } = this.props
    let curl = curlify(request)

    return (
      <div>
        <div className="opblock-section-header">
          <h4 className="opblock-title">Curl</h4>
        </div>
        <div className="copy-paste">
          <textarea onFocus={this.handleFocus} className="curl" style={{ whiteSpace: "normal" }} value={curl}></textarea>
        </div>
      </div>
    )
  }

}
