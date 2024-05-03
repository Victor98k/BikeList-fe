import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import Styles from "../styles/nav.module.css";
import { IoHomeSharp } from "react-icons/io5";

function Nav({ onPostCreated }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [author, setAuthor] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = async () => {
    // Check if author is a valid ObjectId
    if (!isValidObjectId(author)) {
      console.error("Invalid author ID");
      return;
    }

    const response = await fetch("http://localhost:8080/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: description,
        imageUrl: imageUrl,
        location: location,
        author: author,
      }),
    });

    if (response.ok) {
      const newPost = await response.json(); // Define newPost with the response data

      console.log("New post created successfully");
      setIsModalVisible(false);
      onPostCreated(newPost); // Pass the new post data to the callback function
    } else {
      console.error("Failed to create new post");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to validate ObjectId
  function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

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
        <Input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Nav;
