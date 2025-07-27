# FreshMandi - Street Food Supply Chain Platform

[![CI/CD Pipeline](https://github.com/yourusername/freshmandi/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourusername/freshmandi/actions/workflows/ci-cd.yml)
[![Deployed on Vercel](https://vercel.com/button)](https://freshmandi.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive marketplace platform connecting street food vendors with quality suppliers. Built for the Indian street food ecosystem with bulk pricing, local delivery, and business management tools.

## 🚀 Features

### For Street Food Vendors
- **Bulk Pricing**: Save money with volume discounts
- **Local Delivery**: Quick delivery within your area
- **Quality Assured**: All products are quality checked
- **24/7 Availability**: Order anytime, anywhere
- **Business Growth**: Track spending and manage inventory

### For Suppliers
- **Vendor Network**: Reach 2000+ street food vendors
- **Inventory Management**: Easy product and category management
- **Analytics Dashboard**: Track sales and performance
- **Order Management**: Handle incoming orders efficiently
- **Business Growth**: Expand your market reach

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon/Supabase)
- **Authentication**: JWT, NextAuth.js
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Vercel account (for deployment)

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/freshmandi.git
cd freshmandi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# Run development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Vercel (for production)
VERCEL_ORG_ID="your-vercel-org-id"
VERCEL_PROJECT_ID="your-vercel-project-id"
```

## 🚀 Deployment

### Automatic Deployment (Recommended)

The project includes a comprehensive CI/CD pipeline that automatically deploys to Vercel:

1. **Push to `main` branch** → Production deployment
2. **Pull Request to `main`** → Preview deployment
3. **Push to `develop` branch** → Preview deployment

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel@latest

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📊 Database Schema

The platform uses a comprehensive database schema with:

- **Users**: Authentication and role management
- **Suppliers**: Business profiles and product management
- **Vendors**: Street food vendor profiles and order history
- **Products**: Inventory with bulk pricing and delivery options
- **Orders**: Order management for both suppliers and vendors
- **Categories**: Product categorization
- **Notifications**: Real-time notifications system

## 🎯 Street Food Categories

- **Raw Materials**: Flour, rice, spices, oils
- **Equipment & Utensils**: Tawa, kadai, serving plates
- **Packaging Materials**: Paper plates, plastic bags, foil
- **Fresh Produce**: Vegetables, fruits, herbs
- **Spices & Seasonings**: Authentic Indian spices
- **Dairy & Eggs**: Milk, paneer, eggs
- **Grains & Flours**: Rice, wheat, specialty flours
- **Oils & Ghee**: Cooking oils and clarified butter

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS policy enforcement
- Security headers configuration
- Automatic vulnerability scanning

## 📈 Performance

- **Lighthouse Score**: ≥ 80 (Performance, Best Practices, SEO)
- **Accessibility**: ≥ 90
- **Core Web Vitals**: Optimized for all metrics
- **Bundle Size**: Optimized with Next.js 15
- **Database**: Connection pooling and query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Indian street food vendors
- Inspired by the vibrant street food culture
- Designed to solve real-world supply chain challenges

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/freshmandi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/freshmandi/discussions)

---

**Made with ❤️ for Indian Street Food Vendors**
