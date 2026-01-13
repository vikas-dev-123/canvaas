import { connectToDatabase } from '../lib/db';
import { User, IUser } from '../models/User';
import { Role } from '../lib/enums';

export class UserService {
  static async findById(id: string): Promise<IUser | null> {
    await connectToDatabase();
    try {
      const user = await User.findById(id).lean();
      if (user) {
        // Transform _id to id for frontend compatibility
        (user as any).id = (user as any)._id;
      }
      return user as IUser;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    await connectToDatabase();
    try {
      const user = await User.findOne({ email }).lean();
      if (user) {
        // Transform _id to id for frontend compatibility
        (user as any).id = (user as any)._id;
      }
      return user as IUser;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async create(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    await connectToDatabase();
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      // Transform _id to id for frontend compatibility
      const result = savedUser.toObject();
      (result as any).id = (result as any)._id;
      return result as IUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id: string, userData: Partial<Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IUser | null> {
    await connectToDatabase();
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { ...userData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedUser) {
        // Transform _id to id for frontend compatibility
        (updatedUser as any).id = (updatedUser as any)._id;
      }
      return updatedUser as IUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  static async findByAgencyId(agencyId: string): Promise<IUser[]> {
    await connectToDatabase();
    try {
      const users = await User.find({ agencyId }).lean();
      // Transform _id to id for all users for frontend compatibility
      const result = users.map(user => {
        (user as any).id = (user as any)._id;
        return user as IUser;
      });
      return result;
    } catch (error) {
      console.error('Error finding users by agency ID:', error);
      return [];
    }
  }
}