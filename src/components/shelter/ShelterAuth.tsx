import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useApp } from '../../contexts/AppContext';
import { Shelter, User } from '../../types';
import { ArrowLeft, MapPin, Building, Search } from 'lucide-react';
import { geocodeAddress } from '../../utils/geocoding';

export function ShelterAuth() {
  const { state, dispatch, actions } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userName: '',
    shelterName: '',
    address: '',
    maxCapacity: '',
    otherInformation: ''
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedLocation, setGeocodedLocation] = useState<{latitude: number, longitude: number, displayAddress: string} | null>(null);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_SIDE', payload: 'landing' });
  };

  const handleLogin = async (shelterId: string) => {
    const existingShelter = state.shelters.find(s => s.id === shelterId);
    if (!existingShelter) return;

    const user: User = {
      id: Date.now().toString(),
      name: formData.userName || 'Shelter User',
      type: 'SHELTER',
      shelterId: shelterId
    };

    try {
      await actions.addUser(user);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
    } catch (error) {
      alert('Failed to login. Please try again.');
    }
  };

  const handleGeocodeAddress = async () => {
    if (!formData.address.trim()) {
      alert('Please enter an address first');
      return;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(formData.address);
      setGeocodedLocation(result);
      setFormData(prev => ({ ...prev, address: result.displayAddress }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to find address');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.shelterName || !formData.address || !formData.maxCapacity) {
      alert('Please fill in all required fields');
      return;
    }

    if (!geocodedLocation) {
      alert('Please geocode the address first by clicking the search button');
      return;
    }

    const shelterId = Date.now().toString();
    
    const newShelter: Shelter = {
      id: shelterId,
      name: formData.shelterName,
      location: {
        latitude: geocodedLocation.latitude,
        longitude: geocodedLocation.longitude,
        address: geocodedLocation.displayAddress
      },
      capacity: {
        current: 0,
        maximum: parseInt(formData.maxCapacity)
      },
      needs: {
        food: 0,
        water: 0,
        medicalSupplies: 0,
        blankets: 0,
        clothing: 0,
        other: ''
      },
      status: 'NO_ACTION',
      otherInformation: formData.otherInformation,
      lastUpdated: new Date().toISOString()
    };

    const user: User = {
      id: Date.now().toString(),
      name: formData.userName || 'Shelter User',
      type: 'SHELTER',
      shelterId: shelterId
    };

    try {
      await actions.addShelter(newShelter);
      await actions.addUser(user);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
    } catch (error) {
      alert('Failed to register shelter. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Building className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Shelter Portal</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Select Your Shelter' : 'Register New Shelter'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Choose from existing shelters or create a new one'
                : 'Create a new shelter in the system'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>

            {isLogin ? (
              <div>
                <Label>Select Shelter</Label>
                {state.shelters.length > 0 ? (
                  <Select onValueChange={handleLogin}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your shelter" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.shelters.map(shelter => (
                        <SelectItem key={shelter.id} value={shelter.id}>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {shelter.name} - {shelter.location.address}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-500 text-sm">No shelters registered yet. Please register a new shelter.</p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="shelterName">Shelter Name *</Label>
                  <Input
                    id="shelterName"
                    value={formData.shelterName}
                    onChange={(e) => setFormData(prev => ({ ...prev, shelterName: e.target.value }))}
                    placeholder="e.g., Community Center Shelter"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, address: e.target.value }));
                        setGeocodedLocation(null); // Reset geocoded location when address changes
                      }}
                      placeholder="Full street address (e.g., 123 Main St, City, State)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleGeocodeAddress}
                      disabled={isGeocoding || !formData.address.trim()}
                      size="sm"
                      variant="outline"
                    >
                      {isGeocoding ? (
                        'Searching...'
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-1" />
                          Find
                        </>
                      )}
                    </Button>
                  </div>
                  {geocodedLocation && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <p className="text-green-800">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Location found: {geocodedLocation.latitude.toFixed(4)}, {geocodedLocation.longitude.toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="maxCapacity">Maximum Capacity *</Label>
                  <Input
                    id="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: e.target.value }))}
                    placeholder="Number of people"
                    type="number"
                  />
                </div>

                <div>
                  <Label htmlFor="otherInfo">Other Information</Label>
                  <Textarea
                    id="otherInfo"
                    value={formData.otherInformation}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherInformation: e.target.value }))}
                    placeholder="Special considerations, accessibility features, etc."
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2">
              {isLogin ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsLogin(false)}
                  className="flex-1"
                >
                  Register New Shelter
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsLogin(true)}
                    className="flex-1"
                  >
                    Back to Login
                  </Button>
                  <Button 
                    onClick={handleRegister}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Register Shelter
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}