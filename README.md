# Secure Task Management System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)

A secure web application for managing tasks, featuring user authentication, session management, and JSON-based persistence. Built with Node.js and Express.js, this project emphasizes security and simplicity.

---

## Features ✨
- **User Authentication**: Secure registration and login with password hashing.
- **Task Management**: Create, view, and delete user-specific tasks.
- **Security**:
  - CSRF protection for all POST/DELETE requests.
  - Input validation and sanitization to block malicious data.
  - Secure session cookies with `httpOnly` and `sameSite` attributes.
- **Persistence**: JSON file storage with file locking to prevent data corruption.
- **Monitoring**: Winston-based logging for errors and system activity.

---

## Configuration ⚙️
Configure the application by creating a `.env` file with the following variables:
- `SESSION_SECRET`: Secret key for session encryption.
- `DB_PATH`: Path to the JSON database file (default: `./data/database.json`).
- `PORT`: Server port (default: `3000`).
- `NODE_ENV`: Environment mode (`development` or `production`).

---

## Project Structure 📂
| Directory      | Purpose                                                                 |
|----------------|-------------------------------------------------------------------------|
| `config/`      | Environment configuration (port, session secrets, rate limits).         |
| `controllers/` | Business logic for authentication and task operations.                  |
| `data/`        | JSON database storage (users and tasks).                                |
| `logs/`        | System logs for errors and general activity.                            |
| `middlewares/` | Custom middleware for authentication and input validation.              |
| `public/`      | Publicly accessible pages (login, registration).                        |
| `private/`     | Authenticated-only pages (dashboard, task management).                  |
| `routes/`      | API endpoint definitions for authentication and task operations.        |
| `utils/`       | Utility modules for logging, file handling, and session storage.        |

---

## Security Practices 🔒
1. **CSRF Protection**:  
   Tokens are embedded in cookies and validated on every state-changing request.
2. **Input Sanitization**:  
   - Usernames are restricted to alphanumeric characters.  
   - Task descriptions are escaped to prevent cross-site scripting (XSS).  
3. **Session Security**:  
   - Sessions are encrypted and stored in JSON files.  
   - Cookies are marked as `httpOnly` to block client-side access.  

---

## Logging 📝
- **Error Logs**: Track file read/write failures and system errors in `logs/error.log`.  
- **Activity Logs**: Monitor server activity in `logs/combined.log`.  

---

## API Endpoints 📡
| Method | Endpoint       | Description                            |
|--------|----------------|----------------------------------------|
| POST   | `/register`    | Register a new user.                   |
| POST   | `/login`       | Authenticate an existing user.         |
| GET    | `/logout`      | Terminate the user session.            |
| POST   | `/add`         | Add a new task.                        |
| GET    | `/tasks`       | Retrieve tasks for the logged-in user. |
| DELETE | `/tasks/:id`   | Delete a task by ID.                   |

---
