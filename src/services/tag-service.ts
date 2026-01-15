import { connectToDatabase } from '../lib/db';
import { Tag, ITag } from '../models/Tag';

export class TagService {
  static async findById(id: string): Promise<ITag | null> {
    await connectToDatabase();
    try {
      const tag = await Tag.findById(id).lean();
      if (tag) {
        // Clean up the tag object for Next.js compatibility
        const { _id, __v, ...cleanTag } = tag;
        cleanTag.id = cleanTag.id ?? _id?.toString();
        return cleanTag as ITag;
      }
      return null;
    } catch (error) {
      console.error('Error finding tag by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<ITag[]> {
    await connectToDatabase();
    try {
      const tags = await Tag.find({ subAccountId }).lean();
      // Clean up the tag objects for Next.js compatibility
      const result = tags.map(tag => {
        const { _id, __v, ...cleanTag } = tag;
        cleanTag.id = cleanTag.id ?? _id?.toString();
        return cleanTag as ITag;
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
      // Clean up the tag object for Next.js compatibility
      const tagObj = savedTag.toObject();
      const { _id, __v, ...cleanResult } = tagObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as ITag;
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
        // Clean up the tag object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedTag } = updatedTag;
        cleanUpdatedTag.id = cleanUpdatedTag.id ?? _id?.toString();
        return cleanUpdatedTag as ITag;
      }
      return null;
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