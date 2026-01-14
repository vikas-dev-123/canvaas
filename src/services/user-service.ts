import { connectToDatabase } from '../lib/db';
import { User, IUser } from '../models/User';
import { Role } from '../lib/enums';

export class UserService {
  static async findById(id: string): Promise<IUser | null> {
    await connectToDatabase();
    try {
      const user = await User.findById(id).lean();
      if (user) {
        // Transform _id to id for frontend compatibility and return a clean plain object
        const cleanUser = { ...user };
        cleanUser.id = cleanUser.id || (cleanUser as any)._id;
        // Remove Mongoose-specific properties
        delete (cleanUser as any).__v;
        return cleanUser as IUser;
      }
      // Return clean object if no user found
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
        // Transform _id to id for frontend compatibility and return a clean plain object
        const cleanUser = { ...user };
        cleanUser.id = cleanUser.id || (cleanUser as any)._id;
        // Remove Mongoose-specific properties
        delete (cleanUser as any).__v;
        return cleanUser as IUser;
      }
      // Return clean object if no user found
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
      // Transform _id to id for frontend compatibility and return a clean plain object
      const result = savedUser.toObject();
      const cleanResult = { ...result };
      cleanResult.id = cleanResult.id || (cleanResult as any)._id;
      // Remove Mongoose-specific properties
      delete (cleanResult as any).__v;
      delete (cleanResult as any)._id;
      return cleanResult as IUser;
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
        // Transform _id to id for frontend compatibility and return a clean plain object
        const cleanUpdatedUser = { ...updatedUser };
        cleanUpdatedUser.id = cleanUpdatedUser.id || (cleanUpdatedUser as any)._id;
        // Remove Mongoose-specific properties
        delete (cleanUpdatedUser as any).__v;
        return cleanUpdatedUser as IUser;
      }
      // Return clean object if no user found
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
      // Transform _id to id for all users for frontend compatibility and return clean plain objects
      const result = users.map(user => {
        const cleanUser = { ...user };
        cleanUser.id = cleanUser.id || (cleanUser as any)._id;
        // Remove Mongoose-specific properties
        delete (cleanUser as any).__v;
        delete (cleanUser as any)._id;
        return cleanUser as IUser;
      });
      return result;
    } catch (error) {
      console.error('Error finding users by agency ID:', error);
      return [];
    }
  }
}