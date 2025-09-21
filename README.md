# SafeHaven Connect

**AWS Amplify-Ready Emergency Response Platform**

SafeHaven Connect enables Emergency Shelters to share real-time needs with First Responders during emergencies when critical infrastructure is down.

## 🚀 Quick Deploy to AWS Amplify

1. **One-Click Deploy**: Connect this repository to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. **Automatic Setup**: Amplify will automatically configure:
   - DynamoDB database
   - GraphQL API with real-time sync
   - React frontend with CDN
   - CORS and authentication
3. **Go Live**: Get a production URL in minutes

👉 **[See detailed deployment instructions](DEPLOYMENT.md)**

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: AWS Amplify Gen 2 (GraphQL + DynamoDB)
- **Real-time**: GraphQL subscriptions for live updates
- **Hosting**: Amplify Hosting with global CDN

## Features

### Emergency Shelter Side
- Update shelter capacity and needs (food, water, medical supplies, etc.)
- View shelter information and location
- Real-time status updates

### First Responder Side
- View all shelter needs and status
- Update shelter response status
- Sort shelters by distance from current location
- Real-time updates across all connected devices

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Data Model

**Shelters**:
- Name, Location (coordinates + address)
- Capacity (current/maximum)
- Needs (food, water, medical supplies, blankets, clothing)
- Status (no-action, acknowledged, in-progress, completed)
- Other information

**Users**:
- Name, Type (shelter/responder)
- Associated shelter (for shelter users)
- Location (for responders)

## Technology Stack

- **React 18** with TypeScript
- **AWS Amplify Gen 2** for backend
- **DynamoDB** for data storage
- **GraphQL** for API with real-time subscriptions
- **Tailwind CSS** + **Radix UI** for styling
- **Vite** for build tooling

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.