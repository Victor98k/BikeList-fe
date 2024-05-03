import React, { useState, useEffect } from "react";
import { List, Avatar, Input, Button } from "antd";
import { Comment } from "@ant-design/compatible";

import styles from "../styles/home.module.css";
import Nav from "../components/nav";

function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState({}); // State to hold comment texts for each post
  const [showAllComments, setShowAllComments] = useState(false); // State to toggle showing all comments

  const fetchAllPosts = async () => {
    try {
      const response = await fetch("http://localhost:8080/");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAllPosts(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleCommentChange = (postId, text) => {
    setCommentText((prev) => ({ ...prev, [postId]: text }));
  };

  // Updated handleCommentSubmit function
  const handleCommentSubmit = async (postId, author) => {
    const comment = commentText[postId];
    if (!comment) {
      console.log("No comment text found, not submitting.");
      return; // Prevent submitting empty comments
    }

    console.log("Submitting comment:", comment); // Check the comment being submitted
    const response = await fetch("http://localhost:8080/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: comment,
        postId: postId,
        author: author,
      }),
    });

    if (response.ok) {
      const newComment = await response.json();
      console.log("Comment submitted successfully:", newComment);
      setAllPosts(
        allPosts.map((post) => {
          if (post._id === postId) {
            return { ...post, comments: [...post.comments, newComment] };
          }
          return post;
        })
      );
      setCommentText((prev) => ({ ...prev, [postId]: "" })); // Clear input after submission
    } else {
      console.error("Failed to submit comment");
    }
  };

  return (
    <div className={styles.postContainer}>
      <Nav onPostCreated={fetchAllPosts} />
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
            <img
              className={styles.postImage}
              src={post.imageUrl}
              alt={post.title}
            />
            <div>{post.content}</div>
            <div className={styles.commentSection}>
              {post.comments && post.comments.length > 0 && (
                <>
                  <Comment
                    key={post.comments[0]._id}
                    author={post.comments[0].author}
                    avatar={<Avatar>{post.comments[0].author[0]}</Avatar>}
                    content={<p>{post.comments[0].text}</p>}
                  />
                  {post.comments.length > 1 && (
                    <>
                      {showAllComments ? (
                        post.comments
                          .slice(1)
                          .map((comment) => (
                            <Comment
                              key={comment._id}
                              author={comment.author}
                              avatar={<Avatar>{comment.author[0]}</Avatar>}
                              content={<p>{comment.text}</p>}
                            />
                          ))
                      ) : (
                        <div>
                          <Button
                            type="link"
                            onClick={() => setShowAllComments(true)}
                          >
                            See all comments
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                  {showAllComments && (
                    <div>
                      <Button
                        type="link"
                        onClick={() => setShowAllComments(false)}
                      >
                        See less comments
                      </Button>
                    </div>
                  )}
                </>
              )}
              <Input.TextArea
                rows={2}
                placeholder="Add a comment..."
                value={commentText[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
              />{" "}
              <Button
                type="primary"
                onClick={() =>
                  handleCommentSubmit(post._id, "Sample Comment", "John Doe")
                }
              >
                Comment this post
              </Button>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default Home;
