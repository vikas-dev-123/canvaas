import { connectDB } from '../lib/db';
import { User, IUser } from '../models/User';
import { Role } from '../lib/enums';

export class UserService {
  static async findById(id: string): Promise<IUser | null> {
    await connectDB();
    try {
      const user = await User.findById(id).lean();
      if (user) {
        // Clean up the user object for Next.js compatibility
        const { _id, __v, ...cleanUser } = user;
        cleanUser.id = cleanUser.id ?? _id?.toString();
        return cleanUser as IUser;
      }
      return null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    try {
      const user = await User.findOne({ email }).lean();
      if (user) {
        // Clean up the user object for Next.js compatibility
        const { _id, __v, ...cleanUser } = user;
        cleanUser.id = cleanUser.id ?? _id?.toString();
        return cleanUser as IUser;
      }
      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async create(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    await connectDB();
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      // Clean up the user object for Next.js compatibility
      const userObj = savedUser.toObject();
      const { _id, __v, ...cleanResult } = userObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id: string, userData: Partial<Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IUser | null> {
    await connectDB();
    try {
      const updatedUser = await User.findOneAndUpdate(
        { id: id },
        { ...userData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedUser) {
        // Clean up the user object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedUser } = updatedUser;
        cleanUpdatedUser.id = cleanUpdatedUser.id ?? _id?.toString();
        return cleanUpdatedUser as IUser;
      }
      return null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await User.findOneAndDelete({ id: id });
      return !!result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  static async findByAgencyId(agencyId: string): Promise<IUser[]> {
    await connectDB();
    try {
      const users = await User.find({ agencyId }).lean();
      // Clean up the user objects for Next.js compatibility
      const result = users.map(user => {
        const { _id, __v, ...cleanUser } = user;
        cleanUser.id = cleanUser.id ?? _id?.toString();
        return cleanUser as IUser;
      });
      return result;
    } catch (error) {
      console.error('Error finding users by agency ID:', error);
      return [];
    }
  }
}