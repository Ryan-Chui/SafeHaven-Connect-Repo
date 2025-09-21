import { Shield, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApp } from '../contexts/AppContext';

export function LandingPage() {
  const { dispatch } = useApp();

  const handleSelectSide = (side: 'shelter' | 'responder') => {
    dispatch({ type: 'SET_CURRENT_SIDE', payload: side });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-blue-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900">SafeHaven Connect</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting Emergency Shelters with First Responders to ensure critical supplies reach those in need when infrastructure is down.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectSide('shelter')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Emergency Shelter</CardTitle>
              <CardDescription className="text-lg">
                Update your shelter's capacity, needs, and critical information
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-gray-600">
                <li>• Update shelter capacity and occupancy</li>
                <li>• Request food, water, medical supplies</li>
                <li>• Share critical shelter information</li>
                <li>• Monitor response status</li>
              </ul>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
                onClick={() => handleSelectSide('shelter')}
              >
                Access Shelter Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectSide('responder')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">First Responder</CardTitle>
              <CardDescription className="text-lg">
                View shelter needs and coordinate emergency response efforts
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-gray-600">
                <li>• View all shelter locations and needs</li>
                <li>• Sort shelters by distance</li>
                <li>• Update response status</li>
                <li>• Coordinate supply distribution</li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                size="lg"
                onClick={() => handleSelectSide('responder')}
              >
                Access Responder Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Data is stored locally in your browser. You can switch between portals without losing information.
          </p>
        </div>
      </div>
    </div>
  );
}