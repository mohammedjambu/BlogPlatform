import React, { useEffect, useState } from "react";
import apiService from "../config/apiService";
import PostListItem from "../components/PostListItem";
import "../utils css/HomePage.css";
import { Helmet } from "react-helmet-async";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiService.get(
          `/posts?page=${currentPage}&limit=10`
        );

        const { posts: fetchedPosts, totalPages: fetchedTotalPages } =
          response.data;

        setPosts(fetchedPosts);
        setTotalPages(fetchedTotalPages);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="home-page">
      <Helmet>
        <title>My Awesome Blog - Latest Posts</title>
        <meta 
          name="description" 
          content="Welcome to My Awesome Blog. Read the latest articles on web development, technology, and more." 
        />
      </Helmet>

      <h1>Latest Posts</h1>
      <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => <PostListItem key={post._id} post={post} />)
        ) : (
          <p>No posts to display.</p>
        )}
      </div>

      {/* 8. Render the pagination controls only if there are posts and pages. */}
      {totalPages > 0 && (
        <div className="pagination-controls">
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-buttons">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1} // Disable if on the first page
              className="btn"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages} // Disable if on the last page
              className="btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
