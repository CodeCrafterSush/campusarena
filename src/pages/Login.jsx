import React, { useState, useEffect } from 'react';
import '../css/Login.css';

const Login = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('Student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Dynamic Endpoint Helper Function
  const performLogin = async (userType, userInput, passInput) => {
    setIsLoading(true);
    setErrorMsg('');

    const userData = {
      type: userType,
      inputusername: userInput,
      passwordinput: passInput
    };

    // Role ke hisab se backend API URL select karo
    const endpoint = userType === 'Faculty' 
      ? 'http://127.0.0.1:5000/loginCheckFaculty' 
      : 'http://127.0.0.1:5000/loginCheck';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Session storage me store karo
        sessionStorage.setItem('saved_user', userInput);
        sessionStorage.setItem('saved_pass', passInput);
        sessionStorage.setItem('saved_role', userType);

        // App.js ko username aur role dono pass karo
        onLoginSuccess(userInput, userType);
      } else {
        sessionStorage.clear();
        setErrorMsg(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setErrorMsg('Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Auto-Login Check on Initial Page Load
  useEffect(() => {
    const savedUser = sessionStorage.getItem('saved_user');
    const savedPass = sessionStorage.getItem('saved_pass');
    const savedRole = sessionStorage.getItem('saved_role') || 'Student';

    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setSelectedRole(savedRole);
      
      performLogin(savedRole, savedUser, savedPass);
    }
  }, []);

  // 3. Manual Form Submission
  const handleLogin = (e) => {
    e.preventDefault();
    performLogin(selectedRole, username, password);
  };

  return (
    <div className="loginCard">
      <div className="loginHeader">
        <h1 className="loginTitle">Welcome Back</h1>
        <p className="loginSubtitle">Please sign in to your account</p>
      </div>

      {/* Role Selector */}
      <div className="loginRoleSection">
        <span className="loginRoleLabel">Choose Your Role</span>
        <div className="loginRoleGrid">
          <label
            className={`loginRoleBox ${selectedRole === 'Student' ? 'loginRoleActive' : ''}`}
            onClick={() => setSelectedRole('Student')}
          >
            <input
              type="radio"
              name="userRole"
              value="Student"
              checked={selectedRole === 'Student'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="loginRoleRadio"
            />
            <div className="loginRoleText">
              <strong>Student</strong>
              <span>Access courses</span>
            </div>
          </label>

          <label
            className={`loginRoleBox ${selectedRole === 'Faculty' ? 'loginRoleActive' : ''}`}
            onClick={() => setSelectedRole('Faculty')}
          >
            <input
              type="radio"
              name="userRole"
              value="Faculty"
              checked={selectedRole === 'Faculty'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="loginRoleRadio"
            />
            <div className="loginRoleText">
              <strong>Faculty</strong>
              <span>Manage classes</span>
            </div>
          </label>
        </div>
      </div>

      {/* Form Container */}
      <form className="loginFormContainer" onSubmit={handleLogin}>
        <div className="loginFieldGroup">
          <label htmlFor="usernameInput" className="loginLabel">
            Username / ID
          </label>
          <input
            type="text"
            id="usernameInput"
            className="loginInput"
            placeholder="Enter your username or ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="loginFieldGroup">
          <label htmlFor="passwordInput" className="loginLabel">
            Password
          </label>
          <input
            type="password"
            id="passwordInput"
            className="loginInput"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {errorMsg && (
          <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>
            {errorMsg}
          </p>
        )}

        <button type="submit" className="loginBtnSubmit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : `Sign In as ${selectedRole}`}
        </button>
      </form>
    </div>
  );
};

export default Login;