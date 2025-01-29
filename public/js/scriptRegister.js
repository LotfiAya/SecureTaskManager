document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/login.html"; // Redirige vers la page de connexion
      } else {
        alert(data.errors || "Registration failed");
      }
    } catch (err) {
      console.error("Error during registration:", err);
    }
  });
