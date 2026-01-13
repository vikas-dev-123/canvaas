import { connectToDatabase } from '../lib/db';
import { Tag, ITag } from '../models/Tag';

export class TagService {
  static async findById(id: string): Promise<ITag | null> {
    await connectToDatabase();
    try {
      const tag = await Tag.findById(id).lean();
      if (tag) {
        // Transform _id to id for frontend compatibility
        (tag as any).id = (tag as any)._id;
      }
      return tag as ITag;
    } catch (error) {
      console.error('Error finding tag by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<ITag[]> {
    await connectToDatabase();
    try {
      const tags = await Tag.find({ subAccountId }).lean();
      // Transform _id to id for all tags for frontend compatibility
      const result = tags.map(tag => {
        (tag as any).id = (tag as any)._id;
        return tag as ITag;
      });
      return result;
    } catch (error) {
      console.error('Error finding tags by subaccount ID:', error);
      return [];
    }
  }

  static async create(tagData: Omit<ITag, '_id'>): Promise<ITag> {
    await connectToDatabase();
    try {
      const tag = new Tag(tagData);
      const savedTag = await tag.save();
      // Transform _id to id for frontend compatibility
      const result = savedTag.toObject();
      (result as any).id = (result as any)._id;
      return result as ITag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  static async update(id: string, tagData: Partial<ITag>): Promise<ITag | null> {
    await connectToDatabase();
    try {
      const updatedTag = await Tag.findByIdAndUpdate(
        id,
        { ...tagData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedTag) {
        // Transform _id to id for frontend compatibility
        (updatedTag as any).id = (updatedTag as any)._id;
      }
      return updatedTag as ITag;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Tag.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    }
  }
}