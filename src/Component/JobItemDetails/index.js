import {FaStar} from 'react-icons/fa'
import React from 'react'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobItemDetails = props => {
  const {detail} = props
  const {
    rating,
    companyLogoUrl,
    title,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    id,
  } = detail
  return (
    <Link to={`/jobs/${id}`} className="detail-card-container">
      <div>
        <div className="card-top-logo-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
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
          <h3 className="description-heading">Description</h3>
          <p>{jobDescription}</p>
        </div>
      </div>
    </Link>
  )
}

export default JobItemDetails
