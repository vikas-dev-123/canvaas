import { connectToDatabase } from '../lib/db';
import { Action, IAction } from '../models/Action';

export class ActionService {
  static async findById(id: string): Promise<IAction | null> {
    await connectToDatabase();
    try {
      const action = await Action.findById(id).lean();
      if (action) {
        // Clean up the action object for Next.js compatibility
        const { _id, __v, ...cleanAction } = action;
        cleanAction.id = cleanAction.id ?? _id?.toString();
        return cleanAction as IAction;
      }
      return null;
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
      // Clean up the action object for Next.js compatibility
      const actionObj = savedAction.toObject();
      const { _id, __v, ...cleanResult } = actionObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IAction;
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
      
      if (updatedAction) {
        // Clean up the action object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedAction } = updatedAction;
        cleanUpdatedAction.id = cleanUpdatedAction.id ?? _id?.toString();
        return cleanUpdatedAction as IAction;
      }
      return null;
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