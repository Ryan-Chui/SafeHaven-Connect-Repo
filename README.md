# SafeHaven Connect

**Emergency Response Coordination Platform**

SafeHaven Connect is a dual-portal emergency response platform that bridges the communication gap between emergency shelters and first responders during crisis situations. When infrastructure is compromised, this platform provides a reliable way for shelters to report their critical needs and for emergency responders to coordinate supply distribution effectively.

![SafeHaven Connect Landing Page](https://github.com/user-attachments/assets/4c1957bc-c72a-461a-bcd2-2e988e2c7bc6)

## 🏠 Emergency Shelter Portal

Emergency shelters can register and manage their critical information:

![Shelter Registration](https://github.com/user-attachments/assets/d58467ca-471b-440d-8437-41d4adaa9e5c)

**Key Features:**
- **Shelter Registration**: Create shelter profiles with location verification using OpenStreetMap geocoding
- **Capacity Management**: Track current occupancy vs. maximum capacity 
- **Critical Needs Reporting**: Report supply needs on a 0-5 urgency scale:
  - Food supplies
  - Water reserves  
  - Medical supplies
  - Blankets and bedding
  - Clothing donations
  - Other custom needs
- **Status Updates**: Monitor response progress (No Action → Acknowledged → In Progress → Completed)
- **Contact Information**: Maintain essential shelter details and special considerations

## 🚨 First Responder Dashboard  

Emergency responders get a centralized view of all shelter needs:

![Responder Dashboard](https://github.com/user-attachments/assets/05fcc0b2-ed1d-4a6a-97b9-126f7d1cc771)

**Key Features:**
- **Real-time Shelter Monitoring**: View all registered shelters and their current needs
- **Critical Needs Alerts**: Immediate notifications for urgent supply requests
- **Geographic Coordination**: Location-based sorting and distance calculations
- **Response Management**: Update shelter status as teams deploy and deliver supplies
- **Mobile Access**: Field-ready interface for responders on mobile devices

## 🚀 Quick Deploy to AWS Amplify

1. **Fork this repository** to your GitHub account
2. **Deploy to Amplify**: Connect this repository to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
3. **Automatic Setup**: Amplify will configure:
   - DynamoDB database for data persistence
   - GraphQL API with real-time subscriptions
   - React frontend with global CDN
   - Auto-scaling backend infrastructure
4. **Go Live**: Get a production URL in 5-10 minutes

👉 **[See detailed deployment instructions](DEPLOYMENT.md)**

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/Ryan-Chui/SafeHaven-Connect-Repo.git
cd SafeHaven-Connect-Repo

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

**Note**: The app includes fallback localStorage functionality, so it works locally even without AWS backend connectivity.

## 🏗️ Architecture & Technology

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Radix UI components
- **Backend**: AWS Amplify Gen 2 with GraphQL API
- **Database**: DynamoDB with automatic scaling
- **Geocoding**: OpenStreetMap Nominatim API (no API key required)
- **Real-time Updates**: GraphQL subscriptions for live data sync
- **Hosting**: AWS Amplify with global CDN distribution
- **Offline Support**: localStorage fallback when backend unavailable

## 📊 Data Model

**Shelter Records:**
```typescript
{
  id: string;
  name: string;
  location: { latitude, longitude, address };
  capacity: { current, maximum };
  needs: { 
    food: 0-5,           // Supply urgency scale
    water: 0-5, 
    medicalSupplies: 0-5,
    blankets: 0-5,
    clothing: 0-5,
    other: string        // Custom needs description
  };
  status: 'NO_ACTION' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'COMPLETED';
  otherInformation: string;
  lastUpdated: ISO8601 timestamp;
}
```

**User Profiles:**
```typescript
{
  id: string;
  name: string;
  type: 'SHELTER' | 'RESPONDER';
  shelterId?: string;     // For shelter managers
  location?: { lat, lng }; // For responders
  address?: string;       // Optional responder address
}
```

## 🔐 Security & Privacy

- Public API access for emergency situations (no authentication barriers)
- Data stored locally in browser as backup
- No personal identification information collected
- AWS security best practices implemented
- See [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications) for security reporting

## 📱 Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive Web App capabilities
- Geolocation API support for responder positioning

## 📄 License

This project is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file for details.