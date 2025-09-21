# Deployment Guide

## Deploy to AWS Amplify

### Option 1: One-Click Deploy (Recommended)

1. **Fork this repository** to your GitHub account
2. **Open AWS Amplify Console**: [console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify/)
3. **Connect Repository**:
   - Click "New app" → "Host web app"
   - Select "GitHub" and authorize AWS Amplify
   - Choose your forked repository
   - Select the `main` branch
4. **Configure Build Settings**:
   - Amplify will auto-detect the build settings
   - No changes needed for the default configuration
5. **Deploy**:
   - Click "Save and deploy"
   - Wait 5-10 minutes for the initial deployment

### Option 2: AWS CLI Deploy

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure AWS credentials
amplify configure

# Initialize Amplify project
amplify init

# Deploy backend
amplify push

# Deploy frontend
amplify publish
```

## Local Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd safehaven-connect

# Install dependencies
npm install

# Start local development
npm run dev

# In another terminal, start Amplify sandbox (optional)
npx ampx sandbox
```

## Environment Configuration

The app uses AWS Amplify's automatic configuration. No manual environment variables needed.

## Production Considerations

- **Custom Domain**: Configure in Amplify Console → Domain management
- **Environment Variables**: Set in Amplify Console → Environment variables
- **Branch Deployments**: Configure different environments for staging/production
- **Monitoring**: Enable CloudWatch logs in Amplify Console

## Troubleshooting

### Build Failures
- Check build logs in Amplify Console
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Issues
- Check GraphQL schema in `amplify/data/resource.ts`
- Verify DynamoDB table permissions
- Check CloudWatch logs for backend errors

### Frontend Issues
- Verify `amplify_outputs.json` is generated correctly
- Check browser console for JavaScript errors
- Ensure all imports are correct