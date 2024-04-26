import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/logIn";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route index element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
