# 🔍 Look – Job Application Tracking System

> 🎓 Internship Project 2024/2025  
> 👨‍🎓 Class: 11V  
> 🧑‍💻 Developer: Denis Yusein

---

## 🎯 Project Overview

**Look** is a modern web-based system developed to streamline the process of job searching and application tracking. It is designed for two main types of users:

- **Regular users**, who are searching for job opportunities and want to track the status of their applications.
- **Administrators (HR professionals)**, who manage job postings and review candidate applications.

The platform ensures a simple and effective interface for applying to jobs, managing postings, and processing candidate statuses.

---

## 🛠️ Technologies Used

| Layer        | Technology              |
|--------------|--------------------------|
| 🎨 Design     | [Figma](https://figma.com) |
| 💻 Frontend   | [Angular](https://angular.io/) |
| 🔧 Backend    | [C# (.NET Core)](https://dotnet.microsoft.com/en-us/) |
| 🗄️ Database   | [SQL Server](https://www.microsoft.com/en-us/sql-server/) |

---

## 🌐 Key Features

### 👤 User Role (USER)

- 🔐 Register and log in
- 🔎 Browse active job listings
- 📩 Apply for a job (only once per position)
- 📊 View and track your submitted applications and statuses

### 🛠️ Admin Role (ADMIN)

- 🔐 Log in with a pre-created admin account
- 📝 Create, edit, and delete job postings
- 👀 View and manage all user applications
- 🛠️ Update application statuses (e.g., Submitted → Interview → Rejected)

### 📄 Job Posting Details

Each job posting contains:

- Position title (e.g., "Programmer", "Office Assistant")
- Company name
- Short description (responsibilities, requirements, work conditions)
- Date posted
- Status: **Active** (open) / **Inactive** (closed)

### ✅ Application Status

Each application includes:

- Linked job and user
- Initial status: **Submitted**
- Updated by admin to: **Interview** or **Rejected**

---

## 🔐 Roles & Permissions

| Role    | Access Level                            | Restrictions                        |
|---------|------------------------------------------|-------------------------------------|
| `USER`  | View jobs, apply, track own applications | Cannot manage job postings          |
| `ADMIN` | Full access to all jobs and applications | Cannot apply to jobs                |

🛑 Unauthorized actions trigger an error message and block access.  
✔️ All user inputs are validated (required fields, text length, etc.).

---

## 📋 Business Rules

- A user can apply to **multiple jobs**.
- A user can apply to the **same job only once**.
- A job can have **unlimited applications** from different users.
- Users **can only view** their own applications.
- Admins **can view all** jobs and applications.
- Admins **cannot apply** for jobs.
- Admin accounts are **pre-created manually** by system staff or teachers.

---

## 🧪 Example Workflow

1. **Admin** logs in and creates a job post (e.g., "Frontend Developer").
2. **User** registers and logs in.
3. The user browses job listings and applies to one.
4. The system records an application with status `Submitted`.
5. The **admin** later reviews applications and updates the status.
6. The **user** logs back in and sees the updated status of their application.

---

## 🎨 UI Color Palette

| Purpose       | Color Name | Hex Code  |
|---------------|------------|-----------|
| Primary       | Dark Blue  | `#0A2342` |
| Accent        | Blue       | `#1779FF` |

Used consistently across UI for a modern and professional look.

---

## 📁 Project Structure (Simplified)

Look/
├── backend/ # ASP.NET Core API
│ ├── Controllers/
│ ├── Models/
│ ├── Services/
│ └── Program.cs
├── frontend/ # Angular app
│ ├── src/
│ │ ├── app/
│ │ │ ├── components/
│ │ │ ├── pages/
│ │ │ └── services/
│ └── angular.json
├── database/ # SQL scripts for schema and seed data
├── designs/ # Figma design files
└── README.md


---

## 🚀 Getting Started

### 🔧 Backend (C# .NET Core)

```bash
cd backend
dotnet restore
dotnet run
cd frontend
npm install
ng serve
