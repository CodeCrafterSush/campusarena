import React, { useState } from 'react'
import '../css/UploadFile.css'

const UploadFile = ({ loggedInUser = "Faculty" }) => {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('DSA')
  const [semester, setSemester] = useState('Sem 1')
  const [file, setFile] = useState(null)

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const subjectsList = ['DSA', 'DBMS', 'Web Dev', 'OS', 'Python', 'Networking', 'Mathematics', 'Other']
  const semestersList = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!file) {
      setStatusMsg({ type: 'error', text: 'Please select a file to upload.' })
      return
    }

    setLoading(true)
    setStatusMsg({ type: '', text: '' })

    // File uploading ke liye FormData object ka use
    const formData = new FormData()
    formData.append('title', title)
    formData.append('subject', subject)
    formData.append('semester', semester)
    formData.append('uploadedBy', loggedInUser)
    formData.append('file', file)

    fetch('http://127.0.0.1:5000/uploadStudyFile', {
      method: 'POST',
      body: formData // Content-Type automatic set ho jayega browser se
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        if (data.status === 'success') {
          setStatusMsg({ type: 'success', text: 'File uploaded and saved successfully!' })
          setTitle('')
          setSubject('DSA')
          setSemester('Sem 1')
          setFile(null)
          // Reset input element value
          document.getElementById('fileInput').value = ''
        } else {
          setStatusMsg({ type: 'error', text: data.message || 'File upload failed.' })
        }
      })
      .catch((err) => {
        console.error('Upload Error:', err)
        setLoading(false)
        setStatusMsg({ type: 'error', text: 'Server error. Please try again.' })
      })
  }

  return (
    <div className="UploadMainCard">
      <div className="UploadHeader">
        <h2>Upload Study Material</h2>
        <p className="UploadSubtext">Upload lecture notes, assignment sheets, or lab manuals for students.</p>
      </div>

      {statusMsg.text && (
        <div className={`UploadStatusMsg ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <form className="UploadFormGrid" onSubmit={handleSubmit}>
        {/* Document Title */}
        <div className="UploadInputGroup UploadFullWidth">
          <label className="UploadLabel">Document Title</label>
          <input
            type="text"
            className="UploadInputField"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Data Structures & Algorithms Notes"
            required
          />
        </div>

        {/* Subject Dropdown */}
        <div className="UploadInputGroup">
          <label className="UploadLabel">Subject</label>
          <select
            className="UploadInputField"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            {subjectsList.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Semester Dropdown */}
        <div className="UploadInputGroup">
          <label className="UploadLabel">Semester</label>
          <select
            className="UploadInputField"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          >
            {semestersList.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        {/* File Input Box */}
        <div className="UploadInputGroup UploadFullWidth">
          <label className="UploadLabel">Select Document File</label>
          <input
            id="fileInput"
            type="file"
            className="UploadInputField UploadFileInput"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.txt"
            required
          />
        </div>

        <button type="submit" className="UploadSubmitBtn UploadFullWidth" disabled={loading}>
          {loading ? 'Uploading File...' : 'Upload & Publish'}
        </button>
      </form>
    </div>
  )
}

export default UploadFile