import Cookies from 'js-cookie'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {IoMdHome} from 'react-icons/io'
import {BsArrowBarRight, BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <Link to="/">
        <img
          className="website-logo"
          alt="website logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        />
      </Link>
      <ul className="nav-link-container">
        <Link className="nav-link-button" to="/">
          <li>
            <IoMdHome className="small-icon" />
          </li>
          <li className="medium-header-link">Home</li>
        </Link>
        <Link className="nav-link-button" to="/jobs">
          <li>
            <BsFillBriefcaseFill className="small-icon" />
          </li>
          <li className="medium-header-link">Jobs</li>
        </Link>
      </ul>
      <button onClick={onClickLogout} className="logout-button">
        Logout
      </button>
      <BsArrowBarRight onClick={onClickLogout} className="small-icon" />
    </nav>
  )
}

export default withRouter(Header)
