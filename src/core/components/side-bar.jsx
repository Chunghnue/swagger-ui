import React, { PropTypes } from "react"
import Scroll from "react-scroll"

const Link = Scroll.Link
const scroll = Scroll.scroller

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

  componentDidMount() {
    setTimeout(function() {
      scroll.scrollTo(window.location.hash.substr(1), {
        duration: 500,
        smooth: true
      })
    }, 2000)
  }

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

    // const Operation = getComponent("operation")
    const Collapse = getComponent("Collapse")

    let showSummary = layoutSelectors.showSummary()

    return (
      <div className="row side-bar">
        <h5>API Reference</h5>
        <ul>
          {
            taggedOps.map((tagObj, tag) => {
              let operations = tagObj.get("operations")
              let tagDescription = tagObj.getIn(["tagDetails", "description"], null)

              let isShownKey = ["operations-tag", tag]
              let showTag = layoutSelectors.isShown(isShownKey, true)
              const onSetActive = (hash) => {
                if (hash && location.hash !== '#' + hash) {
                  location.hash = hash
                }
              }
              return (
                <li key={"operation-" + tag}>
                  <a onClick={() => layoutActions.show(isShownKey, !showTag)} className="tag-name">{tag}</a>
                  <Collapse isOpened={showTag}>
                    <ul className="sidebar-tag">
                      {
                        operations.map(op => {
                          let operation = op.toObject().operation
                          let summary = operation.get("summary")
                          let to = op.toObject().id.replace(/[\/\-\{\}]/g, '_')

                          return (
                            <li key={to}><Link href={"#" + to} onSetActive={() => onSetActive(to)} to={to} spy={true} smooth={true} duration={500} >{summary}</Link></li>
                          )
                        })
                      }
                    </ul>
                  </Collapse>
                </li>
              )
            }).toArray()
          }

          {taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null}
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
