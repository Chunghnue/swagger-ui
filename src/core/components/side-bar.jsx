import React, { PropTypes } from "react"
import Scroll from "react-scroll"

const Link = Scroll.Link

export default class SideBar extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
  };

  static defaultProps = {

  };

  render() {
    let {
      specSelectors,
      specActions,
      getComponent,
      layoutSelectors,
      layoutActions,
      authActions,
      authSelectors,
      fn
    } = this.props

    let taggedOps = specSelectors.taggedOperations()

    const Operation = getComponent("operation")
    const Collapse = getComponent("Collapse")

    let showSummary = layoutSelectors.showSummary()

    return (
      <div>
        <ul className="side-bar">
          {
            taggedOps.map( (tagObj, tag) => {
              let operations = tagObj.get("operations")
              let tagDescription = tagObj.getIn(["tagDetails", "description"], null)

              let isShownKey = ["operations-tag", tag]
              let showTag = layoutSelectors.isShown(isShownKey, true)
              
              return (
                <li>{tagDescription}
                  <ul>
                    {
                      operations.map(op => {
                        let operation = op.toObject().operation
                        let summary = operation.get("summary")
                        return (
                          <li><Link href={"#"+op.toObject().id} to={op.toObject().id} spy={true} smooth={true} duration={500} >{ summary }</Link></li>
                        )
                      })
                    }
                  </ul>
                </li>
                )
            }).toArray()
          }

          { taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null }
        </ul>
      </div>
    )
  }

}

SideBar.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
