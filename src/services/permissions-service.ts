import { connectToDatabase } from '../lib/db';
import { Permissions, IPermissions } from '../models/Permissions';

export class PermissionsService {
  static async findById(id: string): Promise<IPermissions | null> {
    await connectToDatabase();
    try {
      const permission = await Permissions.findById(id).lean();
      if (permission) {
        // Transform _id to id for frontend compatibility
        (permission as any).id = (permission as any)._id;
      }
      return permission as IPermissions;
    } catch (error) {
      console.error('Error finding permission by ID:', error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<IPermissions[]> {
    await connectToDatabase();
    try {
      const permissions = await Permissions.find({ email }).lean();
      // Transform _id to id for all permissions for frontend compatibility
      const result = permissions.map(p => {
        (p as any).id = (p as any)._id;
        return p as IPermissions;
      });
      return result;
    } catch (error) {
      console.error('Error finding permissions by email:', error);
      return [];
    }
  }

  static async findByEmailAndSubAccountId(email: string, subAccountId: string): Promise<IPermissions | null> {
    await connectToDatabase();
    try {
      const permission = await Permissions.findOne({ email, subAccountId }).lean();
      if (permission) {
        // Transform _id to id for frontend compatibility
        (permission as any).id = (permission as any)._id;
      }
      return permission as IPermissions;
    } catch (error) {
      console.error('Error finding permission by email and subaccount ID:', error);
      return null;
    }
  }

  static async upsert(permissionData: Partial<IPermissions> & { email: string, subAccountId: string }): Promise<IPermissions> {
    await connectToDatabase();
    try {
      let permission = await Permissions.findOne({ 
        email: permissionData.email, 
        subAccountId: permissionData.subAccountId 
      }).lean() as IPermissions;
      
      if (permission) {
        // Update existing permission
        permission = await Permissions.findOneAndUpdate(
          { email: permissionData.email, subAccountId: permissionData.subAccountId },
          { access: permissionData.access },
          { new: true }
        ).lean() as IPermissions;
      } else {
        // Create new permission
        const newPermission = new Permissions({
          email: permissionData.email,
          subAccountId: permissionData.subAccountId,
          access: permissionData.access || false
        });
        permission = await newPermission.save() as IPermissions;
      }
      
      return permission;
    } catch (error) {
      console.error('Error upserting permission:', error);
      throw error;
    }
  }

  static async create(permissionData: Omit<IPermissions, '_id'>): Promise<IPermissions> {
    await connectToDatabase();
    try {
      const permission = new Permissions(permissionData);
      const savedPermission = await permission.save();
      // Transform _id to id for frontend compatibility
      const result = savedPermission.toObject();
      (result as any).id = (result as any)._id;
      return result as IPermissions;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  static async update(id: string, permissionData: Partial<IPermissions>): Promise<IPermissions | null> {
    await connectToDatabase();
    try {
      const updatedPermission = await Permissions.findByIdAndUpdate(
        id,
        { ...permissionData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedPermission) {
        // Transform _id to id for frontend compatibility
        (updatedPermission as any).id = (updatedPermission as any)._id;
      }
      return updatedPermission as IPermissions;
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Permissions.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting permission:', error);
      return false;
    }
  }
}