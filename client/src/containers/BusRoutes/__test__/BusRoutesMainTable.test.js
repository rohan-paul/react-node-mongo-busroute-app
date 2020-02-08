/* eslint-disable no-undef */
import React from 'react'
import PropTypes from 'prop-types'
import expect from 'expect'
import { createShallow, createMount } from '@material-ui/core/test-utils'
import { Helmet } from 'react-helmet'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import BusRoutesToolbar from '../../busRoutes/BusRoutesToolbar'
import BusRoutesMainTable from '../BusRoutesMainTable'

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)()

describe('BusRoutesMainTable Component', () => {
  let shallow

  beforeAll(() => {
    shallow = createShallow()
  })

  // Wrapping component to properly mount Redux connected component
  const MyProvider = props => {
    const { children } = props

    return <Provider store={mockStore}>{children}</Provider>
  }

  MyProvider.propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object,
  }

  it('renders', () => {
    const mount = createMount()

    const wrapper = mount(<BusRoutesMainTable store={mockStore} />, {
      wrappingComponent: MyProvider,
    })

    expect(wrapper.find(Helmet)).toHaveLength(1)
  })

  it('renders', () => {
    const mount = createMount()

    const wrapper = mount(<BusRoutesMainTable store={mockStore} />, {
      wrappingComponent: MyProvider,
    })

    expect(wrapper.find(BusRoutesToolbar)).toHaveLength(1)
  })

  it('should render without throwing an error', () => {
    const wrapper = shallow(<BusRoutesMainTable store={mockStore} />).dive()
    expect(wrapper.exists()).toBe(true)
  })

  it('should match Snapshot', () => {
    const wrapper = shallow(<BusRoutesMainTable store={mockStore} />).dive()
    expect(wrapper).toMatchSnapshot()
  })
})
