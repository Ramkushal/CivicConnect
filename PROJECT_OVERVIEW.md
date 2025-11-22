# CivicConnect - Smart City Issue Reporting Platform

## 🚀 Project Overview
**CivicConnect** is an enterprise-grade full-stack application designed to revolutionize municipal issue management. Architected using the **PERN stack (PostgreSQL, Express, React, Node.js)**, it delivers a seamless experience for citizens to report infrastructure issues via geolocation tagging. The backend leverages **Prisma ORM** for efficient data modeling and **Socket.io** for real-time bi-directional communication. Featuring a **Dockerized** deployment pipeline and **RBAC** security, the platform optimizes workforce allocation and enhances civic transparency through data-driven accountability dashboards.

## 🛠️ Technology Stack

### Frontend
- **Library:** React.js (v18+)
- **Styling:** Tailwind CSS & Framer Motion
- **State Management:** Redux Toolkit & React Query
- **Maps:** Leaflet / React-Leaflet
- **Forms:** React Hook Form + Zod Validation

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API Architecture)
- **Database:** PostgreSQL
- **ORM:** Prisma (for type-safe database queries)
- **Authentication:** JWT (JSON Web Tokens) & BCrypt
- **Real-time:** Socket.io (for live status updates)

### DevOps & Tools
- **Version Control:** Git & GitHub Actions (CI/CD)
- **Containerization:** Docker
- **Testing:** Jest & React Testing Library

---

## ✨ Key Features

### 👤 For Citizens
1.  **Report Issues:**
    - Upload photos, add descriptions, and automatically capture location via GPS.
    - Categorize issues (Roads, Sanitation, Electricity, etc.).
2.  **Interactive Map:**
    - View all reported issues on a city map.
    - Filter issues by status (Open, In Progress, Resolved) and category.
3.  **Engagement:**
    - **Upvote** issues to prioritize them.
    - **Comment** on issues to provide updates or feedback.
    - View the "Accountability Leaderboard" to see top-performing officers.
4.  **Profile Management:**
    - Track personal reported issues.
    - Edit profile details (Name, Area, Phone).

### 👮 For Officers
1.  **Dedicated Dashboard:**
    - View issues assigned specifically to them (`/assigned-issues`).
    - Filter issues by their department or ward.
2.  **Issue Management:**
    - Update issue status (Open -> In Progress -> Resolved).
    - Add official resolution notes and upload "After" photos as proof of work.
3.  **Performance Tracking:**
    - View personal stats: Issues Solved, Average Resolution Time, and Citizen Ratings.

### 🏛️ For Administrators
1.  **User Management:** Manage citizen and officer accounts.
2.  **Analytics:** View city-wide statistics on issue resolution rates and departmental performance.

---

## 💾 Database Schema (PostgreSQL)

The application is built on a relational database model ensuring data integrity and efficient querying.

### 1. `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key, linked to Auth |
| `email` | Text | User email |
| `name` | Text | Full name |
| `role` | Text | 'citizen', 'officer', 'admin' |
| `profile_photo` | Text | URL to avatar |
| `created_at` | Timestamp | Account creation time |

### 2. `officers` (Extends Users)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK to `users.id` |
| `department` | Text | e.g., 'Roads', 'Sanitation' |
| `designation` | Text | e.g., 'Junior Engineer' |
| `ward` | Text | Assigned Ward |
| `stats` | JSONB | Cached stats (solved count, rating) |

### 3. `issues`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `user_id` | UUID | FK to `users.id` (Reporter) |
| `title` | Text | Short title |
| `description` | Text | Detailed description |
| `category` | Text | Issue category |
| `status` | Text | 'open', 'in_progress', 'resolved' |
| `priority` | Text | 'low', 'medium', 'high' |
| `latitude` | Float | Location Lat |
| `longitude` | Float | Location Lng |
| `image_url` | Text | URL to issue photo |
| `upvotes` | Int | Count of upvotes |
| `created_at` | Timestamp | Reporting time |

### 4. `assignments`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `issue_id` | BigInt | FK to `issues.id` |
| `officer_id` | UUID | FK to `officers.id` |
| `assigned_at` | Timestamp | Assignment time |
| `status` | Text | Current status of assignment |

### 5. `comments`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `issue_id` | BigInt | FK to `issues.id` |
| `user_id` | UUID | FK to `users.id` |
| `content` | Text | Comment text |
| `created_at` | Timestamp | Comment time |

### 6. `resolutions`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `issue_id` | BigInt | FK to `issues.id` |
| `officer_id` | UUID | FK to `officers.id` |
| `resolution_note`| Text | Description of fix |
| `proof_image_url`| Text | "After" photo |
| `resolved_at` | Timestamp | Completion time |

---

## 🔄 Workflow

1.  **Reporting:** A citizen logs in, captures a photo of a pothole, and submits it. The app grabs the GPS coordinates.
2.  **Assignment:** The system (or admin) assigns the issue to the Road Department officer for that Ward.
3.  **Action:** The Officer sees the issue in their "My Assignments" tab. They visit the site.
4.  **Update:** The Officer marks it "In Progress". Citizens get a notification/see the update.
5.  **Resolution:** The Officer fixes the pothole, takes a photo, and marks it "Resolved" with a note.
6.  **Verification:** The Citizen can view the "Before" and "After" photos and rate the resolution.

---

## 🔮 Future Roadmap
- **AI Categorization:** Automatically detect issue type (pothole vs garbage) from the uploaded image.
- **SMS Integration:** Send SMS updates to citizens without smartphones.
- **Gamification:** Award badges to citizens for active community participation.
