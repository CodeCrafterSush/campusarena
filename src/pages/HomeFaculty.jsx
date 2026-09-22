import React, { useState, useEffect } from 'react'
import '../css/Home.css'
import Account from './Account'
import Studylab from './Studylab'
import { User, Bell, BellPlus, FilePlus, UserPlus, BookOpen, LogOut } from 'lucide-react'
import AccountFaculty from './AccountFaculty'
import Registration from './Registeration'
import CreateNotification from './CreateNotification'
import UploadFile from './UploadFIle'
import Notification from './Notification'
import StudentProgress from './StudentProgress'
import Leaderboard from './Leaderboard'

const HomeFaculty = ({ username = "faculty_admin", typeUser = "faculty", onLogout }) => {
  const [selectedNav, setSelectedNav] = useState('Account')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Username ka pehla letter uppercase me nikalne ke liye
  const avatarInitial = username ? username.charAt(0).toUpperCase() : 'F'

  // Fetch faculty user details from Flask backend based on username
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://127.0.0.1:5000/getFaculty?username=${username}`)
        const data = await response.json()

        if (response.ok && data.status === 'success') {
          setUserData(data.user)
        } else {
          console.error("Faculty details fetch error:", data.message)
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
      return <div className="homeCardAreaPlaceholder"><p>Loading faculty profile...</p></div>
    }

    switch (selectedNav) {
      case 'Account':
        return <AccountFaculty username={username} />

      case 'New Registration':
        return (
          <div className="homeCardAreaPlaceholder">
            <Registration />
          </div>
        )

      case 'Create Notification':
        return (
          <div className="homeCardAreaPlaceholder">
            <CreateNotification />
          </div>
        )

      case 'Notification':
        return (
          <div className="homeCardAreaPlaceholder">
            <Notification typeUser={"faculty"} />
          </div>
        )

      case 'Upload Document':
        return (
          <div className="homeCardAreaPlaceholder">
            <UploadFile loggedInUser={username} />
          </div>
        )

      case 'Study Lab':
        return <Studylab typeUser="faculty" />


      case 'Student Progress':
        return <StudentProgress />


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
      onLogout() // Resets parent state if callback provided
    }
    // Refresh page
    window.location.reload()
  }

  return (
    <div className="homeContainer">
      {/* Left Navigation Area */}
      <div className="homeNavArea">

        {/* Profile Circle & Faculty Info Tag Header */}
        <div className="userProfileHeader">
          <div className="userAvatarCircle">
            <span>{avatarInitial}</span>
          </div>
          <div className="userProfileInfo">
            <h3 className="userProfileName">{userData?.name || username}</h3>
            <span className={`userTypeBadge ${typeUser.toLowerCase()}`}>
              {typeUser}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
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
          className={`navItem ${selectedNav === 'New Registration' ? 'active' : ''}`}
          onClick={() => setSelectedNav('New Registration')}
        >
          <div className="navIconCircle">
            <UserPlus size={20} />
          </div>
          <span className="navText">New Registration</span>
        </div>

        <div
          className={`navItem ${selectedNav === 'Create Notification' ? 'active' : ''}`}
          onClick={() => setSelectedNav('Create Notification')}
        >
          <div className="navIconCircle">
            <BellPlus size={20} />
          </div>
          <span className="navText">Create Notification</span>
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
          className={`navItem ${selectedNav === 'Upload Document' ? 'active' : ''}`}
          onClick={() => setSelectedNav('Upload Document')}
        >
          <div className="navIconCircle">
            <FilePlus size={20} />
          </div>
          <span className="navText">Upload Document</span>
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
          className={`navItem ${selectedNav === 'Student Progress' ? 'active' : ''}`}
          onClick={() => setSelectedNav('Student Progress')}
        >
          <div className="navIconCircle">
            <BookOpen size={20} />
          </div>
          <span className="navText">Student Progress</span>
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

      {/* Right Content Area - Dynamic Component Rendering */}
      <div className="homeCardArea">
        {renderContent()}
      </div>
    </div>
  )
}

export default HomeFaculty