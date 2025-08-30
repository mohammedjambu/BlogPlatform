import React from "react";
import { Link } from "react-router-dom";
import "../utils css/CategoryTag.css";

const CategoryTag = ({ category }) => {
  return (
    <Link to={`/category/${category}`} className="category-tag">
      {category}
    </Link>
  );
};

export default CategoryTag;
