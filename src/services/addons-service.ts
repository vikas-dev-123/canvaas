import { connectDB } from '../lib/db';
import { AddOns, IAddOns } from '../models/AddOns';

export class AddOnsService {
  static async findById(id: string): Promise<IAddOns | null> {
    await connectDB();
    try {
      const addon = await AddOns.findById(id).lean();
      if (addon) {
        // Clean up the addon object for Next.js compatibility
        const { _id, __v, ...cleanAddon } = addon;
        cleanAddon.id = cleanAddon.id ?? _id?.toString();
        return cleanAddon as IAddOns;
      }
      return null;
    } catch (error) {
      console.error('Error finding addon by ID:', error);
      return null;
    }
  }

  static async create(addonData: Omit<IAddOns, '_id'>): Promise<IAddOns> {
    await connectDB();
    try {
      const addon = new AddOns(addonData);
      const savedAddon = await addon.save();
      // Clean up the addon object for Next.js compatibility
      const addonObj = savedAddon.toObject();
      const { _id, __v, ...cleanResult } = addonObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IAddOns;
    } catch (error) {
      console.error('Error creating addon:', error);
      throw error;
    }
  }

  static async update(id: string, addonData: Partial<IAddOns>): Promise<IAddOns | null> {
    await connectDB();
    try {
      const updatedAddon = await AddOns.findByIdAndUpdate(
        id,
        { ...addonData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedAddon) {
        // Clean up the addon object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedAddon } = updatedAddon;
        cleanUpdatedAddon.id = cleanUpdatedAddon.id ?? _id?.toString();
        return cleanUpdatedAddon as IAddOns;
      }
      return null;
    } catch (error) {
      console.error('Error updating addon:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await AddOns.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting addon:', error);
      return false;
    }
  }
}