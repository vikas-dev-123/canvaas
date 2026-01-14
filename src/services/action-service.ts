import { connectToDatabase } from '../lib/db';
import { Action, IAction } from '../models/Action';

export class ActionService {
  static async findById(id: string): Promise<IAction | null> {
    await connectToDatabase();
    try {
      const action = await Action.findById(id).lean();
      return action as IAction;
    } catch (error) {
      console.error('Error finding action by ID:', error);
      return null;
    }
  }

  static async create(actionData: Omit<IAction, 'id'>): Promise<IAction> {
    await connectToDatabase();
    try {
      const action = new Action(actionData);
      const savedAction = await action.save();
      return savedAction as IAction;
    } catch (error) {
      console.error('Error creating action:', error);
      throw error;
    }
  }

  static async update(id: string, actionData: Partial<IAction>): Promise<IAction | null> {
    await connectToDatabase();
    try {
      const updatedAction = await Action.findByIdAndUpdate(
        id,
        { ...actionData, updatedAt: new Date() },
        { new: true }
      ).lean();
      return updatedAction as IAction;
    } catch (error) {
      console.error('Error updating action:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Action.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting action:', error);
      return false;
    }
  }
}