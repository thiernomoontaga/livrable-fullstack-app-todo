# Todo List API - Complete Implementation

A production-ready Todo List API built with modern technologies and clean architecture principles.

## 🚀 Features

- ✅ **Complete CRUD Operations** for todos with proper permissions
- ✅ **User Authentication** with JWT tokens
- ✅ **Task Assignment** - Assign todos to other users
- ✅ **Activity Logging** - Track all todo actions with timestamps
- ✅ **Input Validation** using Zod schemas
- ✅ **Pagination** for efficient data retrieval
- ✅ **Error Handling** with consistent API responses
- ✅ **Security** with Helmet and CORS
- ✅ **Clean Architecture** following SOLID principles

## 🛠 Tech Stack

- **Backend**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT
- **Security**: Helmet, CORS, bcryptjs

## 📁 Project Structure

```
todo-list-api/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── middlewares/     # Authentication & error handling
│   ├── routes/         # API routes
│   ├── utils/          # Validation, database connection
│   ├── types/          # TypeScript interfaces
│   └── index.ts        # Application entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts        # Database seeding
├── package.json        # Dependencies & scripts
├── tsconfig.json      # TypeScript config
└── README.md          # Detailed documentation
```

## 🗄 Database Schema

- **User**: id, email, password, name, timestamps
- **Todo**: id, title, description, completed, ownerId, assignedToId, timestamps
- **TodoLog**: id, action, todoId, userId, timestamp, details

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd todo-list-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database connection:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/db_api_todo"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```

4. **Generate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database with sample data**:
   ```bash
   npm run prisma:seed
   ```

7. **Start the development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "user@example.com", "name": "John Doe" },
    "token": "jwt-token-here"
  }
}
```

### Todo Endpoints

**All todo endpoints require authentication. Include the JWT token:**
```
Authorization: Bearer <jwt-token>
```

#### Create Todo
```http
POST /api/todos
{
  "title": "Complete project",
  "description": "Finish the todo API implementation"
}
```

#### Get Owned Todos (Paginated)
```http
GET /api/todos?page=1&limit=10
```

#### Get Assigned Todos (Paginated)
```http
GET /api/todos/assigned?page=1&limit=10
```

#### Update Todo (Owner only)
```http
PUT /api/todos/1
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": false
}
```

#### Assign Todo to User (Owner only)
```http
PATCH /api/todos/1/assign
{
  "assignedToId": 2
}
```

#### Mark Todo Complete (Owner or Assigned user)
```http
PATCH /api/todos/1/complete
```

#### Delete Todo (Owner only)
```http
DELETE /api/todos/1
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": {
    "data": [...],
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

## 🧪 Testing the API

### Sample Test Users (from seed data)
- **John Doe**: john.doe@example.com / password123
- **Jane Smith**: jane.smith@example.com / password456
- **Bob Wilson**: bob.wilson@example.com / password789

### Testing Steps

1. **Register/Login to get JWT token**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john.doe@example.com","password":"password123"}'
   ```

2. **Create a todo**:
   ```bash
   curl -X POST http://localhost:3000/api/todos \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"title":"Test Todo","description":"Testing the API"}'
   ```

3. **Get your todos**:
   ```bash
   curl -X GET http://localhost:3000/api/todos \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

4. **Update the todo**:
   ```bash
   curl -X PUT http://localhost:3000/api/todos/1 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"title":"Updated Test Todo","completed":true}'
   ```

5. **Assign todo to another user**:
   ```bash
   curl -X PATCH http://localhost:3000/api/todos/1/assign \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"assignedToId":2}'
   ```

6. **Mark todo complete (as assigned user)**:
   ```bash
   # Login as Jane Smith first to get her token
   curl -X PATCH http://localhost:3000/api/todos/1/complete \
     -H "Authorization: Bearer JANE_JWT_TOKEN"
   ```

### Using Postman/Insomnia

1. Import the API endpoints
2. Set base URL to `http://localhost:3000`
3. For authenticated endpoints, add header: `Authorization: Bearer <token>`

## 🔐 Permissions

- **Create Todo**: Any authenticated user
- **View Owned Todos**: Todo owner only
- **View Assigned Todos**: Assigned user only
- **Update Todo**: Todo owner only
- **Assign Todo**: Todo owner only
- **Mark Complete**: Todo owner or assigned user
- **Delete Todo**: Todo owner only

## 📜 Available Scripts

- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run dev` - Start development server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Open Prisma Studio

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` file
- Check user permissions on the database

### Authentication Issues
- Ensure JWT_SECRET is set in `.env`
- Verify token format: `Bearer <token>`
- Check token expiration (1 hour by default)

### Port Issues
- Default port is 3000
- Change PORT in `.env` if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using TypeScript, Express, Prisma & PostgreSQL**