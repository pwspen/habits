Database (SQLite, SQLAlchemy ORM)
    users
    id            INT PK (autoincrement)
    email         TEXT UNIQUE NOT NULL
    pwhash        TEXT NOT NULL          ― placeholder until auth added
    timezone      TEXT NOT NULL          ― “Continent/City”

    habits (definition)
    id            INT PK
    user_id       INT  FK → users.id
    name          TEXT NOT NULL
    type          TEXT CHECK (type IN ('boolean','numeric'))
    polarity      TEXT CHECK (polarity IN ('good','bad'))
    start_value   INT  NOT NULL          ― initial count / 0-or-1
    target        INT  NOT NULL          ― numeric goal / 1 for boolean
    period        TEXT CHECK (period IN ('day','week','month','year'))
    active        BOOL DEFAULT 1

    habit_records (value per period)
    id            INT PK
    habit_id      INT FK → habits.id
    date_start    DATE          ― canonical start of period in user TZ
    period        TEXT CHECK (…) ― copied from habit for convenience
    value         INT NOT NULL
    locked        BOOL DEFAULT 0

Relationships: users 1-N habits, habits 1-N habit_records.

API (FastAPI)
    GET  /dashboard
    → list of habits + current record for each.
    POST /habits
    PUT  /habits/{habit_id}
    → create / edit definition (400 if editing locked record’s habit).
    PUT  /records/{record_id}
    → update value (409 if locked).
    All mutating endpoints return same payload as GET /dashboard for now.
Background task
Daily job (per user.timezone):
    Lock every current record whose period ends.
    Insert a new habit_record (value = start_value) for each active habit.
Frontend (React + TS + Tailwind)
• Dashboard with rows: [habit name]  [check/x] | [– value +]
• Top bar: Add Habit, Edit toggle.
• Modal shared by create/edit.
• Optimistic UI → reconcile with dashboard payload.
Road-map items (post-MVP)
• Auth: email + password → JWT / session cookie.
• Partial payload responses / caching (ETag).
• Analytics: streaks, charts.
• Mobile PWA shell.
• Migration from SQLite to Postgres for multi-tenant scale.