import { connectToDatabase } from '../lib/db';
import { Media, IMedia } from '../models/Media';

export class MediaService {
  static async findById(id: string): Promise<IMedia | null> {
    await connectToDatabase();
    try {
      const media = await Media.findById(id).lean();
      if (media) {
        // Transform _id to id for frontend compatibility
        (media as any).id = (media as any)._id;
      }
      return media as IMedia;
    } catch (error) {
      console.error('Error finding media by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<IMedia[]> {
    await connectToDatabase();
    try {
      const media = await Media.find({ subAccountId }).lean();
      // Transform _id to id for all media for frontend compatibility
      const result = media.map(m => {
        (m as any).id = (m as any)._id;
        return m as IMedia;
      });
      return result;
    } catch (error) {
      console.error('Error finding media by subaccount ID:', error);
      return [];
    }
  }

  static async create(mediaData: Omit<IMedia, '_id'>): Promise<IMedia> {
    await connectToDatabase();
    try {
      const media = new Media(mediaData);
      const savedMedia = await media.save();
      // Transform _id to id for frontend compatibility
      const result = savedMedia.toObject();
      (result as any).id = (result as any)._id;
      return result as IMedia;
    } catch (error) {
      console.error('Error creating media:', error);
      throw error;
    }
  }

  static async update(id: string, mediaData: Partial<IMedia>): Promise<IMedia | null> {
    await connectToDatabase();
    try {
      const updatedMedia = await Media.findByIdAndUpdate(
        id,
        { ...mediaData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedMedia) {
        // Transform _id to id for frontend compatibility
        (updatedMedia as any).id = (updatedMedia as any)._id;
      }
      return updatedMedia as IMedia;
    } catch (error) {
      console.error('Error updating media:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Media.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }
}