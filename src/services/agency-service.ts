import { connectToDatabase } from '../lib/db';
import { Agency, IAgency } from '../models/Agency';

export class AgencyService {
  static async findById(id: string): Promise<IAgency | null> {
    await connectToDatabase();
    try {
      const agency = await Agency.findById(id).lean();
      if (agency) {
        // Transform _id to id for frontend compatibility
        (agency as any).id = (agency as any)._id;
      }
      return agency as IAgency;
    } catch (error) {
      console.error('Error finding agency by ID:', error);
      return null;
    }
  }

  static async findByCustomerId(customerId: string): Promise<IAgency | null> {
    await connectToDatabase();
    try {
      const agency = await Agency.findOne({ customerId }).lean();
      if (agency) {
        // Transform _id to id for frontend compatibility
        (agency as any).id = (agency as any)._id;
      }
      return agency as IAgency;
    } catch (error) {
      console.error('Error finding agency by customer ID:', error);
      return null;
    }
  }

  static async create(agencyData: Omit<IAgency, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAgency> {
    await connectToDatabase();
    try {
      const agency = new Agency(agencyData);
      const savedAgency = await agency.save();
      // Transform _id to id for frontend compatibility
      const result = savedAgency.toObject();
      (result as any).id = (result as any)._id;
      return result as IAgency;
    } catch (error) {
      console.error('Error creating agency:', error);
      throw error;
    }
  }

  static async update(id: string, agencyData: Partial<Omit<IAgency, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IAgency | null> {
    await connectToDatabase();
    try {
      const updatedAgency = await Agency.findByIdAndUpdate(
        id,
        { ...agencyData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedAgency) {
        // Transform _id to id for frontend compatibility
        (updatedAgency as any).id = (updatedAgency as any)._id;
      }
      return updatedAgency as IAgency;
    } catch (error) {
      console.error('Error updating agency:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Agency.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting agency:', error);
      return false;
    }
  }
}