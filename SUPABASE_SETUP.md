# How to Create a Supabase Database

Follow these steps to set up a free PostgreSQL database on Supabase and connect it to your project.

## Step 1: Create a Supabase Account
1.  Go to [supabase.com](https://supabase.com/).
2.  Click **"Start your project"**.
3.  Sign in with GitHub (recommended) or create an account.

## Step 2: Create a New Project
1.  Once logged in, click **"New Project"**.
2.  Select your **Organization** (if asked).
3.  **Name:** Enter a name (e.g., `CivicConnect`).
4.  **Database Password:**
    *   Click "Generate a password" or type a strong one.
    *   ⚠️ **IMPORTANT:** Copy this password and save it somewhere safe immediately. You cannot see it again.
5.  **Region:** Choose a region close to you (e.g., `Mumbai`, `Singapore`, `US East`).
6.  Click **"Create new project"**.
7.  Wait a few minutes for the database to provision (it will say "Setting up project").

## Step 3: Get the Connection String
1.  Once the project is ready (green "Active" badge), look at the left sidebar.
2.  Click on the **Settings** icon (cogwheel) at the bottom of the sidebar.
3.  Click on **"Database"**.
4.  Scroll down to the **"Connection parameters"** section.
5.  Look for **"Connection String"** and ensure the **"URI"** tab is selected.
6.  Copy the string. It will look like this:
    ```
    postgresql://postgres:[YOUR-PASSWORD]@db.xyz.supabase.co:5432/postgres
    ```

## Step 4: Configure Your Project
1.  Open your project in VS Code.
2.  Open the file `e:/Mittu/Projects/final/server/.env`.
3.  Paste the copied string into the `DATABASE_URL` field.
4.  **Replace `[YOUR-PASSWORD]`** with the actual password you saved in Step 2.
    *   *Example:* `postgresql://postgres:MySecretPass123@db.xyz.supabase.co:5432/postgres`
5.  Save the file.

## Step 5: Verify
1.  Run `npx prisma migrate dev --name init` in your terminal (inside `server` folder) to verify the connection works.
