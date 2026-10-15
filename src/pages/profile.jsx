import { useNavigate, Link } from "react-router-dom";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const savedUser = sessionStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  }

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Please login to view your profile</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">👤</div>

        <h1>My Profile</h1>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}