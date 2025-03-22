import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePictureUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null); // Store the image URL

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if a file is selected
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
  
    // Create a FormData object
    const formData = new FormData();
    formData.append("profilePicture", selectedFile);
  
    try {
      // Send the file to the backend
      const response = await axios.post("http://localhost:5000/profile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Send JWT token
        },
      });
  
      // Extract file URL from response
      const { profilePicture } = response.data;
  
      // ✅ Confirm picture is saved
      alert("Profile picture uploaded successfully!");
  
      
  
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture");
    }
  };


  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get("http://localhost:5000/picture", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setProfilePicture(response.data.profilePicture);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, []);


  
  return (
    <div>
        <h2>Profile Picture</h2>
      
      {profilePicture ? (
        <img src={profilePicture} alt="Profile" width="200" />
      ) : (
        <p>No profile picture uploaded</p>
      )}
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
    </div>
  );
};

export default ProfilePictureUpload;
