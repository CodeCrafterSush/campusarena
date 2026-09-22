import React, { useState } from 'react'
import '../css/CreateNotification.css'

const CreateNotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Notice',
    semester: 'All Semesters',
    venue: '',
    description: ''
  })

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setStatusMsg({ type: '', text: '' })

    // Automatic Date aur Time generate karna
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) // Output format: "18 Sep 2026"

    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) // Output format: "05:00 PM"

    const payload = {
      ...formData,
      isNew: true,
      date: formattedDate,
      time: formattedTime
    }

    fetch('http://127.0.0.1:5000/addNotification', {
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
          setStatusMsg({ type: 'success', text: 'Notification published successfully!' })
          setFormData({
            title: '',
            category: 'Notice',
            semester: 'All Semesters',
            venue: '',
            description: ''
          })
        } else {
          setStatusMsg({ type: 'error', text: data.message || 'Failed to publish notification.' })
        }
      })
      .catch((err) => {
        console.error('Notification Error:', err)
        setLoading(false)
        setStatusMsg({ type: 'error', text: 'Server error. Please try again.' })
      })
  }

  return (
    <div className="NotiMainCard">
      <div className="NotiHeader">
        <h2>Create Notification</h2>
        <p className="NotiSubtext">Broadcast notices, events, and important updates to students.</p>
      </div>

      {statusMsg.text && (
        <div className={`NotiStatusMsg ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <form className="NotiFormGrid" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="NotiInputGroup NotiFullWidth">
          <label className="NotiLabel">Title</label>
          <input
            type="text"
            name="title"
            className="NotiInputField"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Library Books Return Reminder"
            required
          />
        </div>

        {/* Category */}
        <div className="NotiInputGroup">
          <label className="NotiLabel">Category</label>
          <select
            name="category"
            className="NotiInputField"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Notice">Notice</option>
            <option value="Event">Event</option>
            <option value="Exam">Exam</option>
            <option value="Urgent">Urgent</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Target Semester */}
        <div className="NotiInputGroup">
          <label className="NotiLabel">Semester Target</label>
          <select
            name="semester"
            className="NotiInputField"
            value={formData.semester}
            onChange={handleChange}
            required
          >
            <option value="All Semesters">All Semesters</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester</option>
            <option value="4th Semester">4th Semester</option>
            <option value="5th Semester">5th Semester</option>
            <option value="6th Semester">6th Semester</option>
            <option value="7th Semester">7th Semester</option>
            <option value="8th Semester">8th Semester</option>
          </select>
        </div>

        {/* Venue */}
        <div className="NotiInputGroup NotiFullWidth">
          <label className="NotiLabel">Venue / Location</label>
          <input
            type="text"
            name="venue"
            className="NotiInputField"
            value={formData.venue}
            onChange={handleChange}
            placeholder="e.g. Central Library, Auditorium, Online"
            required
          />
        </div>

        {/* Description */}
        <div className="NotiInputGroup NotiFullWidth">
          <label className="NotiLabel">Description</label>
          <textarea
            name="description"
            className="NotiInputField NotiTextArea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write full notice details here..."
            rows="4"
            required
          ></textarea>
        </div>

        <button type="submit" className="NotiSubmitBtn NotiFullWidth" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Notification'}
        </button>
      </form>
    </div>
  )
}

export default CreateNotification