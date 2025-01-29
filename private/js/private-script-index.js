document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/logout");
    if (response.ok) {
      alert("Logged out successfully!");
      window.location.href = "/login.html"; // Redirige vers la page de connexion
    } else {
      alert("Logout failed. Please try again.");
    }
  } catch (err) {
    console.error("Error during logout:", err);
  }
});
