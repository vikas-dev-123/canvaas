import { connectDB } from '../lib/db';
import { Media, IMedia } from '../models/Media';

export class MediaService {
  static async findById(id: string): Promise<IMedia | null> {
    await connectDB();
    try {
      const media = await Media.findById(id).lean();
      if (media) {
        // Clean up the media object for Next.js compatibility
        const { _id, __v, ...cleanMedia } = media;
        cleanMedia.id = cleanMedia.id ?? _id?.toString();
        return cleanMedia as IMedia;
      }
      return null;
    } catch (error) {
      console.error('Error finding media by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<IMedia[]> {
    await connectDB();
    try {
      const media = await Media.find({ subAccountId }).lean();
      // Clean up the media objects for Next.js compatibility
      const result = media.map(m => {
        const { _id, __v, ...cleanMedia } = m;
        cleanMedia.id = cleanMedia.id ?? _id?.toString();
        return cleanMedia as IMedia;
      });
      return result;
    } catch (error) {
      console.error('Error finding media by subaccount ID:', error);
      return [];
    }
  }

  static async create(mediaData: Omit<IMedia, '_id'>): Promise<IMedia> {
    await connectDB();
    try {
      const media = new Media(mediaData);
      const savedMedia = await media.save();
      // Clean up the media object for Next.js compatibility
      const mediaObj = savedMedia.toObject();
      const { _id, __v, ...cleanResult } = mediaObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IMedia;
    } catch (error) {
      console.error('Error creating media:', error);
      throw error;
    }
  }

  static async update(id: string, mediaData: Partial<IMedia>): Promise<IMedia | null> {
    await connectDB();
    try {
      const updatedMedia = await Media.findOneAndUpdate(
        { id: id },
        { ...mediaData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedMedia) {
        // Clean up the media object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedMedia } = updatedMedia;
        cleanUpdatedMedia.id = cleanUpdatedMedia.id ?? _id?.toString();
        return cleanUpdatedMedia as IMedia;
      }
      return null;
    } catch (error) {
      console.error('Error updating media:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await Media.findOneAndDelete({ id: id });
      return !!result;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }
}