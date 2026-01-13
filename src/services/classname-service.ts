import { connectToDatabase } from '../lib/db';
import { ClassName, IClassName } from '../models/ClassName';

export class ClassNameService {
  static async findById(id: string): Promise<IClassName | null> {
    await connectToDatabase();
    try {
      const className = await ClassName.findById(id).lean();
      return className as IClassName;
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
      return savedClassName as IClassName;
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
      return updatedClassName as IClassName;
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