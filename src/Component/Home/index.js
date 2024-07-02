import {Component} from 'react'
import {Link} from 'react-router-dom'
import React from 'react'
import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="home-container">
          <h1 className="home-heading">
            Find The Job That <br /> Fits Your Life
          </h1>
          <p className="home-text">
            Millions of people are searching for jobs, salary
            <br /> information, company reviews. Find the job that fits your
            <br /> abilities and Potential.
          </p>
          <Link to="/jobs">
            <button className="findJobs-button">Find Jobs</button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
