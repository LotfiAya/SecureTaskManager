document.addEventListener("DOMContentLoaded", async () => {
  const tasksTableBody = document.querySelector("#tasksTable tbody");
  const addTaskForm = document.getElementById("addTaskForm");
  const logoutBtn = document.getElementById("logoutBtn");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCsrfToken(),
        },
        credentials: "include",
      });

      const tasks = await response.json();

      if (response.ok) {
        tasksTableBody.innerHTML = "";
        tasks.forEach((task) => {
          const row = document.createElement("tr");

          // Task cell
          const taskCell = document.createElement("td");
          taskCell.textContent = task.task;

          // Date cell
          const dateCell = document.createElement("td");
          dateCell.textContent = new Date(task.createdAt).toLocaleDateString();

          // Delete button cell
          const deleteCell = document.createElement("td");
          const deleteButton = document.createElement("button");
          deleteButton.className = "delete-btn";
          deleteButton.textContent = "Delete";
          deleteButton.dataset.id = task.id;

          // Build row structure
          deleteCell.appendChild(deleteButton);
          row.appendChild(taskCell);
          row.appendChild(dateCell);
          row.appendChild(deleteCell);

          tasksTableBody.appendChild(row);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach((button) => {
          button.addEventListener("click", handleDelete);
        });
      } else {
        alert(tasks.errors || "Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Delete task handler
  const handleDelete = async (e) => {
    const taskId = e.target.dataset.id;

    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCsrfToken(),
        },
        credentials: "include",
      });

      if (response.ok) {
        alert("Task deleted successfully!");
        await fetchTasks();
      } else {
        const error = await response.json();
        alert(error.errors || "Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Add task
  addTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const task = document.getElementById("taskInput").value;

    try {
      const response = await fetch("http://localhost:3000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify({ task }),
      });

      if (response.ok) {
        document.getElementById("taskInput").value = "";
        await fetchTasks();
      } else {
        const data = await response.json();
        alert(data.errors || "Failed to add task");
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  });

  // Logout
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCsrfToken(),
        },
        credentials: "include",
      });
      if (response.ok) {
        alert("Logged out successfully!");
        window.location.href = "/login.html";
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  });

  fetchTasks(); // Initial fetch
});

function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
}
