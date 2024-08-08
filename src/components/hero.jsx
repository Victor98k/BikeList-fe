// src/components/Hero.js
import React from "react";
import Styles from "../styles/hero.module.css";
import heroImage from "../assets//hero-bikelist.png";

const Hero = () => {
  return (
    <div className={Styles.heroContainer}>
      <img src={heroImage} alt="Hero" className={Styles.heroImage} />
      <div className={Styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search..."
          className={Styles.searchBar}
        />
      </div>
    </div>
  );
};

export default Hero;
