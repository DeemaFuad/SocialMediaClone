import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




const LoginForm = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To redirect after login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);

    const { username, password } = values;

    try {
      // Make a POST request to your backend API
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      

      // Check if login was successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
        onLogin(); // Update login state (passed down as a prop)
        message.success('Login successful!');
        navigate('/feed'); // Redirect to feed page
      } else {
        message.error('Invalid credentials!');
      }
    } catch (error) {
      console.error('Login failed', error);
      message.error('An error occurred during login!');
    }

    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="m-16 w-full max-w-md"> {/* Wrap the form in a div and apply margin */}
    <Form
      name="login"
      onFinish={handleSubmit}
      style={{ maxWidth: 300, margin: 'auto' }}
      className="m-20"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block className="bg-gray-700">
        <div className="text-purple-500">Login</div>
        </Button>
      </Form.Item>
      <div style={{ textAlign: 'center' }}>
        Don't have an account?{' '}
        <Button type="link" onClick={() => navigate('/signup')} >
          <div className="text-purple-500">Sign Up</div>
        </Button>
      </div>
    </Form>
    </div>
    </div>
  );
};

export default LoginForm;
