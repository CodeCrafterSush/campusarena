import React, { useState, useEffect } from 'react'
import '../css/Studylab.css'
import { FileText, Download, User, Calendar, BookOpen, Layers, BookMarked, Trash2 } from 'lucide-react'

const Studylab = ({ typeUser = "" }) => {
  const [studentFiles, setStudentFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSem, setSelectedSem] = useState('All')
  const [selectedSubject, setSelectedSubject] = useState('All')

  const semesters = ['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6']
  const subjects = ['All', 'DSA', 'DBMS', 'Web Dev', 'OS', 'Python']

  // Backend API se JSON load karne ke liye request
  const fetchFiles = () => {
    setLoading(true)
    fetch('http://localhost:5000/getStudyFiles')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setStudentFiles(data.files)
        } else {
          setStudentFiles([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching study materials:", err)
        setStudentFiles([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  // Download Trigger Handler
  const handleDownload = (filename) => {
    if (!filename) {
      alert("File name not found.")
      return
    }
    const downloadUrl = `http://localhost:5000/downloadFile/${encodeURIComponent(filename)}`
    window.open(downloadUrl, '_blank')
  }

  // File Delete Handler (Faculty Only)
  const handleDelete = async (fileId, title) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${title}"?`)
    if (!isConfirmed) return

    try {
      const response = await fetch(`http://localhost:5000/deleteStudyFile/${fileId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (response.ok && data.status === 'success') {
        alert("File deleted successfully")
        setStudentFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId))
      } else {
        alert(data.message || "Failed to delete file")
      }
    } catch (err) {
      console.error("Error deleting file:", err)
      alert("Server connection failed while deleting file")
    }
  }

  // Filter Logic
  const filteredFiles = studentFiles.filter((file) => {
    const matchSem = selectedSem === 'All' || file.semester === selectedSem
    const matchSubject = selectedSubject === 'All' || file.subject === selectedSubject
    return matchSem && matchSubject
  })

  return (
    <div className="StudylabMainContainer">
      {/* Header */}
      <div className="StudylabHeader">
        <div className="StudylabTitleBox">
          <BookOpen size={22} className="StudylabHeaderIcon" />
          <h2>Study Documents</h2>
        </div>
      </div>

      {/* Category Ribbons / Filter Bar */}
      <div className="StudylabFilterRibbonContainer">
        {/* Semester Ribbon */}
        <div className="StudylabRibbonGroup">
          <div className="StudylabRibbonLabel">
            <Layers size={14} />
            <span>Semester:</span>
          </div>
          <div className="StudylabPillList">
            {semesters.map((sem) => (
              <button
                key={sem}
                className={`StudylabPill ${selectedSem === sem ? 'active' : ''}`}
                onClick={() => setSelectedSem(sem)}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Ribbon */}
        <div className="StudylabRibbonGroup">
          <div className="StudylabRibbonLabel">
            <BookMarked size={14} />
            <span>Subject:</span>
          </div>
          <div className="StudylabPillList">
            {subjects.map((sub) => (
              <button
                key={sub}
                className={`StudylabPill ${selectedSubject === sub ? 'active' : ''}`}
                onClick={() => setSelectedSubject(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable File Cards Area */}
      <div className="StudylabScrollArea">
        {loading ? (
          <div className="StudylabEmptyState">
            <p>Loading study materials...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="StudylabEmptyState">
            <p>No study materials found for the selected filters.</p>
          </div>
        ) : (
          <div className="StudylabGrid">
            {filteredFiles.map((file) => (
              <div key={file.id} className="StudylabFileCard">
                <div className="StudylabFileCardTop">
                  <div className="StudylabFileIconBox">
                    <FileText size={20} />
                  </div>
                  <div className="StudylabFileInfo">
                    <h4 className="StudylabFileTitle">{file.title}</h4>
                    <div className="StudylabBadges">
                      <span className="StudylabSubjectBadge">{file.subject}</span>
                      <span className="StudylabSemBadge">{file.semester}</span>
                    </div>
                  </div>
                </div>

                <div className="StudylabMetaDetails">
                  <div className="StudylabMetaItem">
                    <User size={13} />
                    <span>{file.uploadedBy}</span>
                  </div>
                  <div className="StudylabMetaItem">
                    <Calendar size={13} />
                    <span>{file.date}</span>
                  </div>
                </div>

                <div className="StudylabCardFooter">
                  <span className="StudylabFileSize">{file.size} • {file.format}</span>
                  
                  <div className="StudylabActionBtns">
                    <button 
                      className="StudylabDownloadBtn" 
                      onClick={() => handleDownload(file.fileName || file.filename || file.title)}
                      title="Download File"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>

                    {/* Faculty Only Delete Button */}
                    {typeUser === 'faculty' && (
                      <button 
                        className="StudylabDeleteBtn" 
                        onClick={() => handleDelete(file.id, file.title)}
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Studylab