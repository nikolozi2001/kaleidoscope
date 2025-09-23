# IIS Deployment Guide

## Prerequisites
1. Install Node.js on the IIS server
2. Install IISNODE module for IIS
3. Enable IIS features: Web Server, Application Development Features, CGI

## Deployment Steps

### 1. Prepare the Application
```bash
# Install dependencies
npm install --production

# Ensure all required files are present:
# - server.js (entry point)
# - index.js (main app)
# - web.config (IIS configuration)
# - iis-startup.js (environment setup)
# - .env (environment variables)
```

### 2. Environment Variables
Create or update `.env` file with production values:
```
NODE_ENV=production
DB_SERVER=your-db-server
DB_DATABASE=your-database
DB_USER=your-db-user
DB_PASSWORD=your-db-password
FRONTEND_URL=https://your-frontend-url
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. IIS Configuration
1. Copy the entire backend folder to IIS wwwroot or your site directory
2. Create a new IIS Application pointing to the backend folder
3. Ensure the web.config file is in the root of the application
4. Set appropriate permissions for IIS_IUSRS on the folder

### 4. IISNODE Configuration
The web.config includes:
- URL rewrite rules for Node.js routing
- Static file handling
- Compression settings
- Security headers
- Error handling

### 5. Verification
1. Browse to your application URL
2. Check `/health` endpoint for server status
3. Monitor IIS logs for any errors
4. Test API endpoints

## Troubleshooting

### Common Issues:
1. **Module not found errors**: Ensure all dependencies are installed
2. **Permission errors**: Check IIS_IUSRS permissions
3. **Database connection issues**: Verify connection string and firewall settings
4. **Port conflicts**: IISNODE handles port management automatically

### Log Locations:
- IIS logs: `C:\inetpub\logs\LogFiles\`
- IISNODE logs: Check `iisnode` folder in application directory
- Application logs: Check Winston log files

### Performance Tips:
1. Enable output caching in web.config for static responses
2. Use application initialization module for faster startup
3. Configure proper recycling conditions
4. Monitor memory usage and set appropriate limits

## Security Considerations
- Keep Node.js and IISNODE updated
- Use HTTPS in production
- Implement proper authentication for database access
- Review and update security headers in web.config
- Regular security updates for dependencies