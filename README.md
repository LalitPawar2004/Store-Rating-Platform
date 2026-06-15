# FullStack Rating Platform

A role-based Store Rating Platform built with **React.js**, **Express.js**, and **MySQL**. Users can rate stores, administrators can manage users and stores, and store owners can track ratings for their stores.

## Tech Stack

* Frontend: React.js
* Backend: Express.js
* Database: MySQL
* Authentication: JWT + bcrypt

## Features

### Admin

* Dashboard with total users, stores, and ratings
* Manage users and stores
* View and filter users/stores

### Normal User

* Sign up and login
* Search stores by name or address
* Submit and update ratings (1–5)
* Change password

### Store Owner

* View average store rating
* View users who submitted ratings
* Change password

## Project Structure

```text
rating-platform/
├── database/
├── backend/
└── frontend/
```

## Quick Start

### 1. Setup Database

Run:

```sql
database/schema.sql
```

### 2. Start Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## Default Admin Account

```text
Email: admin@platform.test
Password: Admin@123
```

## Validation Rules

* Name: 20–60 characters
* Address: Maximum 400 characters
* Password: 8–16 characters, at least 1 uppercase letter and 1 special character
* Email: Valid email format

---
