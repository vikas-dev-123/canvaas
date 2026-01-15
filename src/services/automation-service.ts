import { connectToDatabase } from '../lib/db';
import { Automation, IAutomation } from '../models/Automation';

export class AutomationService {
  static async findById(id: string): Promise<IAutomation | null> {
    await connectToDatabase();
    try {
      const automation = await Automation.findById(id).lean();
      if (automation) {
        // Clean up the automation object for Next.js compatibility
        const { _id, __v, ...cleanAutomation } = automation;
        cleanAutomation.id = cleanAutomation.id ?? _id?.toString();
        return cleanAutomation as IAutomation;
      }
      return null;
    } catch (error) {
      console.error('Error finding automation by ID:', error);
      return null;
    }
  }

  static async create(automationData: Omit<IAutomation, '_id'>): Promise<IAutomation> {
    await connectToDatabase();
    try {
      const automation = new Automation(automationData);
      const savedAutomation = await automation.save();
      // Clean up the automation object for Next.js compatibility
      const automationObj = savedAutomation.toObject();
      const { _id, __v, ...cleanResult } = automationObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IAutomation;
    } catch (error) {
      console.error('Error creating automation:', error);
      throw error;
    }
  }

  static async update(id: string, automationData: Partial<IAutomation>): Promise<IAutomation | null> {
    await connectToDatabase();
    try {
      const updatedAutomation = await Automation.findByIdAndUpdate(
        id,
        { ...automationData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedAutomation) {
        // Clean up the automation object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedAutomation } = updatedAutomation;
        cleanUpdatedAutomation.id = cleanUpdatedAutomation.id ?? _id?.toString();
        return cleanUpdatedAutomation as IAutomation;
      }
      return null;
    } catch (error) {
      console.error('Error updating automation:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Automation.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting automation:', error);
      return false;
    }
  }
}