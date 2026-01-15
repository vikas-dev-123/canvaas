import { connectDB } from '../lib/db';
import { Agency, IAgency } from '../models/Agency';
import { v4 as uuidv4 } from 'uuid';

export class AgencyService {
  static async findById(id: string): Promise<IAgency | null> {
    await connectDB();
    try {
      // Find by the custom id field (UUID) - primary application ID
      const agency = await Agency.findOne({ id: id }).lean();
      
      if (agency) {
        // Clean up the agency object for Next.js compatibility
        const { _id, __v, ...cleanAgency } = agency;
        cleanAgency.id = cleanAgency.id ?? _id?.toString();
        return cleanAgency as IAgency;
      }
      return null;
    } catch (error) {
      console.error('Error finding agency by ID:', error);
      return null;
    }
  }

  static async findByCustomerId(customerId: string): Promise<IAgency | null> {
    await connectDB();
    try {
      const agency = await Agency.findOne({ customerId }).lean();
      
      if (agency) {
        // Clean up the agency object for Next.js compatibility
        const { _id, __v, ...cleanAgency } = agency;
        cleanAgency.id = cleanAgency.id ?? _id?.toString();
        return cleanAgency as IAgency;
      }
      return null;
    } catch (error) {
      console.error('Error finding agency by customer ID:', error);
      return null;
    }
  }

  static async create(agencyData: Omit<IAgency, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAgency> {
    await connectDB();
    try {
      // Ensure the agency has a UUID id if not provided
      const dataToSave = {
        ...agencyData,
        id: agencyData.id || uuidv4()
      };
      const agency = new Agency(dataToSave);
      const savedAgency = await agency.save();
      // Clean up the agency object for Next.js compatibility
      const agencyObj = savedAgency.toObject();
      const { _id, __v, ...cleanResult } = agencyObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IAgency;
    } catch (error) {
      console.error('Error creating agency:', error);
      throw error;
    }
  }

  static async update(id: string, agencyData: Partial<Omit<IAgency, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IAgency | null> {
    await connectDB();
    try {
      const updatedAgency = await Agency.findOneAndUpdate(
        { id: id },
        { ...agencyData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedAgency) {
        // Clean up the agency object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedAgency } = updatedAgency;
        cleanUpdatedAgency.id = cleanUpdatedAgency.id ?? _id?.toString();
        return cleanUpdatedAgency as IAgency;
      }
      return null;
    } catch (error) {
      console.error('Error updating agency:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await Agency.findOneAndDelete({ id: id });
      return !!result;
    } catch (error) {
      console.error('Error deleting agency:', error);
      return false;
    }
  }
}