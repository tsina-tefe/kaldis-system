# Plesk Deployment Guide for Company System

## Prerequisites

### Server Requirements
- **PHP 8.2+** (required by your Laravel app)
- **MySQL/MariaDB** database
- **Node.js 18+** (for building React assets)
- **Composer** (for PHP dependencies)
- **Git** (for deployment)

### Plesk Configuration
1. Enable PHP 8.2+ in Plesk
2. Enable Node.js support
3. Create a MySQL database
4. Set up domain/subdomain

## Deployment Steps

### 1. Initial Setup in Plesk

1. **Create Domain/Subdomain**
   - Go to Plesk Panel → Domains
   - Add your domain or subdomain
   - Set document root to `/httpdocs` or `/public_html`

2. **Enable PHP 8.2+**
   - Go to PHP Settings
   - Select PHP 8.2 or higher
   - Enable required extensions:
     - `pdo_mysql`
     - `mbstring`
     - `openssl`
     - `tokenizer`
     - `xml`
     - `ctype`
     - `json`
     - `bcmath`
     - `fileinfo`

3. **Enable Node.js**
   - Go to Node.js Settings
   - Enable Node.js support
   - Set Node.js version to 18+

4. **Create Database**
   - Go to Databases
   - Create new MySQL database
   - Note down database credentials

### 2. Upload and Configure Application

1. **Upload Files**
   - Upload your project files to the domain's document root
   - OR use Git deployment (recommended)

2. **Git Deployment (Recommended)**
   ```bash
   # SSH into your server
   cd /var/www/vhosts/yourdomain.com/httpdocs
   git clone https://github.com/yourusername/company-system-main.git .
   ```

3. **Set Document Root**
   - In Plesk, set document root to `/httpdocs/public` (not `/httpdocs`)
   - This is crucial for Laravel security

### 3. Environment Configuration

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Configure .env for production**
   ```env
   APP_NAME="Company System"
   APP_ENV=production
   APP_KEY=base64:your_generated_key_here
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password

   # Add other production settings...
   ```

### 4. Install Dependencies and Build

1. **Install PHP dependencies**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

2. **Install Node.js dependencies**
   ```bash
   npm ci
   ```

3. **Build React assets**
   ```bash
   npm run build
   ```

### 5. Laravel Setup

1. **Generate application key**
   ```bash
   php artisan key:generate
   ```

2. **Set permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

3. **Run migrations**
   ```bash
   php artisan migrate --force
   ```

4. **Optimize for production**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### 6. Plesk File Manager Settings

1. **Set proper file permissions**
   - `storage/` folder: 755
   - `bootstrap/cache/` folder: 755
   - All other files: 644

2. **Create .htaccess in root** (if not exists)
   - Copy the .htaccess from public/ to root directory
   - This ensures proper URL rewriting

### 7. SSL Certificate

1. **Enable SSL**
   - Go to SSL/TLS Certificates
   - Install Let's Encrypt certificate (free)
   - Force HTTPS redirect

### 8. Cron Jobs (if needed)

1. **Set up Laravel scheduler**
   ```bash
   # Add to crontab
   * * * * * cd /var/www/vhosts/yourdomain.com/httpdocs && php artisan schedule:run >> /dev/null 2>&1
   ```

## Troubleshooting

### Common Issues

1. **500 Internal Server Error**
   - Check file permissions
   - Verify .env configuration
   - Check Laravel logs in `storage/logs/`

2. **Database Connection Error**
   - Verify database credentials in .env
   - Ensure database exists
   - Check MySQL service is running

3. **Asset Loading Issues**
   - Ensure `npm run build` was executed
   - Check `public/build/` directory exists
   - Verify Vite configuration

4. **Permission Denied**
   - Set proper ownership: `chown -R www-data:www-data .`
   - Set proper permissions: `chmod -R 755 storage bootstrap/cache`

### Useful Commands

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Check Laravel status
php artisan about

# View logs
tail -f storage/logs/laravel.log
```

## Security Considerations

1. **Set APP_DEBUG=false** in production
2. **Use strong APP_KEY**
3. **Set proper file permissions**
4. **Enable HTTPS**
5. **Regular security updates**
6. **Database backups**

## Performance Optimization

1. **Enable OPcache** in PHP settings
2. **Use Redis** for caching (optional)
3. **Enable Gzip compression**
4. **Optimize images**
5. **Use CDN** for static assets (optional)
