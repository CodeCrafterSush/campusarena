import React, { useState, useEffect } from 'react'
import '../css/StudentProgress.css'

const StudentProgress = () => {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/getStudentProgress')
      const result = await res.json()
      if (result.status === 'success') {
        setStudents(result.data)
        if (result.data.length > 0) setSelectedStudent(result.data[0])
      }
    } catch (err) {
      console.error('Fetch Error:', err)
    }
  }

  const handleInputChange = (field, val) => {
    setSelectedStudent(prev => ({ ...prev, [field]: val }))
  }

  const handleSemChange = (semKey, field, val) => {
    setSelectedStudent(prev => ({
      ...prev,
      semesters: {
        ...prev.semesters,
        [semKey]: {
          ...prev.semesters[semKey],
          [field]: parseFloat(val) || 0
        }
      }
    }))
  }

  const handleSave = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/updateStudentProgress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStudent)
      })
      const result = await res.json()
      if (result.status === 'success') {
        setMessage('Progress record updated successfully!')
        fetchStudents()
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error('Save Error:', err)
    }
  }

  const filteredStudents = students.filter(
    s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.includes(searchTerm)
  )

  return (
    <div className="StudentProgressContainer">
      {/* Scrollable Left Navigation List */}
      <div className="StudentProgressSidebar">
        <h3 className="StudentSidebarTitle">Students ({filteredStudents.length})</h3>
        <input
          type="text"
          placeholder="Search Name / Roll..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="StudentSearchInput"
        />
        <div className="StudentListScrollable">
          {filteredStudents.map(s => (
            <div
              key={s.rollNo}
              className={`StudentCardItem ${selectedStudent?.rollNo === s.rollNo ? 'StudentActiveCard' : ''}`}
              onClick={() => setSelectedStudent(s)}
            >
              <p className="StudentName">{s.name}</p>
              <p className="StudentMeta">Roll: {s.rollNo} | Score: {s.overallScore || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Content Area */}
      <div className="StudentProgressDetails">
        {selectedStudent ? (
          <div className="StudentEditCard">
            <h2 className="StudentHeaderTitle">Student Details: {selectedStudent.name}</h2>
            {message && <div className="StudentSuccessBadge">{message}</div>}

            <div className="StudentFormGrid">
              <div className="StudentInputGroup">
                <label className="StudentLabel">Roll Number</label>
                <input type="text" value={selectedStudent.rollNo} disabled className="StudentInput StudentDisabledInput" />
              </div>
              <div className="StudentInputGroup">
                <label className="StudentLabel">Branch</label>
                <input
                  type="text"
                  value={selectedStudent.branch || ''}
                  onChange={e => handleInputChange('branch', e.target.value)}
                  className="StudentInput"
                />
              </div>
              <div className="StudentInputGroup">
                <label className="StudentLabel">Attendance (%)</label>
                <input
                  type="number"
                  value={selectedStudent.attendance ?? 0}
                  onChange={e => handleInputChange('attendance', parseFloat(e.target.value) || 0)}
                  className="StudentInput"
                />
              </div>
              <div className="StudentInputGroup">
                <label className="StudentLabel">Assignments Done</label>
                <input
                  type="number"
                  value={selectedStudent.assignmentsCompleted ?? 0}
                  onChange={e => handleInputChange('assignmentsCompleted', parseInt(e.target.value) || 0)}
                  className="StudentInput"
                />
              </div>
            </div>

            <h3 className="StudentSubSectionTitle">Semester Marks & Performance</h3>
            <div className="StudentSemGrid">
              {['sem1', 'sem2', 'sem3'].map(sem => (
                <div key={sem} className="StudentSemCard">
                  <h4 className="StudentSemTitle">{sem.toUpperCase()}</h4>
                  <div className="StudentSemInputBlock">
                    <label className="StudentLabel">SGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedStudent.semesters?.[sem]?.sgpa ?? 0}
                      onChange={e => handleSemChange(sem, 'sgpa', e.target.value)}
                      className="StudentInput"
                    />
                  </div>
                  <div className="StudentSemInputBlock">
                    <label className="StudentLabel">Backlogs</label>
                    <input
                      type="number"
                      value={selectedStudent.semesters?.[sem]?.backlogs ?? 0}
                      onChange={e => handleSemChange(sem, 'backlogs', e.target.value)}
                      className="StudentInput"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="StudentSaveBtn" onClick={handleSave}>
              Save & Recalculate Rank
            </button>
          </div>
        ) : (
          <p className="StudentNoSelectionText">Select a student from the sidebar list.</p>
        )}
      </div>
    </div>
  )
}

export default StudentProgress