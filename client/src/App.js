import React from 'react'
import { useSelector } from 'react-redux'
import { Route, BrowserRouter, Switch, Router, Link } from 'react-router-dom'

import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles'
import history from './history'
import BusRoutesMainTable from './containers/BusRoutes/BusRoutesMainTable'
import PageHeader from './components/PageHeader'
import choloTheme from './choloTheme'
import NotFound from './containers/NotFound'
import GoogleMapPolyline from './containers/BusRoutes/GoogleMapPolyline'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    width: '100%',
  },
  header: {
    height: '64px',
  },
  contentContainer: {
    height: 'calc(100% - 64px)',
  },
}))

const App = () => {
  const globalStore = useSelector(state => state.globalStore)
  const classes = useStyles()
  return (
    <BrowserRouter>
      <Router history={history}>
        <MuiThemeProvider theme={choloTheme}>
          <div>
            <div className={classes.container}>
              <PageHeader
                headerText={
                  globalStore.ifBusStopTableShouldRender
                    ? 'Chalo Bus Stops Repository'
                    : 'Chalo Route Repository'
                }
              />
            </div>
            <div className={classes.contentContainer}>
              <Switch>
                <Route exact path="/" component={BusRoutesMainTable} />
                <Route exact path="/map" component={GoogleMapPolyline} />
                {/* <Route {...rest} render={routeProps => (

                )} exact path="/map" component={GoogleMapPolyline} /> */}
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </MuiThemeProvider>
      </Router>
    </BrowserRouter>
  )
}

export default App
