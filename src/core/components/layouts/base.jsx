import React, { PropTypes } from "react"
import { StickyContainer, Sticky } from 'react-sticky'

export default class BaseLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let { specSelectors, specActions, getComponent, authSelectors } = this.props

    let info = specSelectors.info()
    let url = specSelectors.url()
    let basePath = specSelectors.basePath()
    let host = specSelectors.host()
    let externalDocs = specSelectors.externalDocs()
    let schemes = specSelectors.schemes()

    let Info = getComponent("info")
    let Operations = getComponent("operations", true)
    let Sidebar = getComponent("sidebar", true)
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Errors = getComponent("errors", true)
    const OnlineValidatorBadge = getComponent("onlineValidatorBadge", true)
    const Schemes = getComponent("schemes")

    const isSpecEmpty = !specSelectors.specStr()
    const AuthorizationPopup = getComponent("authorizationPopup", true)
    let showPopup = !!authSelectors.shownDefinitions()
    if (isSpecEmpty) {
      return <h4>No spec provided.</h4>
    }

    return (

      <StickyContainer className='swagger-ui'>
        <div>
          <Errors />
          <div className="information-container">
            <Col mobile={12}>
              {info.count() ? (
                <Info info={info} url={url} host={host} basePath={basePath} externalDocs={externalDocs} getComponent={getComponent} />
              ) : null}
            </Col>
          </div>
          {schemes && schemes.size ? (
            <div className="scheme-container">
              <Col className="schemes wrapper" mobile={12}>
                {schemes && schemes.size ? (
                  <Schemes schemes={schemes} specActions={specActions} />
                ) : null}
                <OnlineValidatorBadge />
              </Col>
            </div>
          ) : null}
          { showPopup && <AuthorizationPopup /> }

          <Row>
            <Col mobile={12} desktop={3} >
              <Sticky>
                <Sidebar />
              </Sticky>
            </Col>
            <Col mobile={12} desktop={9} >
              <Operations />
            </Col>
          </Row>
        </div>
      </StickyContainer>
    )
  }
}
