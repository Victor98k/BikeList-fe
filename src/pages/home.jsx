import Styles from "../styles/home.module.css";
import Nav from "../components/nav";

function home() {
  return (
    <>
      <div className={Styles.container}>
        <Nav />
      </div>
    </>
  );
}

export default home;
