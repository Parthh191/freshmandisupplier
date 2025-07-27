# Hackathon Project - Authentication System

A modern authentication system built with Next.js, Prisma, and PostgreSQL featuring attractive dark-themed login and signup pages.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 🎨 **Dark Theme UI**: Beautiful, modern dark-themed interface
- 👥 **User Types**: Support for Vendors and Suppliers
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔒 **Form Validation**: Client-side and server-side validation
- 🚀 **Fast Performance**: Built with Next.js 15 and optimized for speed

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom utilities

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# JWT Secret (generate a strong secret for production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. Database Setup

1. **Install Prisma CLI** (if not already installed):
   ```bash
   npm install -g prisma
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Run Database Migrations**:
   ```bash
   npx prisma db push
   ```

4. **Seed Initial Data** (optional):
   ```bash
   npx prisma db seed
   ```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
hackathon/
├── app/
│   ├── api/auth/
│   │   ├── login/route.js      # Login API endpoint
│   │   └── signup/route.js     # Signup API endpoint
│   ├── dashboard/page.js       # Dashboard page
│   ├── login/page.js           # Login page
│   ├── signup/page.js          # Signup page
│   └── page.js                 # Home page (redirects to login)
├── lib/
│   ├── auth.js                 # Authentication utilities
│   ├── prisma.js               # Prisma client configuration
│   └── utils.js                # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema
└── package.json
```

## Database Schema

The application uses the following main models:

- **User**: Core user information (name, email, phone, password)
- **UserType**: User roles (vendor/supplier)
- **Vendor**: Vendor-specific information (mandi name, location)
- **Supplier**: Supplier-specific information (business name, location)
- **Category**: Product categories
- **Product**: Product information
- **Order**: Order management

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Request/Response Examples

#### Signup Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "userType": "vendor"
}
```

#### Login Request
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": {
      "type": "vendor"
    }
  }
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Both client-side and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback

## Customization

### Styling
The application uses Tailwind CSS with a custom dark theme. You can modify the colors and styling in the component files.

### User Types
The system supports two user types:
- **Vendor**: Can browse and purchase products
- **Supplier**: Can list and sell products

You can extend this by adding more user types in the Prisma schema.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
# freshmandisupplier
