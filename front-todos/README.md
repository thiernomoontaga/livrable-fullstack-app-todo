# TodoMaster - Professional Task Management

A modern, feature-rich todo application built with React.js that connects to your Todo List API. Designed for professionals and teams who need efficient task management with collaboration features.

![TodoMaster](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=TodoMaster+Dashboard)

## 🚀 Features

### Core Functionality
- **CRUD Operations**: Complete task management with create, read, update, and delete operations
- **Task Assignment**: Assign tasks to team members with email-based user identification
- **Smart Permissions**: Users can only edit/delete tasks they created or are assigned to
- **Priority Management**: Set task priorities (Low, Medium, High) with visual indicators
- **Due Date Tracking**: Set deadlines with overdue notifications

### Media Support
- **Image Attachments**: Upload images to provide visual context for tasks
- **Audio Notes**: Record and attach up to 30-second audio notes
- **File Validation**: Automatic file type and size validation for uploads

### User Experience
- **Intuitive Dashboard**: Clean, modern interface with task statistics
- **Dual View System**: 
  - ✅ Owned Tasks (tasks you created)
  - ✅ Assigned Tasks (tasks assigned to you)
- **Real-time Search**: Filter tasks by title and description
- **Activity Logging**: Track all task changes and updates
- **Responsive Design**: Works perfectly on desktop and mobile devices

### Security & Authentication
- **JWT Authentication**: Secure login/register system
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Input Validation**: Client-side validation with proper error handling
- **Secure API Integration**: Token-based API communication

## 🛠 Tech Stack

### Frontend
- **React.js** (JavaScript/TypeScript)
- **React Context API** for state management
- **React Router** for navigation
- **TailwindCSS** for styling
- **Radix UI** components via shadcn/ui
- **Lucide React** for icons

### HTTP & API
- **Fetch API** for HTTP requests
- **JWT** for authentication
- **FormData** for file uploads
- **Error handling** with user-friendly messages

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── TaskCard.tsx    # Individual task card component
│   ├── CreateTaskDialog.tsx
│   ├── EditTaskDialog.tsx
│   ├── AssignTaskDialog.tsx
│   ├── TaskDetailsDialog.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Main application pages
│   ├── Index.tsx       # Landing page
│   ├── Auth.tsx        # Login/Register page
│   ├── Dashboard.tsx   # Main dashboard
│   └── NotFound.tsx    # 404 page
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   └── TodoContext.tsx # Todo management state
├── hooks/              # Custom React hooks
│   └── use-toast.ts    # Toast notifications
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Your Todo List API endpoint

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API Connection**
   
   Update the API base URL in both context files:
   - `src/context/AuthContext.tsx`
   - `src/context/TodoContext.tsx`
   
   Replace `https://your-api-endpoint.com/api` with your actual API URL:
   ```javascript
   const API_BASE_URL = 'https://your-api-endpoint.com/api';
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
# or
yarn build
```

## 🔌 API Integration

The application expects your backend API to provide the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Todos
- `GET /api/todos` - Fetch all todos for authenticated user
- `POST /api/todos` - Create new todo (with file upload support)
- `PUT /api/todos/:id` - Update todo (with file upload support)
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/todos/:id/activity` - Fetch activity logs

### Expected Data Formats

**User Object:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "avatar": "string (optional)"
}
```

**Todo Object:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "priority": "low | medium | high",
  "dueDate": "string | null",
  "createdBy": "string",
  "assignedTo": "string | null",
  "image": "string (optional)",
  "audioNote": "string (optional)",
  "createdAt": "string",
  "updatedAt": "string"
}
```

## 🎨 Design System

The application uses a comprehensive design system built with:
- **Semantic color tokens** for consistent theming
- **HSL color space** for better color manipulation
- **CSS custom properties** for dynamic theming
- **Tailwind CSS** for utility-first styling
- **Component variants** for different states

### Color Palette
- **Primary**: Professional blue (#4F46E5)
- **Success**: Productivity green (#10B981)  
- **Warning**: Attention orange (#F59E0B)
- **Destructive**: Error red (#EF4444)

## 📱 Features in Detail

### Dashboard
- **Statistics Cards**: Overview of total, completed, pending, and overdue tasks
- **Task Views**: Separate tabs for owned and assigned tasks
- **Search Functionality**: Real-time task filtering
- **User Profile**: Avatar display and logout functionality

### Task Management
- **Rich Task Creation**: Title, description, priority, due date, assignment
- **Media Attachments**: Image and audio file support
- **Permission-based Editing**: Smart access control
- **Activity Tracking**: Comprehensive logging of changes

### Authentication
- **Dual Forms**: Combined login/register interface
- **Input Validation**: Real-time form validation
- **Error Handling**: User-friendly error messages
- **Auto-redirect**: Seamless navigation based on auth state

## 🔐 Security Features

- **JWT Token Management**: Secure token storage and refresh
- **Input Validation**: Both client and server-side validation
- **File Upload Security**: Type and size validation
- **Protected Routes**: Authentication-gated pages
- **XSS Prevention**: Proper data sanitization

## 🚀 Performance Optimizations

- **Lazy Loading**: Code splitting for better initial load times
- **Optimized Images**: Responsive image loading
- **Efficient Re-renders**: Optimized React Context usage
- **Cached API Calls**: Smart data fetching strategies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

If you encounter any issues or need help:
1. Check the API connection configuration
2. Verify your backend API is running and accessible
3. Check browser developer tools for error messages
4. Ensure all required environment variables are set

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Team management features
- [ ] Advanced filtering and sorting
- [ ] Calendar integration
- [ ] Mobile app development
- [ ] Offline mode support
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for professional task management**