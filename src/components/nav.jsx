import React, { useState } from "react";
import { Modal, Button, Input, message, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import Styles from "../styles/nav.module.css";
import apiKit from "../utils/ApiKit";
import localStorageKit from "../utils/LocalStorageKit";

function Nav({ onPostCreated }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [author, setAuthor] = useState(localStorage.getItem("userId") || "");
  const navigate = useNavigate();

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

  const handleLogOut = () => {
    localStorageKit.deleteTokenFromStorage();
    localStorage.removeItem("username");
    navigate("/");
  };

  const username = localStorage.getItem("username");
  const initial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div className={Styles.navContainer}>
      <h1 className={Styles.logo}>BikeList</h1>
      <ul className={Styles.navLinks}>
        <li className={Styles.links}>
          <button className={Styles.newAnnonsBtn} onClick={showModal}>
            Ny annons
          </button>
        </li>
        <li className={Styles.links}>
          <a className={Styles.link}>Meddelanden</a>
        </li>
        <li className={Styles.links}>
          <a className={Styles.link}>Bevakningar</a>
        </li>
      </ul>
      <div className={Styles.userProfile}>
        <Avatar
          src={`https://ui-avatars.com/api/?name=${initial}&background=random&color=fff`}
          className={Styles.avatar}
        />
        <p>
          <strong>{username || "Unknown User"}</strong>
        </p>
        <Button onClick={handleLogOut} className={Styles.link}>
          Log Out
        </Button>
      </div>
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
