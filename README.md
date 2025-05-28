This project is a part of a hackathon run by https://www.katomaran.com
Project link: https://fantastic-peony-e5c22b.netlify.app/
Project working video: https://drive.google.com/drive/folders/1MXAp0lfgw8N4rUld_SsmetcMInCG1mEs



# 🗂️ Office Task Management Web Application

A full-stack task management app built using **React** and **Supabase**. This project allows **Employees** to create and manage their office tasks, and **Managers** to review those tasks, including when they were created and completed.

---

## 🚀 Features

### 👤 Employee
- Register and login using email/password (Supabase Auth)
- Perform **CRUD operations** on personal tasks
- Each task includes:
  - Title, description, due date
  - Created timestamp
  - Completion timestamp (when marked complete)

### 🧑‍💼 Manager
- Hardcoded Supabase user ID: `karishjayakumar`
- Can log in and view **all employee tasks**
- See when tasks were created and completed
- Leave **text reviews** on completed tasks


## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Backend/DB**: Supabase (PostgreSQL + Auth)
- **Auth**: Supabase Email/Password
- **Deployment**: Vercel (frontend), Supabase (backend)

-

## 🗃️ Supabase Database Schema

### `users` (Supabase Auth handles this)
- id (UUID from Supabase Auth)
- email
- role: `"employee"` or `"manager"`

### `tasks`
| Field         | Type       | Description                       |
|---------------|------------|-----------------------------------|
| id            | UUID       | Primary key                       |
| title         | Text       | Task title                        |
| description   | Text       | Task description                  |
| due_date      | Date       | Task deadline                     |
| status        | Text       | `"open"` or `"complete"`          |
| created_at    | Timestamp  | Auto-generated                    |
| completed_at  | Timestamp  | Set when task marked complete     |
| created_by    | UUID       | FK → `users.id`                   |
| review_text   | Text       | Manager review (optional)         |

-
