import { connectToDatabase } from '../lib/db';
import { Funnel, IFunnel } from '../models/Funnel';

export class FunnelService {
  static async findById(id: string): Promise<IFunnel | null> {
    await connectToDatabase();
    try {
      const funnel = await Funnel.findById(id).lean();
      if (funnel) {
        // Transform _id to id for frontend compatibility
        (funnel as any).id = (funnel as any)._id;
      }
      return funnel as IFunnel;
    } catch (error) {
      console.error('Error finding funnel by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<IFunnel[]> {
    await connectToDatabase();
    try {
      const funnels = await Funnel.find({ subAccountId }).lean();
      // Transform _id to id for all funnels for frontend compatibility
      const result = funnels.map(f => {
        (f as any).id = (f as any)._id;
        return f as IFunnel;
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
      // Transform _id to id for frontend compatibility
      const result = savedFunnel.toObject();
      (result as any).id = (result as any)._id;
      return result as IFunnel;
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
        // Transform _id to id for frontend compatibility
        (updatedFunnel as any).id = (updatedFunnel as any)._id;
      }
      return updatedFunnel as IFunnel;
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