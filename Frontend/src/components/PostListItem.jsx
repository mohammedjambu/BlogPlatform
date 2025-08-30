import React from "react";
import { Link } from "react-router-dom";
import "../utils css/PostListItem.css";
import CategoryTag from "./CategoryTag";

function PostListItem({ post }) {
  const snippet =
    post.markdownContent
      .replace(/[#*`]/g, "") // A simple regex to remove common markdown characters
      .substring(0, 150) + "...";

  return (
    <Link to={`/post/${post.slug}`} className="post-link">
      <article className="post-list-item">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span>by {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        {post.categories && post.categories.length > 0 && (
          <div>
            {post.categories.map((category) => (
              <CategoryTag key={category} category={category} />
            ))}
          </div>
        )}
        <p>{snippet}</p>
      </article>
    </Link>
  );
}

export default PostListItem;
