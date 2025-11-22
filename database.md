## 🗺️ **Entity Relationship Overview**

Users ───────┐
              │1          *│
              └──── Issues ───────┐
                                   │1          *│
                                   └── Assignments ── Officers


Each issue is:

- Created by a **Citizen (User)**
    
- Assigned to an **Officer**
    
- Can have multiple **Status updates** and **Feedbacks**
    

---

## 🧱 **Core Tables**

### 1. `users`

Stores information for both **citizens** and **officers** (differentiated by `role`).

|Field|Type|Description|
|---|---|---|
|`id`|`UUID PRIMARY KEY`|Unique identifier|
|`name`|`VARCHAR(100)`|User’s name|
|`email`|`VARCHAR(150)`|Email (unique)|
|`phone`|`VARCHAR(20)`|Optional phone number|
|`role`|`ENUM('citizen','officer','admin')`|Role of the user|
|`profile_photo`|`TEXT`|Firebase storage URL|
|`area`|`VARCHAR(150)`|Optional area (for officers)|
|`created_at`|`TIMESTAMP DEFAULT now()`|Account creation time|
|`updated_at`|`TIMESTAMP`|Last update time|

**Indexes:**

`CREATE INDEX idx_users_role ON users(role);`

---

### 2. `issues`

Each record represents a **reported problem** by a citizen.

|Field|Type|Description|
|---|---|---|
|`id`|`UUID PRIMARY KEY`|Unique issue ID|
|`user_id`|`UUID REFERENCES users(id)`|Citizen who reported|
|`photo_url`|`TEXT`|Uploaded image (Firebase)|
|`category`|`ENUM('road','waste','electricity','water','other')`|Problem type|
|`description`|`TEXT`|User input|
|`ai_summary`|`TEXT`|OpenAI auto-generated summary|
|`location`|`GEOGRAPHY(Point, 4326)`|GPS coordinates|
|`address`|`TEXT`|Reverse geocoded address|
|`status`|`ENUM('pending','in_progress','resolved','rejected') DEFAULT 'pending'`|Status|
|`priority`|`ENUM('low','medium','high') DEFAULT 'medium'`|Set automatically or manually|
|`created_at`|`TIMESTAMP DEFAULT now()`|Report creation time|
|`updated_at`|`TIMESTAMP`|Last update|

**Indexes:**

`CREATE INDEX idx_issues_location ON issues USING GIST (location); CREATE INDEX idx_issues_status ON issues(status); CREATE INDEX idx_issues_category ON issues(category);`

---

### 3. `officers`

Each officer represents a local authority responsible for a geographic area.

|Field|Type|Description|
|---|---|---|
|`id`|`UUID PRIMARY KEY`|Unique officer ID|
|`user_id`|`UUID REFERENCES users(id)`|Linked to users table|
|`designation`|`VARCHAR(100)`|Rank/position|
|`department`|`VARCHAR(100)`|Department name|
|`area_of_responsibility`|`GEOGRAPHY(Polygon, 4326)`|Geofence for assigned region|
|`active`|`BOOLEAN DEFAULT true`|Employment status|
|`created_at`|`TIMESTAMP DEFAULT now()`|Created timestamp|

---

### 4. `assignments`

Tracks which officer is handling each issue.

|Field|Type|Description|
|---|---|---|
|`id`|`UUID PRIMARY KEY`|Unique assignment ID|
|`issue_id`|`UUID REFERENCES issues(id)`|Assigned issue|
|`officer_id`|`UUID REFERENCES officers(id)`|Assigned officer|
|`assigned_at`|`TIMESTAMP DEFAULT now()`|When assigned|
|`resolved_at`|`TIMESTAMP`|When resolved|
|`status_note`|`TEXT`|Officer comments|
|`status`|`ENUM('assigned','in_progress','resolved','rejected') DEFAULT 'assigned'`|Status|

**Indexes:**

`CREATE INDEX idx_assignments_status ON assignments(status);`

---

### 5. `feedback`

Stores feedback from citizens after resolution.

|Field|Type|Description|
|---|---|---|
|`id`|`UUID PRIMARY KEY`|Feedback ID|
|`issue_id`|`UUID REFERENCES issues(id)`|Linked issue|
|`user_id`|`UUID REFERENCES users(id)`|Feedback author|
|`rating`|`SMALLINT CHECK (rating BETWEEN 1 AND 5)`|1–5 star rating|
|`comment`|`TEXT`|Optional comment|
|`created_at`|`TIMESTAMP DEFAULT now()`|Feedback timestamp|

---

### 6. `notifications`

Logs alerts sent to users/officers.

|Field|Type|Description|
|---|---|---|
|`id`|`UUID PRIMARY KEY`|Notification ID|
|`user_id`|`UUID REFERENCES users(id)`|Recipient|
|`title`|`VARCHAR(200)`|Notification title|
|`message`|`TEXT`|Notification content|
|`type`|`ENUM('issue_update','assignment','system')`|Type|
|`is_read`|`BOOLEAN DEFAULT false`|Read status|
|`created_at`|`TIMESTAMP DEFAULT now()`|When sent|

---

### 7. `activity_logs`

Keeps audit trails for transparency.

|Field|Type|Description|
|---|---|---|
|`id`|`UUID PRIMARY KEY`|Log ID|
|`user_id`|`UUID REFERENCES users(id)`|Actor|
|`action`|`VARCHAR(200)`|e.g., “Status updated”, “Feedback added”|
|`entity`|`VARCHAR(100)`|e.g., “issue”, “assignment”|
|`entity_id`|`UUID`|Reference to entity|
|`timestamp`|`TIMESTAMP DEFAULT now()`|Time of action|

---

### 8. `system_settings` _(optional)_

Stores configurable system options.

|Field|Type|Description|
|---|---|---|
|`id`|`SERIAL PRIMARY KEY`||
|`key`|`VARCHAR(100)`|Setting name|
|`value`|`TEXT`|Setting value|
|`updated_at`|`TIMESTAMP DEFAULT now()`|Last update|

---

## ⚙️ **Relationships Summary**

- **users → issues** → One user can report many issues.
    
- **issues → assignments** → One issue can have multiple assignments (reassignments).
    
- **officers → assignments** → One officer can handle multiple issues.
    
- **issues → feedback** → One issue can have multiple feedback entries.
    
- **users → notifications** → Each user can receive multiple notifications.
    

---

## 🧠 **AI & Geo Notes**

- Store **image tags** (from Vision API) in a separate table if you want analytics:
    
    `CREATE TABLE issue_tags (   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   issue_id UUID REFERENCES issues(id),   tag VARCHAR(100) );`
    
- Use **PostGIS functions**:
    
    `SELECT * FROM issues WHERE ST_DWithin(location, ST_MakePoint(:lng, :lat)::geography, 2000);`
    
    → Finds issues within 2 km of user.
    

---

## 📦 **Schema Diagram (Text View)**

users (1)───< issues (1)───< assignments >───(1) officers
                   │
                   │
                   ├──< feedback
                   └──< notifications