import { connectToDatabase } from '../lib/db';
import { Trigger, ITrigger } from '../models/Trigger';

export class TriggerService {
  static async findById(id: string): Promise<ITrigger | null> {
    await connectToDatabase();
    try {
      const trigger = await Trigger.findById(id).lean();
      return trigger as ITrigger;
    } catch (error) {
      console.error('Error finding trigger by ID:', error);
      return null;
    }
  }

  static async create(triggerData: Omit<ITrigger, '_id'>): Promise<ITrigger> {
    await connectToDatabase();
    try {
      const trigger = new Trigger(triggerData);
      const savedTrigger = await trigger.save();
      return savedTrigger as ITrigger;
    } catch (error) {
      console.error('Error creating trigger:', error);
      throw error;
    }
  }

  static async update(id: string, triggerData: Partial<ITrigger>): Promise<ITrigger | null> {
    await connectToDatabase();
    try {
      const updatedTrigger = await Trigger.findByIdAndUpdate(
        id,
        { ...triggerData, updatedAt: new Date() },
        { new: true }
      ).lean();
      return updatedTrigger as ITrigger;
    } catch (error) {
      console.error('Error updating trigger:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Trigger.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting trigger:', error);
      return false;
    }
  }
}