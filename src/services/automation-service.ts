import { connectToDatabase } from '../lib/db';
import { Automation, IAutomation } from '../models/Automation';

export class AutomationService {
  static async findById(id: string): Promise<IAutomation | null> {
    await connectToDatabase();
    try {
      const automation = await Automation.findById(id).lean();
      return automation as IAutomation;
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
      return savedAutomation as IAutomation;
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
      return updatedAutomation as IAutomation;
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