import { AppProvider, useApp } from './contexts/AppContext';
import { LandingPage } from './components/LandingPage';
import { ShelterAuth } from './components/shelter/ShelterAuth';
import { ShelterDashboard } from './components/shelter/ShelterDashboard';
import { ResponderDashboard } from './components/responder/ResponderDashboard';

function AppContent() {
  const { state } = useApp();

  switch (state.currentSide) {
    case 'shelter':
      return state.currentUser?.type === 'shelter' ? <ShelterDashboard /> : <ShelterAuth />;
    case 'responder':
      return <ResponderDashboard />;
    case 'landing':
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="size-full">
        <AppContent />
      </div>
    </AppProvider>
  );
}