import React from 'react'
import '../css/Account.css'

const Account = ({ userData, username }) => {
  // Agar backend se data fetch hone me time lag raha ho
  if (!userData) {
    return (
      <div className="AccountMainCard">
        <div className="AccountHeader">
          <h2>Loading user profile...</h2>
        </div>
      </div>
    )
  }

  // Safe fallback values agar kisi key ki value missing ho
  const {
    name = "N/A",
    mobile = "N/A",
    email = "N/A",
    branch = "N/A",
    classSemester = "N/A",
    rollNo = "N/A"
  } = userData

  // Initials generate karne ke liye helper
  const initials = name !== "N/A" 
    ? name.split(' ').map(n => n[0]).join('') 
    : username ? username[0].toUpperCase() : 'U'

  return (
    <div className="AccountMainCard">
      <div className="AccountHeader">
        <div className="AccountAvatar">
          {initials}
        </div>
        <div className="AccountHeaderDetails">
          <h2>{name}</h2>
          <p className="AccountSubtext">{branch}</p>
        </div>
      </div>

      <div className="AccountFormGrid">
        <div className="AccountInputGroup">
          <label className="AccountLabel">Full Name</label>
          <div className="AccountInputField">{name}</div>
        </div>

        <div className="AccountInputGroup">
          <label className="AccountLabel">Mobile Number</label>
          <div className="AccountInputField">{mobile}</div>
        </div>

        <div className="AccountInputGroup AccountFullWidth">
          <label className="AccountLabel">Email Address</label>
          <div className="AccountInputField">{email}</div>
        </div>

        <div className="AccountInputGroup">
          <label className="AccountLabel">Branch</label>
          <div className="AccountInputField">{branch}</div>
        </div>

        <div className="AccountInputGroup">
          <label className="AccountLabel">Class / Semester</label>
          <div className="AccountInputField">{classSemester}</div>
        </div>

        <div className="AccountInputGroup AccountFullWidth">
          <label className="AccountLabel">Roll Number</label>
          <div className="AccountInputField">{rollNo}</div>
        </div>
      </div>
    </div>
  )
}

export default Account