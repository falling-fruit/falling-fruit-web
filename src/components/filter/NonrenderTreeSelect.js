/* eslint-disable react/destructuring-assignment */
import equals from 'ramda/src/equals'
import { Component } from 'react'
import DropdownTreeSelect from 'react-dropdown-tree-select'

// Long story. See https://dowjones.github.io/react-dropdown-tree-select/#/story/prevent-re-render-on-parent-render-hoc

export default class NonrenderTreeSelect extends Component {
  constructor(props) {
    super(props)
    this.state = { data: props.data }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (!equals(nextProps.data, prevState.data)) {
      return { data: nextProps.data }
    } else {
      return {}
    }
  }

  shouldComponentUpdate = (nextProps) =>
    !equals(nextProps.data, this.state.data)

  render() {
    const { data: _data, ...rest } = this.props
    return <DropdownTreeSelect data={this.state.data} {...rest} />
  }
}
