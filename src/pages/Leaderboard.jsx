import React, { useState, useEffect } from 'react'
import '../css/Leaderboard.css'

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/getLeaderboard')
      const result = await res.json()
      if (result.status === 'success') {
        const sorted = [...result.data].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
        setLeaderboardData(sorted)
      }
    } catch (err) {
      console.error('Leaderboard Fetch Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredData = leaderboardData.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.rollNo.includes(searchTerm)
  )

  return (
    <div className="LeaderboardMainContainer">
      {/* Top Header & Search Area */}
      <div className="LeaderboardHeaderArea">
        <div>
          <h2 className="LeaderboardTitle">Academic Leaderboard</h2>
          <p className="LeaderboardSubHeading">
            Total Students: {filteredData.length}
          </p>
        </div>
        <input
          type="text"
          placeholder="Search Name or Roll..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="LeaderboardSearchInput"
        />
      </div>

      {loading ? (
        <div className="LeaderboardLoadingState">Loading student records...</div>
      ) : (
        /* 2-Column Scrollable Grid Area */
        <div className="LeaderboardGridScrollArea">
          {filteredData.map((item, index) => {
            const rank = index + 1
            return (
              <div
                key={item.rollNo}
                className={`LeaderboardGridCard ${rank <= 3 ? `LeaderboardRankBorder-${rank}` : ''}`}
              >
                {/* Header: Rank + Score */}
                <div className="LeaderboardCardHeader">
                  <div className={`LeaderboardBadge ${rank <= 3 ? `RankBadge-${rank}` : ''}`}>
                    {rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : `#${rank}`}
                  </div>
                  <div className="LeaderboardScoreTag">
                    <span>Score</span>
                    <strong>{item.overallScore ?? 'N/A'}</strong>
                  </div>
                </div>

                {/* Body: Name & Basic Meta */}
                <div className="LeaderboardCardBody">
                  <h3 className="LeaderboardStudentName">{item.name}</h3>
                  <p className="LeaderboardMetaText">
                    Roll: <strong>{item.rollNo}</strong> | {item.branch || 'BCA'} (Sem {item.semester || 3})
                  </p>
                </div>

                {/* Footer: Details Grid */}
                <div className="LeaderboardStatsGrid">
                  <div className="LeaderboardStatBox">
                    <span className="StatLabel">Attendance</span>
                    <span className="StatVal">{item.attendance ?? 0}%</span>
                  </div>
                  <div className="LeaderboardStatBox">
                    <span className="StatLabel">Assignments</span>
                    <span className="StatVal">{item.assignmentsCompleted ?? 0}/{item.totalAssignments ?? 12}</span>
                  </div>
                  <div className="LeaderboardStatBox">
                    <span className="StatLabel">Sem 1</span>
                    <span className="StatVal">{item.semesters?.sem1?.sgpa ?? '0.0'}</span>
                  </div>
                  <div className="LeaderboardStatBox">
                    <span className="StatLabel">Sem 2</span>
                    <span className="StatVal">{item.semesters?.sem2?.sgpa ?? '0.0'}</span>
                  </div>
                  <div className="LeaderboardStatBox">
                    <span className="StatLabel">Sem 3</span>
                    <span className="StatVal">{item.semesters?.sem3?.sgpa ?? '0.0'}</span>
                  </div>
                  <div className="LeaderboardStatBox">
                    <span className="StatLabel">Backlogs</span>
                    <span className="StatVal">
                      {(item.semesters?.sem1?.backlogs || 0) +
                       (item.semesters?.sem2?.backlogs || 0) +
                       (item.semesters?.sem3?.backlogs || 0)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Leaderboard