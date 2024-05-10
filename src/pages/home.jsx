import React, { useState, useEffect } from "react";
import apiKit from "../utils/ApiKit";
import localStorageKit from "../utils/LocalStorageKit";
import Nav from "../components/nav";
import styles from "../styles/home.module.css";
import { List, Avatar, Input, Button, Card, message } from "antd";
import { Comment } from "@ant-design/compatible";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const navigate = useNavigate();

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
        // const response = await apiKit.post(
        //   "https://storystream-fe.onrender.com/comments",
        //   {
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

  const handleLogOut = () => {
    localStorageKit.deleteTokenFromStorage();
    localStorage.removeItem("username");
    navigate("/");
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
          <Card
            key={post._id}
            title={<h3>{post.title}</h3>}
            className={styles.posts}
          >
            <p>{post.description}</p>
            <img src={post.imageUrl} alt="" className={styles.postImage} />
            <div className={styles.commentSection}>
              {post.comments
                .slice(0, expandedComments[post._id] ? post.comments.length : 2)
                .map((comment) => {
                  const initial = comment.author
                    ? comment.author.charAt(0).toUpperCase()
                    : "U";
                  return (
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
                  );
                })}
              {post.comments.length > 2 && (
                <a
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
              )}
              <Input
                placeholder="Add a comment..."
                value={commentText[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                onPressEnter={() => handleCommentSubmit(post._id)}
              />
              <Button
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
