import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="page-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>

      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default NotFound;