# Olgnova Backend API

A comprehensive NestJS MongoDB backend application for Olgnova organization management system.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 👥 **User Management** - Admin user management with roles (Super Admin, Admin, Editor)
- 📝 **Content Management** - Publications, blogs, team members, programs
- 📋 **Dynamic Forms** - Google Forms-like form builder with response collection
- 🔍 **Audit Trail** - Complete audit logging system
- 🗑️ **Soft/Hard Delete** - Data recovery and permanent deletion options
- 📊 **Publication Workflow** - Review and approval process for publications
- 🚀 **Program Management** - Dynamic program creation with registration links

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 5+
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd olgnova-backend
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. **Start MongoDB**
\`\`\`bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using Docker Compose
docker-compose up -d mongodb
\`\`\`

5. **Run the application**
\`\`\`bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
\`\`\`

6. **Seed initial data**
\`\`\`bash
npm run seed
\`\`\`

### Using Docker Compose

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
\`\`\`

## API Documentation

### Authentication
- `POST /api/auth/login` - Admin login

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id/soft` - Soft delete user
- `DELETE /api/users/:id/hard` - Hard delete user
- `PATCH /api/users/:id/restore` - Restore deleted user

### Publications
- `GET /api/publications` - List publications (with status filter)
- `GET /api/publications/published` - Public published publications
- `POST /api/publications` - Create publication
- `PATCH /api/publications/:id/submit-review` - Submit for review
- `PATCH /api/publications/:id/approve` - Approve publication
- `PATCH /api/publications/:id/reject` - Reject publication
- `PATCH /api/publications/:id/publish` - Publish approved publication

### Programs
- `GET /api/programs` - List programs
- `GET /api/programs/active` - List active programs
- `POST /api/programs` - Create program with dynamic form
- `GET /api/programs/:id/registration-link` - Get registration link
- `POST /api/programs/apply/:token` - Submit application
- `GET /api/programs/:id/applications` - Get program applications

### Forms
- `GET /api/forms` - List forms
- `POST /api/forms` - Create dynamic form
- `GET /api/forms/:id` - Get form structure
- `POST /api/forms/:id/submit` - Submit form response
- `GET /api/forms/:id/submissions` - Get form submissions

### Blogs
- `GET /api/blogs` - List blogs
- `GET /api/blogs/published` - Public published blogs
- `POST /api/blogs` - Create blog
- `PATCH /api/blogs/:id/publish` - Publish blog
- `PATCH /api/blogs/:id/unpublish` - Unpublish blog

### Teams
- `GET /api/teams` - List team members
- `POST /api/teams` - Create team member
- `PATCH /api/teams/:id` - Update team member

### Enquiries
- `GET /api/enquiries` - List enquiries
- `POST /api/enquiries` - Create enquiry

### Subscriptions
- `GET /api/subscriptions` - List subscriptions
- `POST /api/subscriptions` - Create subscription
- `PATCH /api/subscriptions/unsubscribe/:email` - Unsubscribe

### Audit
- `GET /api/audit` - List audit logs
- `GET /api/audit/user/:userId` - Get user audit logs
- `GET /api/audit/resource/:resource` - Get resource audit logs

## User Roles

- **Super Admin** - Full access to all features
- **Admin** - Manage content and users (except super admin functions)
- **Editor** - Create and edit content, limited user management

## Form Builder

The dynamic form system supports:
- **Field Types**: Text, Email, Number, Textarea, Select, Radio, Checkbox, Date, File
- **Validation**: Required fields, custom validation rules
- **Response Collection**: Store and analyze form submissions
- **Integration**: Use in programs for application forms

## Publication Workflow

1. **Draft** - Initial creation by editors
2. **Pending Review** - Submitted for admin approval
3. **Approved/Rejected** - Admin decision with optional feedback
4. **Published** - Live on website

## Environment Variables

\`\`\`env
# Required
MONGODB_URI=mongodb://localhost:27017/olgnova
JWT_SECRET=your-super-secret-jwt-key

# Optional
PORT=3000
FRONTEND_URL=http://localhost:3000
\`\`\`

## Default Admin Account

After running the seed script:
- **Email**: admin@olgnova.com
- **Password**: admin123456
- **Role**: Super Admin

⚠️ **Important**: Change the default password in production!

## Development

\`\`\`bash
# Watch mode
npm run start:dev

# Debug mode
npm run start:debug

# Run tests
npm run test

# Run tests with coverage
npm run test:cov
\`\`\`

## Production Deployment

1. **Build the application**
\`\`\`bash
npm run build
\`\`\`

2. **Set production environment variables**
\`\`\`bash
export NODE_ENV=production
export MONGODB_URI=your-production-mongodb-uri
export JWT_SECRET=your-production-jwt-secret
\`\`\`

3. **Start the application**
\`\`\`bash
npm run start:prod
\`\`\`

## Security Features

- JWT authentication with configurable expiration
- Role-based access control
- Request rate limiting
- Input validation and sanitization
- Audit trail for all admin actions
- Soft delete for data recovery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
