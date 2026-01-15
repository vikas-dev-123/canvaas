import { connectToDatabase } from '../lib/db';
import { AutomationInstance, IAutomationInstance } from '../models/AutomationInstance';

export class AutomationInstanceService {
  static async findById(id: string): Promise<IAutomationInstance | null> {
    await connectToDatabase();
    try {
      const instance = await AutomationInstance.findById(id).lean();
      if (instance) {
        // Clean up the instance object for Next.js compatibility
        const { _id, __v, ...cleanInstance } = instance;
        cleanInstance.id = cleanInstance.id ?? _id?.toString();
        return cleanInstance as IAutomationInstance;
      }
      return null;
    } catch (error) {
      console.error('Error finding automation instance by ID:', error);
      return null;
    }
  }

  static async create(instanceData: Omit<IAutomationInstance, '_id'>): Promise<IAutomationInstance> {
    await connectToDatabase();
    try {
      const instance = new AutomationInstance(instanceData);
      const savedInstance = await instance.save();
      // Clean up the instance object for Next.js compatibility
      const instanceObj = savedInstance.toObject();
      const { _id, __v, ...cleanResult } = instanceObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IAutomationInstance;
    } catch (error) {
      console.error('Error creating automation instance:', error);
      throw error;
    }
  }

  static async update(id: string, instanceData: Partial<IAutomationInstance>): Promise<IAutomationInstance | null> {
    await connectToDatabase();
    try {
      const updatedInstance = await AutomationInstance.findByIdAndUpdate(
        id,
        { ...instanceData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedInstance) {
        // Clean up the instance object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedInstance } = updatedInstance;
        cleanUpdatedInstance.id = cleanUpdatedInstance.id ?? _id?.toString();
        return cleanUpdatedInstance as IAutomationInstance;
      }
      return null;
    } catch (error) {
      console.error('Error updating automation instance:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await AutomationInstance.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting automation instance:', error);
      return false;
    }
  }
}