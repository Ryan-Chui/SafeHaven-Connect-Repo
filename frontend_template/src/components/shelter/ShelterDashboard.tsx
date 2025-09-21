import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { useApp } from '../../contexts/AppContext';
import { Shelter, NEED_LABELS, STATUS_LABELS, NeedLevel } from '../../types/index';
import { ArrowLeft, Building, Users, MapPin, AlertTriangle, Save } from 'lucide-react';

// Fallback definitions in case import fails
const LOCAL_STATUS_LABELS = {
  'no-action': 'No Action Taken',
  'acknowledged': 'Acknowledged',
  'in-progress': 'In Progress',
  'completed': 'Completed'
} as const;

const LOCAL_NEED_LABELS = {
  0: 'No Need',
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Critical'
} as const;

export function ShelterDashboard() {
  const { state, dispatch, actions } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_SIDE', payload: 'landing' });
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  };
  
  const currentShelter = state.shelters.find(s => s.id === state.currentUser?.shelterId);
  
  const [formData, setFormData] = useState({
    currentCapacity: currentShelter?.capacity.current || 0,
    food: currentShelter?.needs.food || 0,
    water: currentShelter?.needs.water || 0,
    medicalSupplies: currentShelter?.needs.medicalSupplies || 0,
    blankets: currentShelter?.needs.blankets || 0,
    clothing: currentShelter?.needs.clothing || 0,
    other: currentShelter?.needs.other || '',
    otherInformation: currentShelter?.otherInformation || ''
  });

  if (!currentShelter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shelter not found</h2>
          <p className="text-gray-600 mb-4">The shelter associated with your account could not be found.</p>
          <Button onClick={handleBack} className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    const updatedShelter: Shelter = {
      ...currentShelter,
      capacity: {
        ...currentShelter.capacity,
        current: formData.currentCapacity
      },
      needs: {
        food: formData.food as NeedLevel,
        water: formData.water as NeedLevel,
        medicalSupplies: formData.medicalSupplies as NeedLevel,
        blankets: formData.blankets as NeedLevel,
        clothing: formData.clothing as NeedLevel,
        other: formData.other
      },
      otherInformation: formData.otherInformation,
      lastUpdated: new Date().toISOString()
    };

    try {
      await actions.updateShelter(updatedShelter);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to save changes. Please try again.');
    }
  };

  const getStatusColor = (status: Shelter['status']) => {
    switch (status) {
      case 'no-action': return 'bg-gray-500';
      case 'acknowledged': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getNeedColor = (level: number) => {
    if (level === 0) return 'bg-gray-200 text-gray-700';
    if (level <= 2) return 'bg-green-200 text-green-800';
    if (level <= 3) return 'bg-yellow-200 text-yellow-800';
    return 'bg-red-200 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentShelter.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {currentShelter.location.address}
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(currentShelter.status || 'no-action')} text-white`}>
              {(STATUS_LABELS || LOCAL_STATUS_LABELS)[currentShelter.status || 'no-action']}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Capacity Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Shelter Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current Occupancy</span>
                  <span className="font-semibold">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.currentCapacity}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          currentCapacity: parseInt(e.target.value) || 0 
                        }))}
                        className="w-20 text-center"
                        min="0"
                        max={currentShelter.capacity.maximum}
                      />
                    ) : (
                      `${currentShelter.capacity.current} / ${currentShelter.capacity.maximum}`
                    )}
                  </span>
                </div>
                
                {!isEditing && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((currentShelter.capacity.current / currentShelter.capacity.maximum) * 100, 100)}%` 
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Response Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge className={`${getStatusColor(currentShelter.status || 'no-action')} text-white text-lg px-4 py-2`}>
                  {(STATUS_LABELS || LOCAL_STATUS_LABELS)[currentShelter.status || 'no-action']}
                </Badge>
                <p className="text-gray-600 mt-2 text-sm">
                  Last updated: {new Date(currentShelter.lastUpdated).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Needs Assessment */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Current Needs Assessment</CardTitle>
              <CardDescription>Rate your shelter's current needs (0 = No Need, 5 = Critical Need)</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
                Edit Needs
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { key: 'food' as const, label: 'Food' },
                { key: 'water' as const, label: 'Water' },
                { key: 'medicalSupplies' as const, label: 'Medical Supplies' },
                { key: 'blankets' as const, label: 'Blankets' },
                { key: 'clothing' as const, label: 'Clothing' }
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{label}</Label>
                    <Badge className={getNeedColor(isEditing ? formData[key] : (currentShelter.needs[key] ?? 0))}>
                      {(NEED_LABELS || LOCAL_NEED_LABELS)[(isEditing ? formData[key] : (currentShelter.needs[key] ?? 0)) as NeedLevel]}
                    </Badge>
                  </div>
                  {isEditing ? (
                    <Slider
                      value={[formData[key]]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, [key]: value[0] }))}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                  ) : (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (currentShelter.needs[key] ?? 0) === 0 ? 'bg-gray-400' :
                          (currentShelter.needs[key] ?? 0) <= 2 ? 'bg-green-500' :
                          (currentShelter.needs[key] ?? 0) <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${((currentShelter.needs[key] ?? 0) / 5) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <Label>Other Needs</Label>
              {isEditing ? (
                <Textarea
                  value={formData.other}
                  onChange={(e) => setFormData(prev => ({ ...prev, other: e.target.value }))}
                  placeholder="Describe any other specific needs..."
                  rows={3}
                />
              ) : (
                <p className="text-gray-700 bg-gray-50 p-3 rounded min-h-[80px]">
                  {currentShelter.needs.other || 'No other needs specified'}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <Label>Additional Information</Label>
              {isEditing ? (
                <Textarea
                  value={formData.otherInformation}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherInformation: e.target.value }))}
                  placeholder="Any other important information for first responders..."
                  rows={3}
                />
              ) : (
                <p className="text-gray-700 bg-gray-50 p-3 rounded min-h-[80px]">
                  {currentShelter.otherInformation || 'No additional information provided'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}