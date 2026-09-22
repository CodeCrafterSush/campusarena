import React, { useState, useEffect } from 'react'
import '../css/Home.css'
import Account from './Account'
import Notification from './Notification'
import Studylab from './Studylab'
import { User, Bell, Award, BookOpen, LogOut } from 'lucide-react'
import Leaderboard from './Leaderboard'

const Home = ({ username = "akash", typeUser = "student", onLogout }) => {
  const [selectedNav, setSelectedNav] = useState('Account')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Username ka pehla letter uppercase me nikalne ke liye
  const avatarInitial = username ? username.charAt(0).toUpperCase() : 'U'

  // Fetch user details from Flask backend based on username
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://127.0.0.1:5000/getUser?username=${username}`)
        const data = await response.json()

        if (response.ok && data.status === 'success') {
          setUserData(data.user)
        } else {
          console.error("User details fetch error:", data.message)
        }
      } catch (error) {
        console.error("Backend request failed:", error)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchUserData()
    }
  }, [username])

  // Dynamic component render function based on selected navigation
  const renderContent = () => {
    if (loading && selectedNav === 'Account') {
      return <div className="homeCardAreaPlaceholder"><p>Loading profile...</p></div>
    }

    switch (selectedNav) {
      case 'Account':
        return <Account userData={userData} username={username} />
      case 'Notification':
        return <Notification />
      case 'Achievement':
        return (
          <div className="homeCardAreaPlaceholder">
            <h2>Achievement Section</h2>
            <p>Your earned badges, certificates, and milestones will appear here.</p>
          </div>
        )

      case 'Study Lab':
        return <Studylab typeUser={typeUser} />



      case 'Leaderboard':
        return <Leaderboard />

      case 'Logged Out':
        return (
          <div className="homeCardAreaPlaceholder">
            <h2>Logged Out</h2>
            <p>You have been successfully logged out.</p>
          </div>
        )


      default:
        return <Account userData={userData} username={username} />
    }
  }

  const handleLogoutClick = () => {
    // Clear session storage on logout
    sessionStorage.clear()
    setSelectedNav('Logged Out')
    if (onLogout) {
      onLogout() // If parent function exists to reset login state
    }
    // Refresh page
    window.location.reload()
  }

  return (
    <div className="homeContainer">
      {/* Left Navigation Sidebar */}
      <div className="homeNavArea">

        {/* User Profile Header Box */}
        <div className="userProfileHeader">
          <div className="userAvatarCircle">
            <span>{avatarInitial}</span>
          </div>
          <div className="userProfileInfo">
            <h3 className="userProfileName">{userData?.studentName || username}</h3>
            <span className={`userTypeBadge ${typeUser.toLowerCase()}`}>
              {typeUser}
            </span>
          </div>
        </div>

        {/* Navigation Options */}
        <div
          className={`navItem ${selectedNav === 'Account' ? 'active' : ''}`}
          onClick={() => setSelectedNav('Account')}
        >
          <div className="navIconCircle">
            <User size={20} />
          </div>
          <span className="navText">Account</span>
        </div>

        <div
          className={`navItem ${selectedNav === 'Notification' ? 'active' : ''}`}
          onClick={() => setSelectedNav('Notification')}
        >
          <div className="navIconCircle">
            <Bell size={20} />
          </div>
          <span className="navText">Notification</span>
        </div>

        <div
          className={`navItem ${selectedNav === 'Achievement' ? 'active' : ''}`}
          onClick={() => setSelectedNav('Achievement')}
        >
          <div className="navIconCircle">
            <Award size={20} />
          </div>
          <span className="navText">Achievement</span>
        </div>

        <div
          className={`navItem ${selectedNav === 'Study Lab' ? 'active' : ''}`}
          onClick={() => setSelectedNav('Study Lab')}
        >
          <div className="navIconCircle">
            <BookOpen size={20} />
          </div>
          <span className="navText">Study Lab</span>
        </div>


        <div
          className={`navItem ${selectedNav === 'Leaderboard' ? 'active' : ''}`}
          onClick={() => setSelectedNav('Leaderboard')}
        >
          <div className="navIconCircle">
            <User size={20} />
          </div>
          <span className="navText">Leaderboard</span>
        </div>


        <div
          className="navItem logoutBtn"
          onClick={handleLogoutClick}
        >
          <div className="navIconCircle">
            <LogOut size={20} />
          </div>
          <span className="navText">Logout</span>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="homeCardArea">
        {renderContent()}
      </div>
    </div>
  )
}

export default Home