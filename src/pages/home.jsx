import React, { useState, useEffect } from "react";
import Styles from "../styles/home.module.css";
import Nav from "../components/nav";

function Home() {
  const [allPosts, setallPosts] = useState([]);
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
        setallPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className={Styles.container}>
        <Nav />
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        <ul className={Styles.postContainer}>
          {allPosts.map((post) => (
            <li className={Styles.posts} key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Home;
