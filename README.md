# Fullstack Todo List Application

A modern, fullstack todo list application with a React frontend and Node.js/Express backend, featuring user authentication, task management, and collaboration capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based login and registration
- **Task Management**: Complete CRUD operations for todos
- **Task Assignment**: Assign tasks to team members
- **Priority Levels**: Low, Medium, High priority tasks
- **Due Dates**: Set deadlines with tracking
- **Activity Logging**: Track all task changes
- **File Attachments**: Support for images and audio notes
- **Responsive Design**: Works on desktop and mobile

### Security & Permissions
- **Role-based Access**: Users can only modify their own or assigned tasks
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Client and server-side validation
- **Protected Routes**: Automatic redirection for unauthenticated users

## 🛠 Tech Stack

### Frontend
- **React.js** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Radix UI** components (via shadcn/ui)
- **React Router** for navigation
- **React Context** for state management
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **Prisma** ORM with PostgreSQL
- **JWT** for authentication
- **Zod** for validation
- **bcryptjs** for password hashing

## 📁 Project Structure

```
livrable-todo-liste-fullstack/
├── front-todos/              # React frontend application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Application pages
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities
│   ├── package.json
│   └── vite.config.ts
├── todo-list-api/            # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access
│   │   ├── middlewares/     # Auth & error handling
│   │   ├── routes/          # API routes
│   │   └── utils/           # Helpers
│   ├── prisma/              # Database schema & migrations
│   ├── package.json
│   └── tsconfig.json
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** database
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd livrable-todo-liste-fullstack
   ```

2. **Set up the Backend**
   ```bash
   cd todo-list-api

   # Install dependencies
   npm install

   # Copy environment file
   cp .env.example .env

   # Edit .env with your database credentials
   # DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
   # JWT_SECRET="your-super-secret-jwt-key"
   # PORT=3000

   # Generate Prisma client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate

   # Seed the database with sample data
   npm run prisma:seed
   ```

3. **Set up the Frontend**
   ```bash
   cd ../front-todos

   # Install dependencies
   npm install

   # The frontend is configured to connect to localhost:3000 by default
   # If your backend runs on a different port, update the API_BASE_URL
   # in src/context/AuthContext.jsx and src/context/TodoContext.jsx
   ```

## 🏃 Running the Application

### Development Mode

1. **Start the Backend** (in one terminal)
   ```bash
   cd todo-list-api
   npm run dev
   ```
   Backend will run on `http://localhost:3000`

2. **Start the Frontend** (in another terminal)
   ```bash
   cd front-todos
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or next available port)

### Production Build

1. **Build the Frontend**
   ```bash
   cd front-todos
   npm run build
   ```

2. **Build the Backend**
   ```bash
   cd todo-list-api
   npm run build
   npm start
   ```

## 🧪 Testing the Application

### Sample Users (from database seed)
- **John Doe**: `john.doe@example.com` / `password123`
- **Jane Smith**: `jane.smith@example.com` / `password456`
- **Bob Wilson**: `bob.wilson@example.com` / `password789`

### Testing Steps

1. **Open the frontend** at `http://localhost:5173`
2. **Register a new account** or **login** with existing credentials
3. **Create todos** with different priorities and due dates
4. **Assign tasks** to other users
5. **Mark tasks complete** and view activity logs
6. **Test file uploads** (images and audio notes)

### API Testing

You can also test the API directly using tools like Postman or curl:

```bash
# Login to get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"password123"}'

# Use the token for authenticated requests
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📖 Documentation

For detailed documentation:

- **[Backend API Documentation](./todo-list-api/README.md)** - Complete API reference, endpoints, and examples
- **[Frontend Documentation](./front-todos/README.md)** - Component structure, features, and setup

## 🔧 Configuration

### Backend Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

### Frontend Configuration
Update the `API_BASE_URL` in these files if your backend runs on a different URL:
- `front-todos/src/context/AuthContext.jsx`
- `front-todos/src/context/TodoContext.jsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Verify DATABASE_URL in `.env`
   - Check database user permissions

2. **Frontend Can't Connect to Backend**
   - Ensure backend is running on port 3000
   - Check CORS settings
   - Verify API_BASE_URL configuration

3. **Authentication Issues**
   - Check JWT_SECRET in backend `.env`
   - Ensure tokens aren't expired
   - Verify token format in requests

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Getting Help

If you encounter issues:
1. Check the detailed READMEs in `todo-list-api/` and `front-todos/`
2. Verify all prerequisites are installed
3. Check browser developer tools for frontend errors
4. Check backend logs for API errors
5. Ensure all environment variables are set correctly

---

**Built with ❤️ for efficient task management and team collaboration**