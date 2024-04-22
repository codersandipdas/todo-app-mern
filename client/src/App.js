import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateTodo from "./pages/CreateTodo";
import PageNotFound from "./pages/PageNotFound";
import UpdateTodo from "./pages/UpdateTodo";
import { useEffect, useState } from "react";
import axiosInstance from "./services/axiosInstance";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { handleLogout, handleLogin } = useAuth();
  const [isLoading, setIsLaoding] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const resp = await axiosInstance.get(`/api/v1/auth/verify`);
        handleLogin(resp.data.user);
      } catch (err) {
        handleLogout();
        console.log(err.message || err);
      } finally {
        setIsLaoding(false);
      }
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateTodo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update/:id"
        element={
          <ProtectedRoute>
            <UpdateTodo />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
