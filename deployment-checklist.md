# Plesk Deployment Checklist

## Pre-Deployment

- [ ] **Server Requirements Met**
  - [ ] PHP 8.2+ enabled
  - [ ] MySQL/MariaDB database created
  - [ ] Node.js 18+ enabled
  - [ ] Composer available
  - [ ] Git access configured

- [ ] **Domain Setup**
  - [ ] Domain/subdomain created in Plesk
  - [ ] Document root set to `/httpdocs/public`
  - [ ] SSL certificate installed (Let's Encrypt recommended)

## Deployment Steps

### 1. Upload Application
- [ ] Upload files via Git or File Manager
- [ ] Ensure all files are in correct location

### 2. Environment Configuration
- [ ] Copy `.env.plesk.template` to `.env`
- [ ] Update database credentials
- [ ] Set `APP_URL` to your domain
- [ ] Set `APP_DEBUG=false`
- [ ] Generate `APP_KEY` with `php artisan key:generate`

### 3. Dependencies Installation
- [ ] Run `composer install --no-dev --optimize-autoloader`
- [ ] Run `npm ci`
- [ ] Run `npm run build`

### 4. Laravel Setup
- [ ] Set proper permissions: `chmod -R 755 storage bootstrap/cache`
- [ ] Run `php artisan migrate --force`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`

### 5. File Permissions
- [ ] `storage/` folder: 755
- [ ] `bootstrap/cache/` folder: 755
- [ ] All other files: 644
- [ ] Owner: www-data (or appropriate web server user)

## Post-Deployment Testing

- [ ] **Website Access**
  - [ ] Homepage loads correctly
  - [ ] All pages accessible
  - [ ] No 500 errors

- [ ] **Database**
  - [ ] Database connection working
  - [ ] All tables created
  - [ ] Data can be inserted/retrieved

- [ ] **Assets**
  - [ ] CSS/JS files loading
  - [ ] Images displaying
  - [ ] No 404 errors for assets

- [ ] **Functionality**
  - [ ] User registration/login works
  - [ ] All features functional
  - [ ] Forms submitting correctly

## Security Checklist

- [ ] `APP_DEBUG=false` in production
- [ ] Strong `APP_KEY` generated
- [ ] Database credentials secure
- [ ] File permissions properly set
- [ ] HTTPS enabled and forced
- [ ] `.env` file not accessible via web

## Performance Optimization

- [ ] OPcache enabled in PHP
- [ ] Laravel caches configured
- [ ] Gzip compression enabled
- [ ] Static assets optimized

## Monitoring Setup

- [ ] Error logging configured
- [ ] Log rotation set up
- [ ] Backup strategy in place
- [ ] Monitoring tools configured (optional)

## Quick Commands Reference

```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Check application status
php artisan about

# View logs
tail -f storage/logs/laravel.log
```

## Troubleshooting

### Common Issues:
1. **500 Error**: Check file permissions and .env configuration
2. **Database Error**: Verify database credentials and connection
3. **Asset Loading**: Ensure `npm run build` was executed
4. **Permission Denied**: Set proper ownership and permissions

### Useful Files to Check:
- `storage/logs/laravel.log` - Application logs
- `.env` - Environment configuration
- `public/build/` - Built assets directory
- Database connection settings
