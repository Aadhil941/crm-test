# Jenkins CI/CD Setup Guide

This guide will help you set up Jenkins CI/CD pipeline for the Customer Account Management application.

## Prerequisites

- Docker and Docker Compose installed
- Git repository access (GitHub: https://github.com/Aadhil941/crm-test)
- Port 8080 available for Jenkins web UI
- Port 50000 available for Jenkins agent communication

## Quick Start

### 1. Start Jenkins Container

```bash
# Start Jenkins (network will be created automatically)
docker-compose -f docker-compose.jenkins.yml up -d
```

**Note:** The `app-network` will be created automatically by docker-compose. The Jenkins pipeline will also ensure the network exists before deployment.

### 2. Access Jenkins Web UI

1. Open your browser and navigate to: `http://localhost:8080`

2. Get the initial admin password:
   ```bash
   docker exec jenkins-ci cat /var/jenkins_home/secrets/initialAdminPassword
   ```

3. Copy the password and paste it into the Jenkins setup page

### 3. Install Suggested Plugins

- Jenkins will prompt you to install plugins
- Click "Install suggested plugins" (this will install the plugins listed in `jenkins/plugins.txt`)
- Wait for installation to complete

### 4. Create Admin User

- Fill in the admin user details:
  - Username: `admin` (or your preferred username)
  - Password: (choose a strong password)
  - Full name: (your name)
  - Email: (your email)

### 5. Configure Jenkins Instance

- Jenkins URL: `http://localhost:8080` (or your server's IP/domain)
- Click "Save and Finish"

## Setting Up the Pipeline Job

### Option 1: Using Jenkins UI (Recommended)

1. **Create New Item**
   - Click "New Item" on the Jenkins dashboard
   - Enter item name: `customer-management-pipeline`
   - Select "Pipeline" as the project type
   - Click "OK"

2. **Configure Pipeline**
   - **General Settings:**
     - Description: "CI/CD Pipeline for Customer Account Management Application"
     - Check "GitHub project" and enter: `https://github.com/Aadhil941/crm-test`

   - **Build Triggers:**
     - **For localhost/development:** Check "Poll SCM" and enter: `H/5 * * * *` (recommended)
     - **For webhook-based builds:** Check "GitHub hook trigger for GITScm polling" (requires public URL - see webhook setup section)

   - **Pipeline Definition:**
     - Select "Pipeline script from SCM"
     - SCM: `Git`
     - Repository URL: `https://github.com/Aadhil941/crm-test`
     - Credentials: (if private repo, add GitHub credentials)
     - Branch Specifier: `*/main` or `*/master` (depending on your default branch)
     - Script Path: `Jenkinsfile`
     - Click "Save"

### Option 2: Using Blue Ocean

1. Click "Open Blue Ocean" from the Jenkins dashboard
2. Click "New Pipeline"
3. Select "GitHub"
4. Authenticate with GitHub
5. Select repository: `Aadhil941/crm-test`
6. Click "Create Pipeline"
7. Jenkins will automatically detect the `Jenkinsfile` and configure the pipeline

## GitHub Webhook Configuration

### ⚠️ Important: Localhost Limitation

**GitHub cannot reach `localhost` URLs.** If your Jenkins is running on localhost, you have two options:

### Option 1: Use SCM Polling (Recommended for Local Development)

This is the easiest solution and doesn't require exposing Jenkins to the internet:

1. **In Jenkins Job Configuration:**
   - Go to your pipeline job → Configure
   - Under **Build Triggers**, check **"Poll SCM"**
   - Enter schedule: `H/5 * * * *` (checks every 5 minutes)
   - Or `H * * * *` (checks every hour)
   - Click **Save**

2. **No GitHub webhook needed** - Jenkins will automatically check for changes periodically

**Pros:** Simple, secure, no internet exposure needed  
**Cons:** Slight delay (up to polling interval) before builds trigger

### Option 2: Use ngrok to Expose Localhost (For Webhooks)

If you want instant webhook-based builds, use ngrok to create a public URL:

#### Step 1: Install ngrok

**Windows:**
- Download from: https://ngrok.com/download
- Extract and add to PATH, or run from extracted folder

**Mac:**
```bash
brew install ngrok
```

**Linux:**
```bash
# Download and install
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

#### Step 2: Create ngrok Account (Free)

1. Sign up at: https://dashboard.ngrok.com/signup
2. Get your authtoken from the dashboard
3. Configure ngrok:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

#### Step 3: Expose Jenkins

```bash
# Expose Jenkins on port 8080
ngrok http 8080
```

This will output something like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8080
```

#### Step 4: Configure GitHub Webhook

1. **Go to your GitHub repository**: https://github.com/Aadhil941/crm-test
2. **Navigate to Settings → Webhooks**
3. **Click "Add webhook"**
4. **Configure webhook:**
   - Payload URL: `https://YOUR-NGROK-URL.ngrok-free.app/github-webhook/`
     - Example: `https://abc123.ngrok-free.app/github-webhook/`
   - Content type: `application/json`
   - Secret: (optional, but recommended for security)
   - Which events: Select "Just the push event"
   - Active: ✓
5. **Click "Add webhook"**

#### Step 5: Keep ngrok Running

- Keep the ngrok terminal window open while Jenkins is running
- Or run ngrok in background: `ngrok http 8080 --log=stdout > ngrok.log &`
- **Note:** Free ngrok URLs change each time you restart ngrok. For permanent URLs, upgrade to a paid plan or use SCM polling.

### Option 3: Deploy Jenkins on a Public Server

If Jenkins is deployed on a server with a public IP or domain:

1. **Configure webhook:**
   - Payload URL: `http://your-server-ip:8080/github-webhook/`
   - Or: `https://your-domain.com/github-webhook/` (if using reverse proxy with SSL)

2. **Firewall:** Ensure port 8080 is open (or configure reverse proxy)

### Recommended Setup

- **For local development:** Use **SCM Polling** (Option 1) - simplest and most secure
- **For testing webhooks locally:** Use **ngrok** (Option 2)
- **For production:** Deploy Jenkins on a server with proper SSL/domain (Option 3)

## Pipeline Stages

The pipeline consists of the following stages:

1. **Checkout** - Clones code from GitHub repository
2. **Backend Tests** - Runs `npm test` in backend directory (fails pipeline on test failures)
3. **Frontend Tests** - Runs `npm test` in frontend directory (fails pipeline on test failures)
4. **Build Backend** - Builds backend Docker image
5. **Build Frontend** - Builds frontend Docker image
6. **Deploy** - Deploys all services using docker-compose
7. **Cleanup** - Removes old Docker images (keeps last 5 builds)

## Manual Build

To trigger a build manually:

1. Go to your pipeline job in Jenkins
2. Click "Build Now"
3. Monitor the build progress in the "Build History" section
4. Click on the build number to see detailed logs

## Viewing Build Results

- **Console Output**: Click on a build → "Console Output" to see detailed logs
- **Stage View**: See visual representation of pipeline stages
- **Blue Ocean**: Use Blue Ocean for a modern, visual pipeline view

## Troubleshooting

### Jenkins Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.jenkins.yml logs

# Check if port 8080 is already in use
netstat -an | grep 8080  # Linux/Mac
netstat -an | findstr 8080  # Windows
```

### Docker Commands Not Working in Pipeline

**Issue**: Jenkins can't execute Docker commands

**Solution**: Ensure Docker socket is mounted correctly:
```bash
# Check if docker.sock is accessible
docker exec jenkins-ci ls -la /var/run/docker.sock

# If not accessible, restart Jenkins with proper volume mount
docker-compose -f docker-compose.jenkins.yml restart
```

### Tests Failing in Pipeline

**Issue**: Tests pass locally but fail in Jenkins

**Possible causes:**
- Database not available during tests
- Environment variables not set
- Node.js version mismatch

**Solution**: 
- Check test logs in Jenkins console output
- Ensure test setup handles CI environment (no database required for unit tests)
- Verify Node.js version in Jenkins matches local environment

### GitHub Webhook Not Triggering Builds

**Issue**: Pushes to GitHub don't trigger Jenkins builds

**Common Causes:**

1. **"localhost is not reachable" error:**
   - GitHub cannot access localhost URLs
   - **Solution:** Use SCM polling instead (see Option 1 above) or expose Jenkins with ngrok

2. **Webhook delivery failures:**
   - Check webhook delivery in GitHub (Settings → Webhooks → Recent Deliveries)
   - Look for error messages in the delivery logs

3. **Jenkins not receiving webhooks:**
   - Verify Jenkins URL is accessible from internet (use ngrok if on localhost)
   - Check Jenkins logs: `docker logs jenkins-ci`
   - Verify "GitHub hook trigger" is enabled in job configuration

4. **ngrok URL changed:**
   - Free ngrok URLs change on restart
   - Update GitHub webhook URL or use SCM polling

**Recommended Solution for Local Development:**
- Use **SCM Polling** instead of webhooks: `H/5 * * * *` (checks every 5 minutes)
- This avoids all webhook-related issues and works perfectly for local development

### Docker Compose Network Issues

**Issue**: Services can't communicate with each other

**Solution**: Ensure Jenkins is on the same network as application:
```bash
# Check network exists
docker network ls | grep app-network

# Create network if missing (should be automatic, but if needed)
docker network create app-network

# Restart Jenkins
docker-compose -f docker-compose.jenkins.yml restart
```

The pipeline automatically creates the `app-network` if it doesn't exist during deployment.

### Permission Denied Errors

**Issue**: Permission denied when executing Docker commands

**Solution**: Jenkins container runs as root, but if issues persist:
```bash
# Check Docker socket permissions
ls -la /var/run/docker.sock

# Fix permissions if needed (Linux)
sudo chmod 666 /var/run/docker.sock
```

## Managing Jenkins

### Stop Jenkins

```bash
docker-compose -f docker-compose.jenkins.yml stop
```

### Start Jenkins

```bash
docker-compose -f docker-compose.jenkins.yml start
```

### Restart Jenkins

```bash
docker-compose -f docker-compose.jenkins.yml restart
```

### View Jenkins Logs

```bash
docker-compose -f docker-compose.jenkins.yml logs -f
```

### Backup Jenkins Data

```bash
# Jenkins data is stored in the jenkins_home volume
docker run --rm -v new-project_jenkins_home:/data -v $(pwd):/backup alpine tar czf /backup/jenkins-backup.tar.gz -C /data .
```

### Restore Jenkins Data

```bash
docker run --rm -v new-project_jenkins_home:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/jenkins-backup.tar.gz"
```

## Security Considerations

1. **Change default admin password** after first login
2. **Use GitHub credentials** for private repositories (Manage Jenkins → Credentials)
3. **Restrict Jenkins access** using firewall rules
4. **Use HTTPS** in production (configure reverse proxy with SSL)
5. **Regular updates**: Keep Jenkins and plugins updated
6. **Backup regularly**: Backup `jenkins_home` volume

## Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [GitHub Plugin](https://plugins.jenkins.io/github/)

## Support

For issues specific to this project:
1. Check the troubleshooting section above
2. Review Jenkins console logs
3. Check GitHub repository issues
4. Contact the development team

