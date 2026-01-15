import { connectToDatabase } from '../lib/db';
import { Funnel, IFunnel } from '../models/Funnel';

export class FunnelService {
  static async findById(id: string): Promise<IFunnel | null> {
    await connectToDatabase();
    try {
      const funnel = await Funnel.findById(id).lean();
      if (funnel) {
        // Clean up the funnel object for Next.js compatibility
        const { _id, __v, ...cleanFunnel } = funnel;
        cleanFunnel.id = cleanFunnel.id ?? _id?.toString();
        return cleanFunnel as IFunnel;
      }
      return null;
    } catch (error) {
      console.error('Error finding funnel by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<IFunnel[]> {
    await connectToDatabase();
    try {
      const funnels = await Funnel.find({ subAccountId }).lean();
      // Clean up the funnel objects for Next.js compatibility
      const result = funnels.map(funnel => {
        const { _id, __v, ...cleanFunnel } = funnel;
        cleanFunnel.id = cleanFunnel.id ?? _id?.toString();
        return cleanFunnel as IFunnel;
      });
      return result;
    } catch (error) {
      console.error('Error finding funnels by subaccount ID:', error);
      return [];
    }
  }

  static async create(funnelData: Omit<IFunnel, '_id'>): Promise<IFunnel> {
    await connectToDatabase();
    try {
      const funnel = new Funnel(funnelData);
      const savedFunnel = await funnel.save();
      // Clean up the funnel object for Next.js compatibility
      const funnelObj = savedFunnel.toObject();
      const { _id, __v, ...cleanResult } = funnelObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IFunnel;
    } catch (error) {
      console.error('Error creating funnel:', error);
      throw error;
    }
  }

  static async update(id: string, funnelData: Partial<IFunnel>): Promise<IFunnel | null> {
    await connectToDatabase();
    try {
      const updatedFunnel = await Funnel.findByIdAndUpdate(
        id,
        { ...funnelData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedFunnel) {
        // Clean up the funnel object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedFunnel } = updatedFunnel;
        cleanUpdatedFunnel.id = cleanUpdatedFunnel.id ?? _id?.toString();
        return cleanUpdatedFunnel as IFunnel;
      }
      return null;
    } catch (error) {
      console.error('Error updating funnel:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Funnel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting funnel:', error);
      return false;
    }
  }
}