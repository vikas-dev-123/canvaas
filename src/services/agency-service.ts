import { connectToDatabase } from '../lib/db';
import { Agency, IAgency } from '../models/Agency';
import { v4 as uuidv4 } from 'uuid';

export class AgencyService {
  static async findById(id: string): Promise<IAgency | null> {
    await connectToDatabase();
    try {
      // Find by the custom id field (UUID) - primary application ID
      const agency = await Agency.findOne({ id: id }).lean();
      
      if (agency) {
        // Ensure the id field is preserved and return a clean plain object
        const cleanAgency = { ...agency };
        // Ensure id is always a string
        if (cleanAgency.id && typeof cleanAgency.id !== 'string') {
          cleanAgency.id = cleanAgency.id.toString();
        }
        if (!(cleanAgency as any).id && (cleanAgency as any)._id) {
          cleanAgency.id = (cleanAgency as any)._id.toString();
        }
        // Remove Mongoose-specific properties
        delete (cleanAgency as any).__v;
        delete (cleanAgency as any)._id;
        return cleanAgency as IAgency;
      }
      // Return clean object if no agency found
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
        // Ensure the id field is preserved
        (agency as any).id = (agency as any).id || (agency as any)._id;
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
      // Ensure the agency has a UUID id if not provided
      const dataToSave = {
        ...agencyData,
        id: agencyData.id || uuidv4()
      };
      const agency = new Agency(dataToSave);
      const savedAgency = await agency.save();
      const result = savedAgency.toObject();
      // Create a clean plain object without Mongoose-specific properties
      const cleanResult = { ...result };
      // Ensure id is always a string
      if (cleanResult.id && typeof cleanResult.id !== 'string') {
        cleanResult.id = cleanResult.id.toString();
      }
      if (!(cleanResult as any).id && (cleanResult as any)._id) {
        cleanResult.id = (cleanResult as any)._id.toString();
      }
      // Remove Mongoose-specific properties
      delete (cleanResult as any).__v;
      delete (cleanResult as any)._id;
      return cleanResult as IAgency;
    } catch (error) {
      console.error('Error creating agency:', error);
      throw error;
    }
  }

  static async update(id: string, agencyData: Partial<Omit<IAgency, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IAgency | null> {
    await connectToDatabase();
    try {
      const updatedAgency = await Agency.findOneAndUpdate(
        { id: id },
        { ...agencyData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedAgency) {
        // Create a clean plain object without Mongoose-specific properties
        const cleanUpdatedAgency = { ...updatedAgency };
        // Ensure id is always a string
        if (cleanUpdatedAgency.id && typeof cleanUpdatedAgency.id !== 'string') {
          cleanUpdatedAgency.id = cleanUpdatedAgency.id.toString();
        }
        if (!(cleanUpdatedAgency as any).id && (cleanUpdatedAgency as any)._id) {
          cleanUpdatedAgency.id = (cleanUpdatedAgency as any)._id.toString();
        }
        // Remove Mongoose-specific properties
        delete (cleanUpdatedAgency as any).__v;
        delete (cleanUpdatedAgency as any)._id;
        return cleanUpdatedAgency as IAgency;
      }
      // Return clean object if no agency found
      return updatedAgency as IAgency;
    } catch (error) {
      console.error('Error updating agency:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Agency.findOneAndDelete({ id: id });
      return !!result;
    } catch (error) {
      console.error('Error deleting agency:', error);
      return false;
    }
  }
}