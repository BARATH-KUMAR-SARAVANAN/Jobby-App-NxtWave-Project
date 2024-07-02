import {Component} from 'react'
import React from 'react'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiOutlineExternalLink} from 'react-icons/hi'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatesConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobDescription extends Component {
  state = {
    similiarJobs: [],
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    apiStatus: apiStatesConstant.initial,
  }

  componentDidMount() {
    this.getJobDescriptionData()
  }

  getJobDescriptionData = async () => {
    this.setState({apiStatus: apiStatesConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()
    if (response.ok) {
      const {job_details} = data
      const lifeAtCompany = data.job_details.life_at_company
      const skills = data.job_details.skills.map(each => each)
      const jobDetails = {
        companyLogoUrl: job_details.company_logo_url,
        companyWebsiteUrl: job_details.company_website_url,
        employmentType: job_details.employment_type,
        id: job_details.id,
        jobDescription: job_details.job_description,
        lifeAtCompany: job_details.life_at_company,
        location: job_details.location,
        rating: job_details.rating,
        packagePerAnnum: job_details.package_per_annum,
        title: job_details.title,
      }
      const similiarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const apiStatus = apiStatesConstant.success
      this.setState({
        jobDetails,
        similiarJobs,
        skills,
        lifeAtCompany,
        apiStatus,
      })
    } else {
      this.setState({apiStatus: apiStatesConstant.failure})
    }
  }

  renderAllJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatesConstant.success:
        return this.renderJobDetails()
      case apiStatesConstant.inProgress:
        return this.renderLoader()
      case apiStatesConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderJobDetails = () => {
    const {jobDetails, similiarJobs, skills, lifeAtCompany} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
    } = jobDetails

    return (
      <div className="job-details-background">
        <div className="description-detail-card-container">
          <div className="description-card-top-logo-container">
            <img
              className="description-company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="card-tilte-container">
              <h3 className="title">{title} </h3>
              <div className="rating-container">
                <FaStar className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-type-location-container">
            <div className="location-type">
              <div className="location-container">
                <MdLocationOn className="icon" />
                <p>{location}</p>
              </div>
              <div className="internship-container">
                <BsFillBriefcaseFill className="icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p className="lpa">{packagePerAnnum}</p>
          </div>
          <div className="description-container">
            <div className="description-hearder">
              <h3 className="description-heading">Description</h3>
              <a className="company-url" href={companyWebsiteUrl}>
                {' '}
                Visit <HiOutlineExternalLink />
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-container">
            {skills.map(each => (
              <li key={each.name} className="skills-item">
                <img alt="skill img" className="skills-image" src={each.image_url} />
                <p className="skills-name">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="skills-heading">Life at Company</h1>
          <div className="lifeAtCompany-container">
            <p className="lifeAtCompany-description">
              {lifeAtCompany.description}
            </p>
            <img
              className="lifeAtCompany-image"
              src={lifeAtCompany.image_url}
              alt="life at company"
            />
          </div>
        </div>
        <h1>similiar Jobs</h1>
        <ul className="similiarJobs-container">
          {similiarJobs.map(each => (
            <li key={each.id} className="similiarJobs-item">
              <div className="card-top-logo-container">
                <img
                  className="company-logo"
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                />
                <div className="card-tilte-container">
                  <h3 className="title">{each.title} </h3>
                  <div className="rating-container">
                    <FaStar className="star-icon" />
                    <p>{each.rating}</p>
                  </div>
                </div>
              </div>
              <h3>Description</h3>
              <p>{each.jobDescription}</p>
              <div className="similar-location-type">
                <div className="location-container">
                  <MdLocationOn className="icon" />
                  <p>{location}</p>
                </div>
                <div className="internship-container">
                  <BsFillBriefcaseFill className="icon" />
                  <p>{employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader" data-testid="loader">
      <h1>
        loading wait
      </h1>
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button onClick={this.onClickJobsRetry} className="retry">
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <div>
        <Header />
        {this.renderAllJobDetails()}
      </div>
    )
  }
}

export default JobDescription
