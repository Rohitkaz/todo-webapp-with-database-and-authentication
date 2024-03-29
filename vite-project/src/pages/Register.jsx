import Header from "../pages/Header";
import { useState } from "react";
import axios from "axios";
import "../routes.css";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/register", {
        name,
        password,
      });

      if (res.status == 200) {
        navigate("/Login");
      }
    } catch (err) {
      console.log(err.message);
    }
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
        <input id="loginbutton" type="submit" value="SIGNUP" />
      </form>
    </div>
  );
};

export default Register;
