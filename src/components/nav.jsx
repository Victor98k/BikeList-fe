import Styles from "../styles/nav.module.css";
import { IoHomeSharp } from "react-icons/io5";

function nav() {
  return (
    <div className={Styles.container}>
      <ul className={Styles.navLinks}>
        <h1 className={Styles.logo}>StoryStream</h1>
        <li className={Styles.links}>
          <a className={Styles.link}>
            {" "}
            <IoHomeSharp />
            Home
          </a>
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

export default nav;
