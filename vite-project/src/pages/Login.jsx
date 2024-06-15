import Header from "../pages/Header";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../routes.css";
const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nam, setNam] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:8000/login",
      { name, password },
      { withCredentials: true }
    );
    // console.log(res.status);
    if (res.status === 200) {
      localStorage.setItem("userdata", JSON.stringify(res.data));
      navigate("/todos");
    }
  };
  const getData = async () => {
    const res = await axios.get("http:localhost:8000/data", {
      withCredentials: true,
    });
    console.log(res.data.password);
    setName(res.data.password);
  };
  return (
    <div id="LoginForm">
      <p id="logintext">LOGIN</p>
      <form onSubmit={handleSubmit}>
        <div className="logininput">
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br></br>

          <input
            id="password"
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
        </div>
        <input id="loginbutton" type="submit" value="LOGIN" />
      </form>
    </div>
  );
};

export default Login;
