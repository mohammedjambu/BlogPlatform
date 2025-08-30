import React, { useEffect, useState } from "react";
import "../utils css/AdminDashboard.css";
import apiService from "../config/apiService";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiService.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await apiService.delete(`/posts/${postId}`);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again later.");
    }
  };

  if (loading) {
    return <div className="loading-message">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Manage Posts</h2>
        <Link to="/admin/create-post" className="create-post-btn">
          + Create New Post
        </Link>
      </div>

      <table className="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <Link
                    to={`/admin/edit-post/${post._id}`}
                    className="btn edit-btn"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No posts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
