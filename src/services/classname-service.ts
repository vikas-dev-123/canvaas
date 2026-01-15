import { connectToDatabase } from '../lib/db';
import { ClassName, IClassName } from '../models/ClassName';

export class ClassNameService {
  static async findById(id: string): Promise<IClassName | null> {
    await connectToDatabase();
    try {
      const className = await ClassName.findById(id).lean();
      if (className) {
        // Clean up the className object for Next.js compatibility
        const { _id, __v, ...cleanClassName } = className;
        cleanClassName.id = cleanClassName.id ?? _id?.toString();
        return cleanClassName as IClassName;
      }
      return null;
    } catch (error) {
      console.error('Error finding class name by ID:', error);
      return null;
    }
  }

  static async create(classNameData: Omit<IClassName, '_id'>): Promise<IClassName> {
    await connectToDatabase();
    try {
      const className = new ClassName(classNameData);
      const savedClassName = await className.save();
      // Clean up the className object for Next.js compatibility
      const classNameObj = savedClassName.toObject();
      const { _id, __v, ...cleanResult } = classNameObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IClassName;
    } catch (error) {
      console.error('Error creating class name:', error);
      throw error;
    }
  }

  static async update(id: string, classNameData: Partial<IClassName>): Promise<IClassName | null> {
    await connectToDatabase();
    try {
      const updatedClassName = await ClassName.findByIdAndUpdate(
        id,
        { ...classNameData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedClassName) {
        // Clean up the className object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedClassName } = updatedClassName;
        cleanUpdatedClassName.id = cleanUpdatedClassName.id ?? _id?.toString();
        return cleanUpdatedClassName as IClassName;
      }
      return null;
    } catch (error) {
      console.error('Error updating class name:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await ClassName.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting class name:', error);
      return false;
    }
  }
}