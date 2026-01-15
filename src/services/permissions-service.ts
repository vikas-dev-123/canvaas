import { connectDB } from '../lib/db';
import { Permissions, IPermissions } from '../models/Permissions';

export class PermissionsService {
  static async findById(id: string): Promise<IPermissions | null> {
    await connectDB();
    try {
      const permission = await Permissions.findById(id).lean();
      if (permission) {
        // Clean up the permission object for Next.js compatibility
        const { _id, __v, ...cleanPermission } = permission;
        cleanPermission.id = cleanPermission.id ?? _id?.toString();
        return cleanPermission as IPermissions;
      }
      return null;
    } catch (error) {
      console.error('Error finding permission by ID:', error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<IPermissions[]> {
    await connectDB();
    try {
      const permissions = await Permissions.find({ email }).lean();
      // Clean up the permission objects for Next.js compatibility
      const result = permissions.map(permission => {
        const { _id, __v, ...cleanPermission } = permission;
        cleanPermission.id = cleanPermission.id ?? _id?.toString();
        return cleanPermission as IPermissions;
      });
      return result;
    } catch (error) {
      console.error('Error finding permissions by email:', error);
      return [];
    }
  }

  static async findByEmailAndSubAccountId(email: string, subAccountId: string): Promise<IPermissions | null> {
    await connectDB();
    try {
      const permission = await Permissions.findOne({ email, subAccountId }).lean();
      if (permission) {
        // Clean up the permission object for Next.js compatibility
        const { _id, __v, ...cleanPermission } = permission;
        cleanPermission.id = cleanPermission.id ?? _id?.toString();
        return cleanPermission as IPermissions;
      }
      return null;
    } catch (error) {
      console.error('Error finding permission by email and subaccount ID:', error);
      return null;
    }
  }

  static async upsert(permissionData: Partial<IPermissions> & { email: string, subAccountId: string }): Promise<IPermissions> {
    await connectDB();
    try {
      let permission = await Permissions.findOne({ 
        email: permissionData.email, 
        subAccountId: permissionData.subAccountId 
      }).lean() as IPermissions;
      
      if (permission) {
        // Update existing permission
        const updatedPermission = await Permissions.findOneAndUpdate(
          { email: permissionData.email, subAccountId: permissionData.subAccountId },
          { access: permissionData.access },
          { new: true }
        ).lean();
        
        if (updatedPermission) {
          // Clean up the updated permission object for Next.js compatibility
          const { _id, __v, ...cleanPermission } = updatedPermission;
          cleanPermission.id = cleanPermission.id ?? _id?.toString();
          return cleanPermission as IPermissions;
        }
      } else {
        // Create new permission
        const newPermission = new Permissions({
          email: permissionData.email,
          subAccountId: permissionData.subAccountId,
          access: permissionData.access || false
        });
        const savedPermission = await newPermission.save();
        // Clean up the saved permission object for Next.js compatibility
        const permissionObj = savedPermission.toObject();
        const { _id, __v, ...cleanPermission } = permissionObj;
        cleanPermission.id = cleanPermission.id ?? _id?.toString();
        return cleanPermission as IPermissions;
      }
      
      throw new Error('Upsert operation failed');
    } catch (error) {
      console.error('Error upserting permission:', error);
      throw error;
    }
  }

  static async create(permissionData: Omit<IPermissions, '_id'>): Promise<IPermissions> {
    await connectDB();
    try {
      const permission = new Permissions(permissionData);
      const savedPermission = await permission.save();
      // Clean up the permission object for Next.js compatibility
      const permissionObj = savedPermission.toObject();
      const { _id, __v, ...cleanResult } = permissionObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IPermissions;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  static async update(id: string, permissionData: Partial<IPermissions>): Promise<IPermissions | null> {
    await connectDB();
    try {
      const updatedPermission = await Permissions.findByIdAndUpdate(
        id,
        { ...permissionData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedPermission) {
        // Clean up the permission object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedPermission } = updatedPermission;
        cleanUpdatedPermission.id = cleanUpdatedPermission.id ?? _id?.toString();
        return cleanUpdatedPermission as IPermissions;
      }
      return null;
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await Permissions.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting permission:', error);
      return false;
    }
  }
}