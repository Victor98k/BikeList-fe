import React, { useState, useEffect } from "react";
import apiKit from "../utils/ApiKit";
import localStorageKit from "../utils/LocalStorageKit";
import Nav from "../components/nav";
import styles from "../styles/home.module.css";
import { List, Avatar, Input, Button } from "antd";
import { Comment } from "@ant-design/compatible";
import { clearToken } from "../utils/LocalStorageKit";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const [books, setBooks] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    apiKit
      .get("http://localhost:8080/posts")
      .then((response) => {
        setAllPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn("Error fetching posts: ", error);
        setIsLoading(false);
      });
  }, []);

  const handleCommentChange = (postId, text) => {
    setCommentText((prev) => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = async (postId, text, author) => {
    const comment = commentText[postId];
    if (!comment) {
      console.log("No comment text found, not submitting.");
      return;
    }

    try {
      console.log("Submitting comment:", comment);
      const response = await apiKit.post("/comments", {
        text: comment,
        postId: postId,
        author: author,
      });

      if (response.status === 200) {
        const newComment = response.data;
        console.log("Comment submitted successfully:", newComment);
        setAllPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              return { ...post, comments: [...post.comments, newComment] };
            }
            return post;
          })
        );
        setCommentText((prev) => ({ ...prev, [postId]: "" }));
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error.message);
    }
  };

  const handleLogOut = () => {
    localStorageKit.deleteTokenFromStorage();
    navigate("/");
  };

  return (
    <div className={styles.postContainer}>
      <Nav />
      <Button onClick={handleLogOut}>Log Out</Button>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={allPosts}
        renderItem={(post) => (
          <List.Item key={post._id} className={styles.posts}>
            <List.Item.Meta
              avatar={<Avatar src={post.authorAvatar} />}
              title={<a href={post.href}>{post.title}</a>}
              description={post.description}
            />
            <ul>
              <li>Title: {post.title}</li>

              <li>
                <img src={post.imageUrl} alt="" />
              </li>
            </ul>
          </List.Item>
        )}
      />
    </div>
  );
}

export default Home;
