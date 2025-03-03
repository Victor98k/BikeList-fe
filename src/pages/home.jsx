import React, { useState, useEffect } from "react";
import apiKit from "../utils/ApiKit";
import localStorageKit from "../utils/LocalStorageKit";
import Nav from "../components/nav";
import styles from "../styles/home.module.css";
import { List, Avatar, Input, Button, Card, message } from "antd";
import { Comment } from "@ant-design/compatible";
import { useNavigate } from "react-router-dom";
import Hero from "../components/hero";

function Home(props) {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    apiKit
      .get("http://localhost:8080/posts/")
      // .get("https://storystream-fe.onrender.com/posts/")
      .then((response) => {
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllPosts(sortedPosts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn("Error fetching posts: ", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      try {
        const response = await apiKit.get(
          `http://localhost:8080/users/${userId}`
        );
        setUserDetails((prev) => ({
          ...prev,
          [userId]: response.data.username,
        }));
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        // Set a default or placeholder username in case of an error
        setUserDetails((prev) => ({
          ...prev,
          [userId]: "Unknown",
        }));
      }
    };

    allPosts.forEach((post) => {
      if (post.author && !userDetails[post.author]) {
        fetchUserDetails(post.author);
      }
    });
  }, [allPosts]);

  const handleCommentChange = (postId, text) => {
    setCommentText((prev) => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = async (postId) => {
    const comment = commentText[postId];
    if (!comment) {
      console.log("No comment text found, not submitting.");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      console.error("User not found, please log in.");
      return;
    }

    try {
      const response = await apiKit.post("http://localhost:8080/comments", {
        text: comment,
        postId: postId,
        author: username,
      });

      if (response.status === 201) {
        setCommentText((prev) => ({ ...prev, [postId]: "" }));

        setAllPosts((currentPosts) => {
          const index = currentPosts.findIndex((post) => post._id === postId);
          const updatedPost = {
            ...currentPosts[index],
            comments: [...currentPosts[index].comments, response.data],
          };
          return [
            ...currentPosts.slice(0, index),
            updatedPost,
            ...currentPosts.slice(index + 1),
          ];
        });
        message.success("Comment added successfully!");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error
      ) {
        message.error(error.response.data.error);
      } else {
        message.error("Failed to submit comment due to an unexpected error.");
      }
    }
  };

  const handlePostCreated = (newPost) => {
    setAllPosts((prevPosts) => {
      const updatedPosts = [newPost, ...prevPosts];
      return updatedPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  };
  return (
    <div className={styles.postContainer}>
      <Nav onPostCreated={handlePostCreated} />{" "}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <Hero />
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {},
          pageSize: 10,
        }}
        dataSource={allPosts}
        renderItem={(post) => (
          <Card
            key={post._id}
            title={<h3>{post.title}</h3>}
            className={styles.posts}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ marginRight: "10px" }}>Posted by:</span>

              <span style={{ marginLeft: "10px" }}>
                {userDetails[post.author]
                  ? userDetails[post.author]
                  : "Unknown"}
              </span>
              <Avatar
                className={styles.postAvatar}
                style={{ marginRight: "10px" }}
                src={`https://ui-avatars.com/api/?name=${
                  userDetails[post.author] ? userDetails[post.author][0] : "U"
                }&background=random&color=fff`}
              />
            </div>
            <p className={styles.postDescription}>{post.description}</p>
            <img src={post.imageUrl} alt="" className={styles.postImage} />
            <div className={styles.commentSection}>
              {expandedComments[post._id] &&
                post.comments.map((comment) => {
                  const initial = comment.author
                    ? comment.author.charAt(0).toUpperCase()
                    : "U";
                  return (
                    <div className={styles.commentContainer}>
                      <Comment
                        key={comment._id}
                        author={<p>{comment.author}</p>}
                        avatar={
                          <Avatar
                            src={`https://ui-avatars.com/api/?name=${initial}&background=random&color=fff`}
                          />
                        }
                        content={<p>{comment.text}</p>}
                      />
                    </div>
                  );
                })}
              <a
                className={styles.seeCommentsLink}
                onClick={() => {
                  setExpandedComments((prev) => ({
                    ...prev,
                    [post._id]: !prev[post._id],
                  }));
                }}
              >
                {expandedComments[post._id]
                  ? "See less comments"
                  : "See all comments"}
              </a>
              <Input
                className={styles.commentfield}
                placeholder="Add a comment..."
                value={commentText[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                onPressEnter={() => handleCommentSubmit(post._id)}
              />
              <Button
                className={styles.submitCommentBtn}
                type="primary"
                onClick={() => handleCommentSubmit(post._id)}
              >
                Submit Comment
              </Button>
            </div>
          </Card>
        )}
      />
    </div>
  );
}

export default Home;
