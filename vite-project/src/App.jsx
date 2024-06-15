import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  redirect,
} from "react-router-dom";
import Login from "./pages/Login";

import Register from "./pages/Register";
import Header from "./pages/Header";
import Todos from "./pages/Todos";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const router = createBrowserRouter([
  /*createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route path="login" element={<Login />} />

      <Route path="register" element={<Register />} />
      <Route path="todos" element={<Todos />} />
    </Route>
  )*/
  {
    element: <Header />,
    path: "/",

    children: [
      {
        element: <Login />,
        path: "/login",
      },
      {
        element: <Register />,
        path: "/register",
      },
      {
        element: <Todos />,
        // errorElement: <div>Please login first</div>,
        path: "/todos",
        loader: async ({ request }) => {
          try {
            const res = await axios.get("https://todo-webapp-with-database-and-authentication.vercel.app/todos", {
              withCredentials: true,
            });
            const data = await res.data;
            //console.log(data[0].task);
            const todolist = data;
            return todolist;
          } catch (err) {
            return redirect("/login");
          }
        },
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
