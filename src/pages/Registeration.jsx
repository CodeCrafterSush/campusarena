import React, { useState } from 'react'
import '../css/Registration.css'

const Registration = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    lastName: '',
    mobile: '',
    email: '', // Optional
    rollNo: '',
    branch: 'BCA',
    classSemester: '1st Semester',
    username: '',
    password: ''
  })

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  // Max semesters based on branch selection
  const getMaxSemesters = (branch) => {
    return branch === 'BTECH (Cosmetic)' ? 8 : 6
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'branch') {
      const maxSem = getMaxSemesters(value)
      // Reset semester to 1st Semester if current selection exceeds maximum allowed
      const currentSemNum = parseInt(formData.classSemester)
      const newSemester = currentSemNum > maxSem ? '1st Semester' : formData.classSemester

      setFormData({
        ...formData,
        branch: value,
        classSemester: newSemester
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setStatusMsg({ type: '', text: '' })

    const payload = {
      name: `${formData.studentName} ${formData.fatherName} ${formData.lastName}`.trim(),
      studentName: formData.studentName,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      lastName: formData.lastName,
      mobile: formData.mobile,
      email: formData.email || 'N/A',
      rollNo: formData.rollNo,
      branch: formData.branch,
      classSemester: formData.classSemester,
      username: formData.username,
      password: formData.password
    }

    fetch('http://127.0.0.1:5000/registerStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        if (data.status === 'success') {
          setStatusMsg({ type: 'success', text: 'Student registered successfully!' })
          setFormData({
            studentName: '',
            fatherName: '',
            motherName: '',
            lastName: '',
            mobile: '',
            email: '',
            rollNo: '',
            branch: 'BCA',
            classSemester: '1st Semester',
            username: '',
            password: ''
          })
        } else {
          setStatusMsg({ type: 'error', text: data.message || 'Registration failed.' })
        }
      })
      .catch((err) => {
        console.error('Registration Error:', err)
        setLoading(false)
        setStatusMsg({ type: 'error', text: 'Server error. Please try again.' })
      })
  }

  const maxSemesters = getMaxSemesters(formData.branch)

  return (
    <div className="RegMainCard">
      <div className="RegHeader">
        <h2>Register New Student</h2>
        <p className="RegSubtext">Enter student credentials to add them into the system.</p>
      </div>

      {statusMsg.text && (
        <div className={`RegStatusMsg ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <form className="RegFormGrid" onSubmit={handleSubmit}>
        {/* Student First Name */}
        <div className="RegInputGroup">
          <label className="RegLabel">Student Name</label>
          <input
            type="text"
            name="studentName"
            className="RegInputField"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>

        {/* Father Name */}
        <div className="RegInputGroup">
          <label className="RegLabel">Father Name</label>
          <input
            type="text"
            name="fatherName"
            className="RegInputField"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Father's Name"
            required
          />
        </div>

        {/* Mother Name */}
        <div className="RegInputGroup">
          <label className="RegLabel">Mother Name</label>
          <input
            type="text"
            name="motherName"
            className="RegInputField"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Mother's Name"
            required
          />
        </div>

        {/* Last Name */}
        <div className="RegInputGroup">
          <label className="RegLabel">Last Name / Surname</label>
          <input
            type="text"
            name="lastName"
            className="RegInputField"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>

        {/* Mobile Number */}
        <div className="RegInputGroup">
          <label className="RegLabel">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            className="RegInputField"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            required
          />
        </div>

        {/* Email Address (Optional) */}
        <div className="RegInputGroup">
          <label className="RegLabel">Email Address (Optional)</label>
          <input
            type="email"
            name="email"
            className="RegInputField"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. student@example.com"
          />
        </div>

        {/* Branch Dropdown */}
        <div className="RegInputGroup">
          <label className="RegLabel">Branch / Course</label>
          <select
            name="branch"
            className="RegInputField"
            value={formData.branch}
            onChange={handleChange}
            required
          >
            <option value="BCA">BCA</option>
            <option value="BBA">BBA</option>
            <option value="BSC INFORMATION TECHNOLOGY">BSC INFORMATION TECHNOLOGY</option>
            <option value="BTECH (Cosmetic)">BTECH (Cosmetic)</option>
          </select>
        </div>

        {/* Semester Dropdown */}
        <div className="RegInputGroup">
          <label className="RegLabel">Semester</label>
          <select
            name="classSemester"
            className="RegInputField"
            value={formData.classSemester}
            onChange={handleChange}
            required
          >
            {Array.from({ length: maxSemesters }, (_, i) => {
              const semNum = i + 1
              const suffix = semNum === 1 ? 'st' : semNum === 2 ? 'nd' : semNum === 3 ? 'rd' : 'th'
              const label = `${semNum}${suffix} Semester`
              return (
                <option key={semNum} value={label}>
                  {label}
                </option>
              )
            })}
          </select>
        </div>

        {/* Roll Number */}
        <div className="RegInputGroup RegFullWidth">
          <label className="RegLabel">Roll Number</label>
          <input
            type="text"
            name="rollNo"
            className="RegInputField"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="e.g. CS2026-011"
            required
          />
        </div>

        {/* Username */}
        <div className="RegInputGroup">
          <label className="RegLabel">Username</label>
          <input
            type="text"
            name="username"
            className="RegInputField"
            value={formData.username}
            onChange={handleChange}
            placeholder="e.g. akash"
            required
          />
        </div>

        {/* Password */}
        <div className="RegInputGroup">
          <label className="RegLabel">Password</label>
          <input
            type="password"
            name="password"
            className="RegInputField"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" className="RegSubmitBtn RegFullWidth" disabled={loading}>
          {loading ? 'Registering...' : 'Register Student'}
        </button>
      </form>
    </div>
  )
}

export default Registration