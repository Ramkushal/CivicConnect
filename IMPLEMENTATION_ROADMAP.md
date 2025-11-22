# Implementation Roadmap: CivicConnect (PERN Stack)

This roadmap outlines the step-by-step process to transform the current frontend-only React application into a full-stack enterprise-grade platform using the **PERN Stack** (PostgreSQL, Express, React, Node.js).

## Phase 1: Backend Initialization & Database Setup

### 1.1. Initialize Node.js Backend
- [x] Create a `server` directory in the project root.
- [x] Initialize a new Node.js project: `npm init -y`.
- [x] Install core dependencies: `express`, `cors`, `dotenv`, `helmet`, `morgan`.
- [x] Install dev dependencies: `nodemon`, `ts-node` (if using TypeScript).

### 1.2. PostgreSQL & Prisma Setup
- [ ] Install PostgreSQL locally or set up a cloud instance (e.g., Supabase, Neon, AWS RDS).
- [x] Install Prisma: `npm install prisma --save-dev`.
- [x] Initialize Prisma: `npx prisma init`.
- [x] Configure `DATABASE_URL` in `.env`.

### 1.3. Define Database Schema
- [x] Translate the schema from `PROJECT_OVERVIEW.md` into `prisma/schema.prisma`.
- [x] Define models: `User`, `Officer`, `Issue`, `Assignment`, `Comment`, `Resolution`.
- [x] Run migration: `npx prisma migrate dev --name init`.

---

## Phase 2: API Development (Express.js)

### 2.1. Authentication Module
- [ ] Implement JWT-based authentication.
- [ ] Create middleware: `authMiddleware` (verify token), `rbacMiddleware` (check roles).
- [ ] Endpoints:
    - `POST /api/auth/register` (Citizens only)
    - `POST /api/auth/login`
    - `GET /api/auth/me`

### 2.2. User & Officer Management
- [ ] Endpoints:
    - `GET /api/users/profile`
    - `PUT /api/users/profile`
    - `GET /api/officers` (Admin/Public)
    - `POST /api/officers` (Admin only - create officer accounts)

### 2.3. Issue Management
- [ ] Endpoints:
    - `POST /api/issues` (Report issue + Image upload)
    - `GET /api/issues` (Filter by status, category, location)
    - `GET /api/issues/:id`
    - `PUT /api/issues/:id/upvote`

### 2.4. Assignment & Resolution Workflow
- [ ] Endpoints:
    - `POST /api/assignments` (Assign officer)
    - `GET /api/assignments/my-assignments` (Officer only)
    - `PUT /api/issues/:id/status` (Update status)
    - `POST /api/resolutions` (Resolve issue + Proof image)

---

## Phase 3: Real-time & Advanced Features

### 3.1. Real-time Updates (Socket.io)
- [ ] Install `socket.io` on server and `socket.io-client` on client.
- [ ] Configure Socket.io server.
- [ ] Events:
    - `issue_reported`: Notify officers in the ward.
    - `status_updated`: Notify the reporting citizen.
    - `new_comment`: Update comment feed live.

### 3.2. Image Storage
- [ ] Set up cloud storage (AWS S3, Cloudinary, or Supabase Storage).
- [ ] Implement file upload middleware (e.g., `multer`).

---

## Phase 4: Frontend Integration

### 4.1. API Client Setup
- [ ] Install `axios` or configure `fetch`.
- [ ] Create an `api.js` utility with interceptors for JWT injection.
- [ ] Replace `mockData.js` calls with real API hooks (using `react-query` is recommended).

### 4.2. Auth Integration
- [ ] Update `AuthContext.jsx` to hit `/api/auth/login`.
- [ ] Store JWT in `localStorage` or `HttpOnly` cookie.
- [ ] Handle session persistence and logout.

### 4.3. Feature Connection
- [ ] Connect **Report Issue** form to backend.
- [ ] Connect **Issue Feed/Map** to live data.
- [ ] Connect **Officer Dashboard** to assignments API.

---

## Phase 5: DevOps & Deployment

### 5.1. Dockerization
- [ ] Create `Dockerfile` for Backend.
- [ ] Create `Dockerfile` for Frontend.
- [ ] Create `docker-compose.yml` to orchestrate App, API, and DB.

### 5.2. Testing & CI/CD
- [ ] Write API tests using `Jest` + `Supertest`.
- [ ] Set up GitHub Actions for automated testing on push.

### 5.3. Deployment
- [ ] Deploy Backend (Render/Railway/AWS).
- [ ] Deploy Frontend (Vercel/Netlify).
- [ ] Deploy Database (Supabase/AWS RDS).
