import { connectDB } from '../lib/db';
import { Notification, INotification } from '../models/Notification';

export class NotificationService {
  static async findById(id: string): Promise<INotification | null> {
    await connectDB();
    try {
      const notification = await Notification.findById(id).lean();
      if (notification) {
        // Clean up the notification object for Next.js compatibility
        const { _id, __v, ...cleanNotification } = notification;
        cleanNotification.id = cleanNotification.id ?? _id?.toString();
        return cleanNotification as INotification;
      }
      return null;
    } catch (error) {
      console.error('Error finding notification by ID:', error);
      return null;
    }
  }

  static async findByAgencyId(agencyId: string): Promise<INotification[]> {
    await connectDB();
    try {
      const notifications = await Notification.find({ agencyId }).lean();
      // Clean up the notification objects for Next.js compatibility
      const result = notifications.map(notification => {
        const { _id, __v, ...cleanNotification } = notification;
        cleanNotification.id = cleanNotification.id ?? _id?.toString();
        return cleanNotification as INotification;
      });
      return result;
    } catch (error) {
      console.error('Error finding notifications by agency ID:', error);
      return [];
    }
  }

  static async create(notificationData: Omit<INotification, '_id'>): Promise<INotification> {
    await connectDB();
    try {
      const notification = new Notification(notificationData);
      const savedNotification = await notification.save();
      // Clean up the notification object for Next.js compatibility
      const notificationObj = savedNotification.toObject();
      const { _id, __v, ...cleanResult } = notificationObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as INotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async update(id: string, notificationData: Partial<INotification>): Promise<INotification | null> {
    await connectDB();
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(
        id,
        { ...notificationData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedNotification) {
        // Clean up the notification object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedNotification } = updatedNotification;
        cleanUpdatedNotification.id = cleanUpdatedNotification.id ?? _id?.toString();
        return cleanUpdatedNotification as INotification;
      }
      return null;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await Notification.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
}