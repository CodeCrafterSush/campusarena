import { useState, useEffect } from 'react';
import './css/App.css';
import Login from "./pages/Login";
import Home from './pages/Home';
import HomeFaculty from './pages/HomeFaculty';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("Student"); // Default 'Student' or 'Faculty'

  // Handle successful login (receives user and optional role type)
  const handleLoginSuccess = (user, type = "Student") => {
    setUsername(user);
    setUserType(type);
    setIsLoggedIn(true);
  };

  // Auto-login state restore from sessionStorage on reload/mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('saved_user');
    const savedRole = sessionStorage.getItem('saved_role');

    if (savedUser) {
      setUsername(savedUser);
      setUserType(savedRole || "Student");
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="appMain">
      {isLoggedIn ? (
        userType === 'Faculty' ? (
          <HomeFaculty username={username} typeUser={userType} />
        ) : (
          <Home username={username} typeUser={userType} />
        )
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;