import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../config/apiService";
import { useAuth } from "../context/AuthContext";
import "../utils css/AdminDashboard.css";

function MyPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiService.get("/posts");
        setPosts(response.data.posts);
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
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await apiService.delete(`/posts/${postId}`);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post.");
    }
  };

  if (loading)
    return <div className="loading-message">Loading your posts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const userPosts = posts.filter((post) => post.author?._id === user?._id);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Your Posts</h2>
        <Link to="/create-post" className="create-post-btn">
          + Create New Post
        </Link>
      </div>

      <table className="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Published Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <Link to={`/edit-post/${post._id}`} className="btn edit-btn">
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
              <td colSpan="3" style={{ textAlign: "center" }}>
                You haven't created any posts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyPostsPage;
