import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import React from 'react';
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMessage: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccessfulSubmit = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onUnsuccessfulSubmit = errorMsg => {
    this.setState({showErrorMessage: true, errorMsg})
  }

  onSubmitForm = async event => {
    const {username, password} = this.state
    const userDetails = {username, password}
    event.preventDefault()
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.onSuccessfulSubmit(data.jwt_token)
    } else {
      this.onUnsuccessfulSubmit(data.error_msg)
    }
    this.setState({username: '', password: ''})
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, showErrorMessage, errorMsg} = this.state
    return (
      <div className="login-page-container">
        <form onSubmit={this.onSubmitForm} className="login-form-container">
          <img
            className="website-login-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <div className="input-container">
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              onChange={this.onChangeUsername}
              value={username}
              placeholder="Enter: rahul"
              className="input"
              id="username"
              type="text"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              onChange={this.onChangePassword}
              value={password}
              placeholder="Enter: rahul@2021"
              className="input"
              id="password"
              type="password"
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
          {showErrorMessage && <p className="errorMsg">{`*${errorMsg}`}</p>}
        </form>
      </div>
    )
  }
}

export default Login
