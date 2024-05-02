// nav.js
import Styles from "../styles/nav.module.css";
import { IoHomeSharp } from "react-icons/io5";

function Nav() {
  return (
    <div className={Styles.navContainer}>
      <ul className={Styles.navLinks}>
        <h1 className={Styles.logo}>StoryStream</h1>
        <li className={Styles.links}>
          <a className={Styles.link}> Home</a>
        </li>
        <li className={Styles.links}>
          <a className={Styles.link}>Post</a>
        </li>
        <li className={Styles.links}>
          <a className={Styles.link}>Message</a>
        </li>
        <li className={Styles.links}>
          <a className={Styles.linkcontact}>Profile</a>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
