import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Shelter, User } from '../types';

const client = generateClient<Schema>();

function mapShelterFromAmplify(amplifyData: any): Shelter {
  return {
    id: amplifyData.id,
    name: amplifyData.name,
    location: {
      latitude: amplifyData.latitude,
      longitude: amplifyData.longitude,
      address: amplifyData.address
    },
    capacity: {
      current: amplifyData.currentCapacity || 0,
      maximum: amplifyData.maximumCapacity
    },
    needs: {
      food: amplifyData.foodNeed || 0,
      water: amplifyData.waterNeed || 0,
      medicalSupplies: amplifyData.medicalSuppliesNeed || 0,
      blankets: amplifyData.blanketsNeed || 0,
      clothing: amplifyData.clothingNeed || 0,
      other: amplifyData.otherNeeds || ''
    },
    status: amplifyData.status || 'no-action',
    otherInformation: amplifyData.otherInformation || '',
    lastUpdated: amplifyData.lastUpdated
  };
}

function mapShelterToAmplify(shelter: Shelter) {
  return {
    id: shelter.id,
    name: shelter.name,
    latitude: shelter.location.latitude,
    longitude: shelter.location.longitude,
    address: shelter.location.address,
    currentCapacity: shelter.capacity.current,
    maximumCapacity: shelter.capacity.maximum,
    foodNeed: shelter.needs.food,
    waterNeed: shelter.needs.water,
    medicalSuppliesNeed: shelter.needs.medicalSupplies,
    blanketsNeed: shelter.needs.blankets,
    clothingNeed: shelter.needs.clothing,
    otherNeeds: shelter.needs.other,
    status: shelter.status,
    otherInformation: shelter.otherInformation,
    lastUpdated: shelter.lastUpdated
  };
}

function mapUserFromAmplify(amplifyData: any): User {
  return {
    id: amplifyData.id,
    name: amplifyData.name,
    type: amplifyData.type,
    shelterId: amplifyData.shelterId,
    location: amplifyData.latitude && amplifyData.longitude ? {
      latitude: amplifyData.latitude,
      longitude: amplifyData.longitude
    } : undefined,
    address: amplifyData.address
  };
}

function mapUserToAmplify(user: User) {
  return {
    id: user.id,
    name: user.name,
    type: user.type,
    shelterId: user.shelterId,
    latitude: user.location?.latitude,
    longitude: user.location?.longitude,
    address: user.address
  };
}

export const api = {
  // Shelters
  async getShelters(): Promise<Shelter[]> {
    try {
      const { data } = await client.models.Shelter.list();
      return data.map(mapShelterFromAmplify);
    } catch (error) {
      console.error('Error fetching shelters:', error);
      throw new Error('Failed to fetch shelters');
    }
  },

  async createShelter(shelter: Shelter): Promise<Shelter> {
    try {
      const { data } = await client.models.Shelter.create(mapShelterToAmplify(shelter));
      return mapShelterFromAmplify(data);
    } catch (error) {
      console.error('Error creating shelter:', error);
      throw new Error('Failed to create shelter');
    }
  },

  async updateShelter(shelter: Shelter): Promise<Shelter> {
    try {
      const { data } = await client.models.Shelter.update(mapShelterToAmplify(shelter));
      return mapShelterFromAmplify(data);
    } catch (error) {
      console.error('Error updating shelter:', error);
      throw new Error('Failed to update shelter');
    }
  },

  async updateShelterStatus(shelterId: string, status: Shelter['status']): Promise<void> {
    try {
      await client.models.Shelter.update({
        id: shelterId,
        status,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating shelter status:', error);
      throw new Error('Failed to update shelter status');
    }
  },

  // Users
  async getUsers(): Promise<User[]> {
    try {
      const { data } = await client.models.User.list();
      return data.map(mapUserFromAmplify);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  async createUser(user: User): Promise<User> {
    try {
      const { data } = await client.models.User.create(mapUserToAmplify(user));
      return mapUserFromAmplify(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  // Real-time subscriptions
  subscribeShelters(callback: (shelters: Shelter[]) => void) {
    const subscription = client.models.Shelter.observeQuery().subscribe({
      next: ({ items }) => {
        callback(items.map(mapShelterFromAmplify));
      },
      error: (error) => {
        console.error('Shelter subscription error:', error);
      }
    });
    return subscription;
  },

  subscribeUsers(callback: (users: User[]) => void) {
    const subscription = client.models.User.observeQuery().subscribe({
      next: ({ items }) => {
        callback(items.map(mapUserFromAmplify));
      },
      error: (error) => {
        console.error('User subscription error:', error);
      }
    });
    return subscription;
  }
};