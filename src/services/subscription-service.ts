import { connectToDatabase } from '../lib/db';
import { Subscription, ISubscription } from '../models/Subscription';

export class SubscriptionService {
  static async findById(id: string): Promise<ISubscription | null> {
    await connectToDatabase();
    try {
      const subscription = await Subscription.findById(id).lean();
      if (subscription) {
        // Clean up the subscription object for Next.js compatibility
        const { _id, __v, ...cleanSubscription } = subscription;
        cleanSubscription.id = cleanSubscription.id ?? _id?.toString();
        return cleanSubscription as ISubscription;
      }
      return null;
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
      // Clean up the subscription object for Next.js compatibility
      const subscriptionObj = savedSubscription.toObject();
      const { _id, __v, ...cleanResult } = subscriptionObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as ISubscription;
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
        // Clean up the subscription object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedSubscription } = updatedSubscription;
        cleanUpdatedSubscription.id = cleanUpdatedSubscription.id ?? _id?.toString();
        return cleanUpdatedSubscription as ISubscription;
      }
      return null;
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

  static async findByAgencyId(agencyId: string): Promise<ISubscription | null> {
    await connectToDatabase();
    try {
      const subscription = await Subscription.findOne({ agencyId }).lean();
      if (subscription) {
        // Clean up the subscription object for Next.js compatibility
        const { _id, __v, ...cleanSubscription } = subscription;
        cleanSubscription.id = cleanSubscription.id ?? _id?.toString();
        return cleanSubscription as ISubscription;
      }
      return null;
    } catch (error) {
      console.error('Error finding subscription by agency ID:', error);
      return null;
    }
  }
}