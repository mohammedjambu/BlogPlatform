import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "../utils css/PostPage.css";
import apiService from "../config/apiService";
import { Helmet } from "react-helmet-async";
import CategoryTag from "../components/CategoryTag";
import { useAuth } from "../context/AuthContext";

function PostPage() {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        console.warn("useEffect: Slug is undefined. Cannot fetch post.");
        setError("Error: Post URL is incomplete. Please check the address.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await apiService.get(`/posts/${slug}`);
        setPost(response.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 404) {
            setError(
              "Post not found. It might have been deleted or the link is incorrect."
            );
          } else {
            setError(
              `An error occurred: ${err.response.status} - ${err.message}`
            );
          }
        } else {
          setError("An unexpected error occurred while fetching the post.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const createMetaDescription = (markdown) => {
    if (!markdown) return "";
    const plainText = markdown
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Keep link text
      .replace(/[`*#_~]/g, "") // Remove markdown characters
      .replace(/\s+/g, " "); // Normalize whitespace

    return plainText.substring(0, 155).trim() + "...";
  };

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        Error: {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Could not retrieve post details.
      </div>
    );
  }

  const canModify =
    user && (user.role === "admin" || user._id === post.author?._id);

  return (
    <article className="post-full">
      <Helmet>
        <title>{`${post.title} | My Awesome Blog`}</title>
        <meta
          name="description"
          content={createMetaDescription(post.markdownContent)}
        />
      </Helmet>

      <h1>{post.title}</h1>
      {canModify && (
        <div className="post-actions">
          <Link to={`/edit-post/${post._id}`} className="btn edit-btn">
            Edit Post
          </Link>
        </div>
      )}

      <div className="post-full-meta">
        <span>by {post.author?.username || "Unknown"}</span>
        <span>
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </span>

        {post.categories && post.categories.length > 0 && (
          <div className="post-categories">
            {post.categories.map((category) => (
              <CategoryTag key={category} category={category} />
            ))}
          </div>
        )}
      </div>

      {/* The main content area of the post. */}
      <div className="post-full-content">
        <ReactMarkdown>{post.markdownContent}</ReactMarkdown>
      </div>
    </article>
  );
}

export default PostPage;
