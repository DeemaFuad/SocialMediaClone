import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Avatar, Button } from 'antd';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './pages/LoginForm';
import ProfilePage from './pages/profilePage';

const { Header, Content, Footer } = Layout;

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const items = [
  { key: '1', label: 'Feed', to: '/feed' },
  { key: '2', label: 'Group', to: '/group' },
  { key: '3', label: 'Chat', to: '/chat' },
  { key: '4', label: 'Settings', to: '/settings' },
];

const Group = () => <div>Group Page</div>;
const Chat = () => <div>Chat Page</div>;
const Settings = () => <div>Settings Page</div>;

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      const storedProfilePicture = localStorage.getItem('profilePicture');
      if (storedProfilePicture) {
        setProfilePicture(storedProfilePicture); // Use the stored profile picture if available
      } else {
        // Fetch profile picture if not stored
        axios
          .get('http://localhost:5000/picture', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setProfilePicture(`http://localhost:5000/uploads/${response.data.profilePicture}`);
            localStorage.setItem('profilePicture', response.data.profilePicture); // Save it to localStorage
          })
          .catch((error) => {
            console.error('Error fetching user picture:', error);
          });
      }
    }
  }, []);

  const handleProfileClick = () => {
    navigate(`/profile`);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profilePicture'); // Remove profile picture from localStorage
    setLoggedIn(false); // Set state to logged out
    navigate('/login'); // Redirect to login page
  };

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          height: '50px',
          justifyContent: 'space-between',
          backgroundColor: '#001529', // Ensure header has a background color
          padding: '0 16px', // Adjust padding to ensure space around the elements
        }}
      >
        {loggedIn && (
          <>
            <Avatar
              src={profilePicture ? profilePicture : 'https://via.placeholder.com/150'}              // Placeholder if no picture exists
              size="large"
              style={{ border: '2px solid white', margin: '20px' }}
              onClick={handleProfileClick}

            />
          </>
        )}
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
            height: '50px',
          }}
        >
          {items.map((item) => (
            <Menu.Item key={item.key}>
              <Link to={item.to}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {loggedIn && (
            <Button
              onClick={logout}
              style={{
                backgroundColor: 'black',
                color: 'red',
                border: '2px solid white', // Add a solid border style
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </Header>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/" element={loggedIn ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={loggedIn ? <Navigate to="/feed" replace /> : <LoginForm onLogin={() => setLoggedIn(true)} />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Connect, share, and inspire – your social space to engage with the world. 🌍🚀
      </Footer>
    </Layout>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
