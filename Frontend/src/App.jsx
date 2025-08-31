import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import CategoryPage from "./pages/CategoryPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import MyPostsPage from "./pages/MyPostsPage";

function App() {
  return (
    <AuthProvider>
      <Navbar />

      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <MyPostsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
