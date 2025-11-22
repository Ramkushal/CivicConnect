- [x] Initialize Prisma: `npx prisma init`.
- [x] Configure `DATABASE_URL` in `.env`.

### 1.3. Define Database Schema
- [x] Translate the schema from `PROJECT_OVERVIEW.md` into `prisma/schema.prisma`.
- [x] Define models: `User`, `Officer`, `Issue`, `Assignment`, `Comment`, `Resolution`.
- [x] Run migration: `npx prisma migrate dev --name init`.

---

## Phase 2: API Development (Express.js)

### 2.1. Authentication Module
- [x] Implement JWT-based authentication.
- [x] Create middleware: `authMiddleware` (verify token), `rbacMiddleware` (check roles).
- [x] Endpoints:
    - `POST /api/auth/register` (Citizens only)
    - `POST /api/auth/login`
    - `GET /api/auth/me`

### 2.2. User & Officer Management
- [x] Endpoints:
    - `GET /api/users/profile`
    - `PUT /api/users/profile`
    - `GET /api/officers` (Admin/Public)
    - `POST /api/officers` (Admin only - create officer accounts)

### 2.3. Issue Management
- [x] Endpoints:
    - `POST /api/issues` (Report issue + Image upload)
    - `GET /api/issues` (Filter by status, category, location)
    - `GET /api/issues/:id`
    - `PUT /api/issues/:id/upvote`

### 2.4. Assignment & Resolution Workflow
- [x] Endpoints:
    - `POST /api/assignments` (Assign officer)
    - `GET /api/assignments/my-assignments` (Officer only)
    - `PUT /api/issues/:id/status` (Update status)
    - `POST /api/resolutions` (Resolve issue + Proof image)
- [x] Initialize Prisma: `npx prisma init`.
- [x] Configure `DATABASE_URL` in `.env`.

### 1.3. Define Database Schema
- [x] Translate the schema from `PROJECT_OVERVIEW.md` into `prisma/schema.prisma`.
- [x] Define models: `User`, `Officer`, `Issue`, `Assignment`, `Comment`, `Resolution`.
- [x] Run migration: `npx prisma migrate dev --name init`.

---

## Phase 2: API Development (Express.js)

### 2.1. Authentication Module
- [x] Implement JWT-based authentication.
- [x] Create middleware: `authMiddleware` (verify token), `rbacMiddleware` (check roles).
- [x] Endpoints:
    - `POST /api/auth/register` (Citizens only)
    - `POST /api/auth/login`
    - `GET /api/auth/me`

### 2.2. User & Officer Management
- [x] Endpoints:
    - `GET /api/users/profile`
    - `PUT /api/users/profile`
    - `GET /api/officers` (Admin/Public)
    - `POST /api/officers` (Admin only - create officer accounts)

### 2.3. Issue Management
- [x] Endpoints:
    - `POST /api/issues` (Report issue + Image upload)
    - `GET /api/issues` (Filter by status, category, location)
    - `GET /api/issues/:id`
    - `PUT /api/issues/:id/upvote`

### 2.4. Assignment & Resolution Workflow
- [x] Endpoints:
    - `POST /api/assignments` (Assign officer)
    - `GET /api/assignments/my-assignments` (Officer only)
    - `PUT /api/issues/:id/status` (Update status)
    - `POST /api/resolutions` (Resolve issue + Proof image)

---

## Phase 3: Real-time & Advanced Features

### 3.1. Real-time Updates (Socket.io)
- [x] Install `socket.io` on server and `socket.io-client` on client.

### 5.3. Deployment
- [x] Deploy Backend (Render/Railway/AWS) - Configured via `render.yaml`.
- [x] Deploy Frontend (Vercel/Netlify) - Configured via `vercel.json`.
- [x] Deploy Database (Supabase/AWS RDS) - Existing Supabase instance.
