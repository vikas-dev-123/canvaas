import { connectToDatabase } from '../lib/db';
import { Subscription, ISubscription } from '../models/Subscription';

export class SubscriptionService {
  static async findById(id: string): Promise<ISubscription | null> {
    await connectToDatabase();
    try {
      const subscription = await Subscription.findById(id).lean();
      if (subscription) {
        // Transform _id to id for frontend compatibility
        (subscription as any).id = (subscription as any)._id;
      }
      return subscription as ISubscription;
    } catch (error) {
      console.error('Error finding subscription by ID:', error);
      return null;
    }
  }

  static async create(subscriptionData: Omit<ISubscription, '_id'>): Promise<ISubscription> {
    await connectToDatabase();
    try {
      const subscription = new Subscription(subscriptionData);
      const savedSubscription = await subscription.save();
      // Transform _id to id for frontend compatibility
      const result = savedSubscription.toObject();
      (result as any).id = (result as any)._id;
      return result as ISubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async update(id: string, subscriptionData: Partial<ISubscription>): Promise<ISubscription | null> {
    await connectToDatabase();
    try {
      const updatedSubscription = await Subscription.findByIdAndUpdate(
        id,
        { ...subscriptionData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedSubscription) {
        // Transform _id to id for frontend compatibility
        (updatedSubscription as any).id = (updatedSubscription as any)._id;
      }
      return updatedSubscription as ISubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Subscription.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      return false;
    }
  }
}