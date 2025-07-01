# 🚀 Look

A modern, full-stack web application that streamlines the job searching and application process. Built with cutting-edge technologies to provide an exceptional user experience for both job seekers and administrators.

![LOOK Banner](https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 👤 For Job Seekers
- **Seamless Registration & Login** - Create your account and access personalized dashboard
- **Browse Active Jobs** - Discover opportunities with detailed job descriptions
- **One-Click Applications** - Apply to jobs instantly with application tracking
- **Application Management** - Track status updates (Submitted, Interview, Rejected)
- **Responsive Design** - Perfect experience across all devices

### 👨‍💼 For Administrators
- **Comprehensive Admin Dashboard** - Manage all aspects of job postings
- **Job Posting Management** - Create, edit, activate/deactivate, and delete listings
- **Application Review System** - View and update application statuses
- **Real-time Analytics** - Track job posting performance and application metrics
- **Bulk Operations** - Efficiently manage multiple listings and applications

## 🛠️ Tech Stack

### Frontend
- **Angular 20** - Modern TypeScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming for Angular
- **Angular Router** - Client-side routing
- **HTTP Interceptors** - JWT token management

### Backend
- **ASP.NET Core 9** - High-performance web API
- **Entity Framework Core** - Object-relational mapping
- **SQL** - Lightweight database
- **JWT Authentication** - Secure token-based auth
- **BCrypt** - Password hashing

### Design & Development
- **Figma** - UI/UX design and prototyping
- **RESTful API** - Clean API architecture
- **CORS** - Cross-origin resource sharing
- **Swagger/OpenAPI** - API documentation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular SPA   │    │  ASP.NET Core   │    │   SQLite DB     │
│                 │    │      API        │    │                 │
│  • Components   │◄──►│  • Controllers  │◄──►│  • Users        │
│  • Services     │    │  • Services     │    │  • JobPostings  │
│  • Guards       │    │  • Models       │    │  • Applications │
│  • Interceptors │    │  • JWT Auth     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobsearch-pro
   ```

2. **Navigate to API directory**
   ```bash
   cd API
   ```

3. **Restore dependencies**
   ```bash
   dotnet restore
   ```

4. **Run the API**
   ```bash
   dotnet run
   ```
   
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to WEB directory**
   ```bash
   cd WEB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:4200`

## 📊 Database Schema

### Users Table
| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key |
| FirstName | string | User's first name |
| MiddleName | string | User's middle name (optional) |
| LastName | string | User's last name |
| Username | string | Unique username |
| PasswordHash | string | Hashed password |
| Role | enum | USER or ADMIN |
| CreatedAt | datetime | Account creation date |

### JobPostings Table
| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key |
| Title | string | Job title |
| CompanyName | string | Company name |
| Description | string | Job description |
| PostedDate | datetime | Date posted |
| Status | enum | Active or Inactive |

### Applications Table
| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key |
| UserId | int | Foreign key to Users |
| JobPostingId | int | Foreign key to JobPostings |
| Status | enum | Submitted, SelectedForInterview, Rejected |
| SubmittedDate | datetime | Application submission date |

## 🔐 Authentication & Authorization

- **JWT Token-based Authentication** - Secure stateless authentication
- **Role-based Access Control** - Separate permissions for users and admins
- **Password Hashing** - BCrypt for secure password storage
- **Route Guards** - Frontend protection for authenticated routes

### Default Admin Account
```
Username: admin
Password: admin123
```

## 🎨 Design System

The application features a modern, glassmorphism-inspired design with:

- **Color Palette**: Blue gradients with purple accents
- **Typography**: Inter font family for optimal readability
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and micro-interactions

## 📱 Screenshots

### User Dashboard
![User Dashboard](https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

### Admin Panel
![Admin Panel](https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Job Postings
- `GET /api/jobpostings` - Get all job postings
- `GET /api/jobpostings/{id}` - Get specific job posting
- `POST /api/jobpostings` - Create job posting (Admin only)
- `PUT /api/jobpostings/{id}` - Update job posting (Admin only)
- `DELETE /api/jobpostings/{id}` - Delete job posting (Admin only)

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications/apply/{jobId}` - Apply for job
- `PUT /api/applications/{id}/status` - Update application status (Admin only)
- `GET /api/applications/check/{jobId}` - Check if user applied

## 🧪 Testing

### Backend Testing
```bash
cd API
dotnet test
```

### Frontend Testing
```bash
cd WEB
npm test
```

## 📦 Deployment

### Backend Deployment
1. Publish the application:
   ```bash
   dotnet publish -c Release
   ```

2. Deploy to your preferred hosting service (Azure, AWS, etc.)

### Frontend Deployment
1. Build for production:
   ```bash
   ng build --prod
   ```

2. Deploy the `dist/` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - Angular & Tailwind CSS
- **Backend Development** - ASP.NET Core & Entity Framework
- **UI/UX Design** - Figma prototyping and design system
- **Database Design** - SQLite with Entity Framework migrations

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Contact the development team

---

<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-api-endpoints">API</a>
  </p>
</div>
