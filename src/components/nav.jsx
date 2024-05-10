import React, { useState } from "react";
import { Modal, Button, Input, message } from "antd"; // Import message from antd
import Styles from "../styles/nav.module.css";
import apiKit from "../utils/ApiKit"; // Import apiKit
import logo from "../assets/logo.png";

function Nav({ onPostCreated }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [author, setAuthor] = useState(localStorage.getItem("userId") || "");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const accessToken = localStorage.getItem("STORAGE_TOKEN_KEY");
    console.log("Access Token:", accessToken);

    if (!accessToken) {
      alert("No access token available. Please log in.");
      return;
    }

    const userId = localStorage.getItem("userId");
    console.log("User ID:", userId);

    if (!userId) {
      alert("User ID is missing.");
      return;
    }

    // Use apiKit for the POST request
    try {
      const response = await apiKit.post("http://localhost:8080/posts/post", {
        title,
        description,
        imageUrl,
        location,
        author: userId,
      });

      if (response.status === 201) {
        const newPost = response.data;
        message.success("New post created successfully!");
        setIsModalVisible(false);
        onPostCreated(newPost);
      } else {
        message.error(`Failed to create new post: ${response.data.error}`);
      }
    } catch (error) {
      message.error(`Failed to create new post: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={Styles.navContainer}>
      <ul className={Styles.navLinks}>
        <h1 className={Styles.logo}>StoryStream</h1>

        <li className={Styles.links}>
          <a className={Styles.link} onClick={showModal}>
            Post
          </a>
        </li>
        <li className={Styles.links}>
          <a className={Styles.link}>Message</a>
        </li>
        <li className={Styles.links}>
          <a className={Styles.linkcontact}>Profile</a>
        </li>
      </ul>
      <Modal
        title="Create a New Post"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Nav;
