import React, { PropTypes } from "react"
import ImPropTypes from "react-immutable-proptypes"

const Headers = ({ headers }) => {
  return (
    <div>
      <div className="opblock-section-header">
        <h4>Response headers</h4>
      </div>
      <pre>{headers}</pre>
    </div>)
}

Headers.propTypes = {
  headers: PropTypes.array.isRequired
}

export default class LiveResponse extends React.Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    const { request, response, getComponent } = this.props

    const body = response.get("text")
    const status = response.get("status")
    const url = response.get("url")
    const headers = response.get("headers").toJS()
    const notDocumented = response.get("notDocumented")
    const isError = response.get("error")

    const headersKeys = Object.keys(headers)
    const contentType = headers["content-type"]

    const Curl = getComponent("curl")
    const ResponseBody = getComponent("responseBody")
    const returnObject = headersKeys.map(key => {
      return <span className="headerline" key={key}> {key}: {headers[key]} </span>
    })

    return (
      <div>
        {request && <Curl request={request} />}
        <div className="opblock-section-header">
          <h4 className="opblock-title">Server response</h4>
        </div>
        <div><span>{status}</span></div>
        {
          !notDocumented ? null :
            <div className="response-undocumented">
              <i> Undocumented </i>
            </div>
        }
        {
          !isError ? null : <span>
            {`${response.get("name")}: ${response.get("message")}`}
          </span>
        }
        {
          !headers ? null : <Headers headers={returnObject} />
        }
        {
          !body || isError ? null
            : <ResponseBody content={body}
              contentType={contentType}
              url={url}
              headers={headers}
              getComponent={getComponent} />
        }

      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    request: ImPropTypes.map,
    response: ImPropTypes.map
  }
}
