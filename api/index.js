import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import verifyJWT from "./middlewares/verifyJWT.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connect from "./middlewares/db.js";
import user from "./models/users.js";
import users from "./models/users.js";
import bcrypt from "bcrypt";
import todos from "./models/todos.js";

import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://todo-webapp-with-database-and-authentication-frontend.vercel.app",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
/*async function add() {
  const user = await users.findOne({ name: "Rohit" });
  const data = {
    task: "play cricket",
    completed: "false",
    user_id: user.id,
  };
  const todo = new todos(data);
  todo.save();
}
add();*/
app.post("/register", async (req, res) => {
  const name1 = req.body.name;
  const password1 = req.body.password;
  const encpassword = await bcrypt.hash(password1, 10);
  // console.log(encpassword);
  const data = {
    name: name1,
    password: encpassword,
  };
  const user1 = await users.findOne({ name: name1 });
  if (user1) return res.status(409).json("user already exist");

  const user = new users(data);
  await user.save();
  return res.status(200).json("user regisetered");
});
app.post("/login", async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  const user = await users.findOne({ name: name });
  // console.log(user.id);
  if (!user) {
    return res.status(404).json("user not found");
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (match === true) {
      const id = user.id;
      const accessToken = jwt.sign(
        { name: name, id: id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10 secs",
        }
      );
      const refreshToken = jwt.sign(
        { name: name, id: id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1 day",
        }
      );

      // res.setHeader("");
      res.cookie("jwt", accessToken, {
        sameSite: "none",
        maxAge: 1000 * 10,
        secure: true,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
      });

      res.status(200).json({ name });
    } else res.status(401);
  }

  // verify the name

  // if user is valid
});
app.get("/logout", (req, res) => {
  // console.log("hi");
  res.cookie("jwt", "", {
    sameSite: "none",
    maxAge: 0,
    secure: true,
    httpOnly: true,
    domain: "localhost",
    path: "/",
  });
  res.status(204).send("hi");
});
// middlewarte
app.use((req, res, next) => {
  const accessToken = req.cookies.jwt;

  if (!accessToken && !req.cookies.refreshToken)
    return res.status(401).json("No token");

  if (!accessToken) {
    jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(400).json("Unauthorized");
        }
        const user = decoded;
        const newAccessToken = jwt.sign(
          { name: user.name, id: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "10s", // Changed to "10s" for testing
          }
        );
        const newRefreshToken = jwt.sign(
          { name: user.name, id: user.id },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("jwt", newAccessToken, {
          sameSite: "none",
          maxAge: 10000, // Changed to 10000 for testing
          secure: true,
          httpOnly: true,
        });
        res.cookie("refreshToken", newRefreshToken, {
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
          httpOnly: true,
        });
        req.user = user;
        console.log("refreshToken");
        return next(); // Use 'return' here to exit the callback
      }
    );
  } else {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json("invalid user");
      }
      req.user = decoded;
      return next(); // Use 'return' here to exit the callback
    });
  }
});

app.get("/todos", async (req, res) => {
  const id = req.user.id;
  // console.log(id);
  const data = await todos.find({ user_id: id });
  //console.log(typeof data);
  //console.log(data);
  return res.send(data);
});
app.post("/todos", async (req, res) => {
  console.log(req.user.id);
  console.log(req.body);
  const task = req.body.task;
  const id = req.user.id;
  const data = {
    task: task,
    completed: "false",
    user_id: id,
  };
  const todo = new todos(data);
  await todo.save();
  //const data1 = await todos.find({ user_id: id });
  console.log(todo);
  return res.send(todo);
});
app.delete("/todos/:id", async (req, res) => {
  const id = req.user.id;

  const task_id = req.params.id;
  const data1 = await todos.findOneAndDelete({ user_id: id, _id: task_id });
  console.log(data1);
  const data = await todos.find({ user_id: id });

  return res.send(data);
});
app.put("/todos", async (req, res) => {
  const task_id = req.body.task_id;
  console.log(task_id);
  const id = req.user.id;
  const data1 = await todos.findOneAndUpdate(
    { user_id: id, _id: task_id },
    { completed: "true" }
  );

  const data = await todos.find({ user_id: id });
  return res.send(data);
});

connect().then(() => {
  app.listen(8000, () => {
    console.log("listening for requests");
  });
});
