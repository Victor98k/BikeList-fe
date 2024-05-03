import React, { useState, useEffect } from "react";
import Styles from "../styles/home.module.css";
import Nav from "../components/nav";

function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setAllPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  // Function to fetch comment data for a given comment ID
  const fetchComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/comments/${commentId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comment");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching comment:", error);
      return null;
    }
  };

  // Function to fetch author data for a given author ID
  const fetchAuthor = async (authorId) => {
    try {
      const response = await fetch(`http://localhost:8080/authors/${authorId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch author");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching author:", error);
      return null;
    }
  };

  const fetchCommentsForPosts = async () => {
    const postsWithComments = await Promise.all(
      allPosts.map(async (post) => {
        const comments = await Promise.all(
          post.comments.map(async (commentId) => {
            const comment = await fetchComment(commentId);
            if (comment && comment.authorId) {
              const author = await fetchAuthor(comment.authorId);
              return { ...comment, author };
            } else {
              return comment;
            }
          })
        );
        return { ...post, comments };
      })
    );
    setAllPosts(postsWithComments);
  };
  return (
    <div className={Styles.container}>
      <Nav />
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <ul className={Styles.postContainer}>
        {allPosts.map((post) => (
          <li className={Styles.posts} key={post.id}>
            <h3>{post.title}</h3>
            <img src={post.imageUrl} alt="" />
            <ul>
              {post.comments.map((comment, index) => (
                <li key={index}>
                  {comment ? (
                    <>
                      <p>{comment.text}</p>

                      <p>Author: {comment.author}</p>
                    </>
                  ) : (
                    "Loading comment..."
                  )}
                </li>
              ))}
            </ul>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
