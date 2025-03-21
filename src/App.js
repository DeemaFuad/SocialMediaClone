import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Avatar, Button } from 'antd';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

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


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
    <Menu.Item
      key={item.key}
    >
      <Link to={item.to}>{item.label}</Link>
    </Menu.Item>
  ))}
</Menu>

       <div style={{ display: 'flex', alignItems: 'center' }}>
 
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
