import React, { useState, useEffect } from 'react';
import { Avatar, Typography, Card, List } from 'antd';
import axios from 'axios';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
const { Meta } = Card;


const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const token = localStorage.getItem('token');
  const defaultProfilePic = "/images/default-profile.png"; // Default image URL

  useEffect(() => {
    // Fetch user profile data
    axios.get('http://localhost:5000/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });

    // Fetch user posts
    axios.get('http://localhost:5000/user/posts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, [token]);

  const handleToggleForm = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file)); // Create image preview
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if an image was selected
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedImage); // Send the selected image

    try {
      const response = await fetch("http://localhost:5000/user/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` }, // Send the token
      });

      if (response.ok) {
        const data = await response.json();
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: data.fileUrl, // Update the profile picture URL
        }));
        setPreview(null); // Reset preview after successful upload
        setSelectedImage(null); // Reset selected image state
      } else {
        alert("Error uploading profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("An error occurred while uploading the profile picture. Please try again.");
    }
  };

  // Determine the image URL to show (preview or user profile picture)
  const imageUrl = preview || userData?.profilePicture || defaultProfilePic;

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '20px', textAlign: 'left' }}>
      {/* User Profile Picture */}
      <Avatar size={100} src={imageUrl} alt="Profile Picture" />
      <button type="button" onClick={handleToggleForm}>Change Profile Picture</button>

      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="profilePicture">Choose Profile Picture:</label>
          <input type="file" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" width="100" />}
          <button type="submit">Update</button>
        </form>
      )}

      <Typography.Title level={2}>{userData?.name}</Typography.Title>

      {/* User's Posts */}
      <Typography.Title level={3}>My Posts</Typography.Title>
      <div className="posts-container">


      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={posts}
        renderItem={post => (
          <List.Item key={post._id}>
              <Card
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
      title=              <p>content: <p className="font-bold">{post.content}</p></p>
      description=      <p>{`Posted at ${post.createdAt}`}</p>
    />
  </Card>
          </List.Item>
        )}
      />
      </div>
    </div>
  );
};

export default ProfilePage;
