import React, { useState, useEffect } from 'react'
import '../css/Account.css'

const AccountFaculty = ({ username }) => {
  const [facultyData, setFacultyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Session Storage ya props se username extract karein
    const targetUsername = username || sessionStorage.getItem('saved_user')

    if (!targetUsername) {
      setError('No faculty username provided')
      setLoading(false)
      return
    }

    fetch(`http://127.0.0.1:5000/getFaculty?username=${targetUsername}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch faculty details')
        }
        return res.json()
      })
      .then((data) => {
        if (data.status === 'success') {
          setFacultyData(data.user)
        } else {
          setError(data.message || 'Faculty data not found')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching faculty data:', err)
        setError('Server error while loading profile')
        setLoading(false)
      })
  }, [username])

  if (loading) {
    return (
      <div className="AccountMainCard">
        <p className="AccountSubtext" style={{ textAlign: 'center' }}>Loading profile...</p>
      </div>
    )
  }

  if (error || !facultyData) {
    return (
      <div className="AccountMainCard">
        <p style={{ color: '#ef4444', textAlign: 'center' }}>{error || 'Unable to load profile'}</p>
      </div>
    )
  }

  // Get Avatar Initials
  const initials = facultyData.name
    ? facultyData.name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').split(' ').map(n => n[0]).join('')
    : 'FC'

  return (
    <div className="AccountMainCard">
      {/* Header Profile Section */}
      <div className="AccountHeader">
        <div className="AccountAvatar">
          {initials}
        </div>
        <div className="AccountHeaderDetails">
          <h2>{facultyData.name}</h2>
          <p className="AccountSubtext">{facultyData.designation || 'Faculty Member'}</p>
        </div>
      </div>

      {/* Form Fields Grid (Same CSS structure as Student Account) */}
      <div className="AccountFormGrid">
        <div className="AccountInputGroup">
          <label className="AccountLabel">Full Name</label>
          <div className="AccountInputField">{facultyData.name}</div>
        </div>

        <div className="AccountInputGroup">
          <label className="AccountLabel">Mobile Number</label>
          <div className="AccountInputField">{facultyData.mobile}</div>
        </div>

        <div className="AccountInputGroup AccountFullWidth">
          <label className="AccountLabel">Email Address</label>
          <div className="AccountInputField">{facultyData.email}</div>
        </div>

        <div className="AccountInputGroup">
          <label className="AccountLabel">Branch / Department</label>
          <div className="AccountInputField">{facultyData.branch}</div>
        </div>

        <div className="AccountInputGroup">
          <label className="AccountLabel">Designation</label>
          <div className="AccountInputField">{facultyData.designation}</div>
        </div>

        <div className="AccountInputGroup AccountFullWidth">
          <label className="AccountLabel">Employee ID</label>
          <div className="AccountInputField">{facultyData.employeeId}</div>
        </div>
      </div>
    </div>
  )
}

export default AccountFaculty