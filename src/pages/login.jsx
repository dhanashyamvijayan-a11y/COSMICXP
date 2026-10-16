export default function Login() {
async function handleLogin(e) {
  e.preventDefault();

  try {
    const response = await fetch(
      "https://cosmicxp-backend.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful!");
    navigate("/profile");
  } catch (error) {
    alert(error.message || "Cannot connect to server");
  }
}
}