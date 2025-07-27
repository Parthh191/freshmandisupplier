# 🚀 FreshMandi - Production Deployment Guide

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- PM2 or similar process manager
- Nginx (for reverse proxy)
- SSL certificate
- Domain name

## 🔧 Environment Configuration

Create a `.env` file with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/freshmandi_db"

# JWT Configuration (Generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Environment
NODE_ENV="production"
```

## 🗄️ Database Setup

### 1. PostgreSQL Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql postgresql-server
```

### 2. Database Creation
```bash
sudo -u postgres psql
CREATE DATABASE freshmandi_db;
CREATE USER freshmandi_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE freshmandi_db TO freshmandi_user;
\q
```

### 3. Run Prisma Migrations
```bash
npm run db:migrate
npm run db:seed
```

## 🏗️ Application Deployment

### 1. Build the Application
```bash
npm install
npm run build
```

### 2. PM2 Configuration
Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'freshmandi',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 3. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 Nginx Configuration

Create `/etc/nginx/sites-available/freshmandi`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Proxy to Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static/ {
        alias /path/to/your/app/.next/static/;
        expires 365d;
        access_log off;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/freshmandi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Configuration

### 1. Firewall Setup
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Database Security
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add/modify these lines:
listen_addresses = 'localhost'
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB

# Edit pg_hba.conf for authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

## 📊 Monitoring & Logging

### 1. Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Log monitoring
pm2 logs freshmandi-ai

# Health check endpoint
curl https://yourdomain.com/api/health
```

### 2. Database Monitoring
```bash
# Install pgAdmin or use psql for monitoring
sudo apt install pgadmin4
```

### 3. System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        JWT_SECRET: ${{ secrets.JWT_SECRET }}
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/freshmandi
          git pull origin main
          npm install
          npm run build
          pm2 restart freshmandi
```

## 🧪 Testing in Production

### 1. Run API Tests
```bash
# Test all endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://yourdomain.com/api/health

# Test authentication
curl -X POST -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}' \
     https://yourdomain.com/api/auth/login
```

### 2. Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test configuration
cat > load-test.yml << EOF
config:
  target: 'https://yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/health"
          headers:
            Authorization: "Bearer YOUR_TOKEN"
EOF

# Run load test
artillery run load-test.yml
```

## 🔧 Maintenance

### 1. Database Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump freshmandi_db > backup_$DATE.sql
gzip backup_$DATE.sql
```

### 2. Log Rotation
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/freshmandi

/path/to/your/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### 3. Updates
```bash
# Update application
cd /path/to/freshmandi
git pull origin main
npm install
npm run build
pm2 restart freshmandi

# Update dependencies
npm audit fix
npm update
```

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check connection
   psql -h localhost -U freshmandi_user -d freshmandi_db
   ```

2. **Memory Issues**
   ```bash
   # Monitor memory usage
   free -h
   htop
   
   # Restart PM2 if needed
   pm2 restart freshmandi
   ```

3. **SSL Issues**
   ```bash
   # Check SSL certificate
   openssl s_client -connect yourdomain.com:443
   
   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
```

### 2. Caching
```bash
# Install Redis for caching
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
```

### 3. CDN Configuration
- Set up Cloudflare or similar CDN
- Configure static asset caching
- Enable compression

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrated and seeded
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] CI/CD pipeline working
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated

## 📞 Support

For production support:
- Monitor application logs: `pm2 logs freshmandi`
- Check system resources: `htop`, `df -h`, `free -h`
- Database monitoring: `pg_stat_activity`
- Network monitoring: `netstat -tulpn`

---

**Note**: This deployment guide ensures your FreshMandi application runs securely and efficiently in production. All APIs are tested and ready for real-world usage! 🚀 