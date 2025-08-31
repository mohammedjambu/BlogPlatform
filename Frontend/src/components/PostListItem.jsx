import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../utils css/PostListItem.css";
import CategoryTag from "./CategoryTag";

function PostListItem({ post }) {
  const navigate = useNavigate();

  const snippet =
    post.markdownContent
      .replace(/[#*`]/g, "") // A simple regex to remove common markdown characters
      .substring(0, 150) + "...";

  const handleCategoryClick = (e) => {
    e.stopPropagation();
  };

  const handleArticleClick = () => {
    navigate(`/post/${post.slug}`);
  };

  return (
    <article
      className="post-list-item"
      onClick={handleArticleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && handleArticleClick()
      }
    >
      <h2>
        <Link to={`/post/${post.slug}`} className="post-title-link">
          {post.title}
        </Link>
      </h2>
      <div className="post-meta">
        <span>by {post.author?.username || "Unknown"}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {post.categories && post.categories.length > 0 && (
        <div
          onClick={handleCategoryClick}
          className="post-categories-container"
        >
          {post.categories.map((category) => (
            <CategoryTag key={category} category={category} />
          ))}
        </div>
      )}
      <p>{snippet}</p>
    </article>
  );
}

export default PostListItem;
