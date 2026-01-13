import { connectToDatabase } from '../lib/db';
import { AddOns, IAddOns } from '../models/AddOns';

export class AddOnsService {
  static async findById(id: string): Promise<IAddOns | null> {
    await connectToDatabase();
    try {
      const addon = await AddOns.findById(id).lean();
      if (addon) {
        // Transform _id to id for frontend compatibility
        (addon as any).id = (addon as any)._id;
      }
      return addon as IAddOns;
    } catch (error) {
      console.error('Error finding addon by ID:', error);
      return null;
    }
  }

  static async create(addonData: Omit<IAddOns, '_id'>): Promise<IAddOns> {
    await connectToDatabase();
    try {
      const addon = new AddOns(addonData);
      const savedAddon = await addon.save();
      // Transform _id to id for frontend compatibility
      const result = savedAddon.toObject();
      (result as any).id = (result as any)._id;
      return result as IAddOns;
    } catch (error) {
      console.error('Error creating addon:', error);
      throw error;
    }
  }

  static async update(id: string, addonData: Partial<IAddOns>): Promise<IAddOns | null> {
    await connectToDatabase();
    try {
      const updatedAddon = await AddOns.findByIdAndUpdate(
        id,
        { ...addonData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedAddon) {
        // Transform _id to id for frontend compatibility
        (updatedAddon as any).id = (updatedAddon as any)._id;
      }
      return updatedAddon as IAddOns;
    } catch (error) {
      console.error('Error updating addon:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await AddOns.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting addon:', error);
      return false;
    }
  }
}