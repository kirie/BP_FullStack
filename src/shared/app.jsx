// @flow

import React, { Component } from 'react'
import { Switch } from 'react-router'
import { Route, withRouter } from 'react-router-dom'
import Helmet from 'react-helmet'
import ReduxToastr from 'react-redux-toastr'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { APP_NAME } from './config'

import Nav from './components/nav'
import HomePage from './components/pages/home'
import NotFoundPage from './components/pages/not-found'
import Signin from './components/auth/signin'
import Signup from './components/auth/signup'
import PrivateRoute from './private_route'
import SecretPage from './components/pages/secretpage'
import Account from './components/auth/account'
import Reset from './components/auth/reset'
import Forgot from './components/auth/forgot'
import Features from './components/pages/features'
import { HOME_PAGE_ROUTE, FORGOT_PASSWORD, SIGN_IN, SIGN_UP, ACCOUNT_PAGE, FEATURES } from './routes'

class App extends Component {
  static defaultProps: Object

  render() {
    return (
      <div className="app">
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="top-center"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
        />
        <Helmet titleTemplate={`%s | ${APP_NAME}`} defaultTitle={APP_NAME} />
        <Nav isAuthenticated={this.props.isAuthenticated} account={this.props.account} />
        <Switch>
          <Route exact path={HOME_PAGE_ROUTE} render={() => <HomePage />} />
          <Route path={SIGN_IN} render={() => <Signin />} />
          <Route path={FORGOT_PASSWORD} render={() => <Forgot />} />
          <Route path="/reset_password/:id" render={props => <Reset {...props} />} />
          <Route path={SIGN_UP} render={() => <Signup />} />
          <Route path={FEATURES} render={() => <Features />} />
          <PrivateRoute
            path={ACCOUNT_PAGE}
            component={Account}
            isAuthenticated={this.props.isAuthenticated}
            account={this.props.account}
          />
          <PrivateRoute path="/secretpage" component={SecretPage} isAuthenticated={this.props.isAuthenticated} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    )
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool,
  account: PropTypes.shape({
    account: PropTypes.string,
    email: PropTypes.string,
    profile: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string
    })
  })
}

App.defaultProps = {
  isAuthenticated: false,
  account: {
    account: '',
    email: '',
    profile: {
      firstName: '',
      lastName: ''
    }
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.authenticated,
  account: state.auth.account
})

export default withRouter(connect(mapStateToProps)(App))
