import React, { PropTypes } from "react"
import { fromJS } from "immutable"
import { defaultStatusCode } from "core/utils"

export default class Responses extends React.Component {

  static propTypes = {
    request: PropTypes.object,
    tryItOutResponse: PropTypes.object,
    responses: PropTypes.object.isRequired,
    produces: PropTypes.object,
    producesValue: PropTypes.any,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired,
    fn: PropTypes.object.isRequired
  }

  static defaultProps = {
    request: null,
    tryItOutResponse: null,
    produces: fromJS(["application/json"])
  }

  onChangeProducesWrapper = (val) => this.props.specActions.changeProducesValue(this.props.pathMethod, val)

  render() {
    let { responses, request, tryItOutResponse, getComponent, specSelectors, fn, producesValue } = this.props
    let defaultCode = defaultStatusCode(responses)

    const ContentType = getComponent("contentType")
    const Response = getComponent("response")

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : Responses.defaultProps.produces

    return (
      <div className="responses-wrapper row">
        <div className="opblock-section-header">
          <h4>Responses</h4>
          <label>
            <span>Response content type</span>
            <ContentType value={producesValue}
              onChange={this.onChangeProducesWrapper}
              contentTypes={produces}
              className="execute-content-type" />
          </label>
        </div>
        <div className="responses-inner">

          <table className="responses-table">
            <tbody>
              {
                responses.entrySeq().map(([code, response]) => {

                  let className = tryItOutResponse && tryItOutResponse.get("status") == code ? "response_current" : ""
                  return (
                    <Response key={code}
                      isDefault={defaultCode === code}
                      fn={fn}
                      className={className}
                      code={code}
                      response={response}
                      specSelectors={specSelectors}
                      contentType={producesValue}
                      getComponent={getComponent} />
                  )
                }).toArray()
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
