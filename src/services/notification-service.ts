import { connectToDatabase } from '../lib/db';
import { Notification, INotification } from '../models/Notification';

export class NotificationService {
  static async findById(id: string): Promise<INotification | null> {
    await connectToDatabase();
    try {
      const notification = await Notification.findById(id).lean();
      if (notification) {
        // Transform _id to id for frontend compatibility
        (notification as any).id = (notification as any)._id;
      }
      return notification as INotification;
    } catch (error) {
      console.error('Error finding notification by ID:', error);
      return null;
    }
  }

  static async findByAgencyId(agencyId: string): Promise<INotification[]> {
    await connectToDatabase();
    try {
      const notifications = await Notification.find({ agencyId }).lean();
      // Transform _id to id for all notifications for frontend compatibility
      const result = notifications.map(n => {
        (n as any).id = (n as any)._id;
        return n as INotification;
      });
      return result;
    } catch (error) {
      console.error('Error finding notifications by agency ID:', error);
      return [];
    }
  }

  static async create(notificationData: Omit<INotification, '_id'>): Promise<INotification> {
    await connectToDatabase();
    try {
      const notification = new Notification(notificationData);
      const savedNotification = await notification.save();
      // Transform _id to id for frontend compatibility
      const result = savedNotification.toObject();
      (result as any).id = (result as any)._id;
      return result as INotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async update(id: string, notificationData: Partial<INotification>): Promise<INotification | null> {
    await connectToDatabase();
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(
        id,
        { ...notificationData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedNotification) {
        // Transform _id to id for frontend compatibility
        (updatedNotification as any).id = (updatedNotification as any)._id;
      }
      return updatedNotification as INotification;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Notification.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
}