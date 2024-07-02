import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import React from 'react'
import JobItemDetails from '../JobItemDetails'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatesConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    salaryRange: '',
    employmentTypes: [],
    searchInput: '',
    apiStatus: apiStatesConstant.initial,
    profileApiStatus: apiStatesConstant.initial,
  }

  componentDidMount() {
    this.getProfileApi()
    this.getJobsApi()
  }

  formatProfileData = data => {
    const {name, profile_image_url, short_bio} = data
    return {
      name,
      profileImageUrl: profile_image_url,
      short_bio,
    }
  }

  formateJobsList = data =>
    data.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      packagePerAnnum: each.package_per_annum,
      rating: each.rating,
      title: each.title,
    }))

  renderJobItemsDetails = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            className="no-jobs-image"
            alt="no jobs"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return jobsList.map(each => <JobItemDetails key={each.id} detail={each} />)
  }

  renderJobFailure = () => (
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
  renderLoader = () => {
    return (
      <div>
        <h1>please Wait</h1>
      </div>
    )
  }
  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, short_bio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} className="profile-image" alt="profile" />
        <p className="name">{name}</p>
        <p className="short-bio">{short_bio}</p>
      </div>
    )
  }

  getProfileApi = async () => {
    this.setState({profileApiStatus: apiStatesConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const profileDetails = this.formatProfileData(data.profile_details)
      this.setState({
        profileDetails,
        profileApiStatus: apiStatesConstant.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatesConstant.failure})
    }
  }

  getFilteredUrl = () => {
    const {employmentTypes, salaryRange, searchInput} = this.state
    let url = 'https://apis.ccbp.in/jobs?'
    if (salaryRange !== '') {
      url += `minimum_package=${salaryRange}`
    }
    if (searchInput !== '') {
      url += `&search=${searchInput}`
    }
    if (employmentTypes.length !== 0) {
      const typeString = employmentTypes.toString()
      url += `&employment_type=${typeString}`
    }
    return url
  }

  getJobsApi = async () => {
    this.setState({apiStatus: apiStatesConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = this.getFilteredUrl()
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        apiStatus: apiStatesConstant.success,
        jobsList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatesConstant.failure})
    }
  }

  onClickJobsRetry = () => {
    this.getJobsApi()
  }

  onClickProfileRetry = () => {
    this.getProfileApi()
  }

  onClickSalaryRange = salaryRange => {
    this.setState({salaryRange}, this.getJobsApi)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchIcon = () => {
    this.getJobsApi()
  }

  onSelectEmploymentType = employmentType => {
    let {employmentTypes} = this.state
    if (employmentTypes.includes(employmentType)) {
      employmentTypes = employmentTypes.filter(each => each !== employmentType)
    } else {
      employmentTypes.push(employmentType)
    }
    this.setState({employmentTypes}, this.getJobsApi)
  }

  renderAllJobItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatesConstant.failure:
        return this.renderJobFailure()
      case apiStatesConstant.inProgress:
        return this.renderLoader()
      case apiStatesConstant.success:
        return this.renderJobItemsDetails()
      default:
        return null
    }
  }

  renderFailureProfile = () => (
    <div className="failure-profile">
      <button className="retry">retry</button>
    </div>
  )

  renderAllProfileDetails = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatesConstant.failure:
        return this.renderFailureProfile()
      case apiStatesConstant.inProgress:
        return this.renderLoader()
      case apiStatesConstant.success:
        return this.renderProfileDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-page-container">
          <div className="input-holder-small">
            <input
              onChange={this.onChangeSearchInput}
              placeholder="Search"
              className="input-text"
              type="search"
            />
            <button
              className="search-button"
              onClick={this.onClickSearchIcon}
              type="button"
              data-testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="filters-container">
            {this.renderAllProfileDetails()}
            <div className="filter">
              <h3 className="filter-heading">Type of Employment</h3>
              <ul className="option-container">
                {employmentTypesList.map(each => {
                  const onClickEmploymentType = () => {
                    this.onSelectEmploymentType(each.employmentTypeId)
                  }
                  return (
                    <li className="filter-item" key={each.employmentTypeId}>
                      <input
                        onClick={onClickEmploymentType}
                        id={each.employmentTypeId}
                        type="checkbox"
                      />
                      <label htmlFor={each.employmentTypeId}>
                        {each.employmentTypeId}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="filter">
              <h4 className="filter-heading">Salary Range</h4>
              <ul className="option-container">
                {salaryRangesList.map(each => {
                  const clickSalary = () => {
                    this.onClickSalaryRange(each.salaryRangeId)
                  }
                  return (
                    <li className="filter-item" key={each.salaryRangeId}>
                      <input
                        id={each.salaryRangeId}
                        name="salary"
                        type="radio"
                        onClick={clickSalary}
                      />
                      <label htmlFor={each.salaryRangeId}>{each.label}</label>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="filter-container">
              <h4 className="filter-heading"> Salary Range</h4>
            </div>
          </div>
          <div className="jobs-list-container">
            <div className="input-holder">
              <input
                onChange={this.onChangeSearchInput}
                placeholder="Search"
                type="search"
                className="input-text"
              />
              <button
                className="search-button"
                onClick={this.onClickSearchIcon}
                type="button"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <ul className="job-detail-container">{this.renderAllJobItems()}</ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
