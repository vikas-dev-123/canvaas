import { connectToDatabase } from '../lib/db';
import { SubAccount, ISubAccount } from '../models/SubAccount';
import { v4 as uuidv4 } from 'uuid';

export class SubAccountService {
  static async findById(id: string): Promise<ISubAccount | null> {
    await connectToDatabase();
    try {
      // Find by the custom id field (UUID) - primary application ID
      const subAccount = await SubAccount.findOne({ id: id }).lean();
      
      if (subAccount) {
        // Ensure the id field is preserved and return a clean plain object
        const cleanSubAccount = { ...subAccount };
        cleanSubAccount.id = cleanSubAccount.id || (cleanSubAccount as any)._id;
        // Remove Mongoose-specific properties
        delete (cleanSubAccount as any).__v;
        return cleanSubAccount as ISubAccount;
      }
      // Return clean object if no subaccount found
      return subAccount as ISubAccount;
    } catch (error) {
      console.error('Error finding subaccount by ID:', error);
      return null;
    }
  }

  static async findByAgencyId(agencyId: string): Promise<ISubAccount[]> {
    await connectToDatabase();
    try {
      const subAccounts = await SubAccount.find({ agencyId }).lean();
      // Ensure the id field is preserved for all subaccounts and return clean plain objects
      const result = subAccounts.map(subAccount => {
        const cleanSubAccount = { ...subAccount };
        cleanSubAccount.id = cleanSubAccount.id || (cleanSubAccount as any)._id;
        // Remove Mongoose-specific properties
        delete (cleanSubAccount as any).__v;
        delete (cleanSubAccount as any)._id;
        return cleanSubAccount as ISubAccount;
      });
      return result;
    } catch (error) {
      console.error('Error finding subaccounts by agency ID:', error);
      return [];
    }
  }

  static async create(subAccountData: Omit<ISubAccount, '_id' | 'createdAt' | 'updatedAt'>): Promise<ISubAccount> {
    await connectToDatabase();
    try {
      // Ensure the subaccount has a UUID id if not provided
      const dataToSave = {
        ...subAccountData,
        id: subAccountData.id || uuidv4()
      };
      const subAccount = new SubAccount(dataToSave);
      const savedSubAccount = await subAccount.save();
      const result = savedSubAccount.toObject();
      // Create a clean plain object without Mongoose-specific properties
      const cleanResult = { ...result };
      // Ensure the id field is preserved
      cleanResult.id = cleanResult.id;
      // Remove Mongoose-specific properties
      delete (cleanResult as any).__v;
      delete (cleanResult as any)._id;
      return cleanResult as ISubAccount;
    } catch (error) {
      console.error('Error creating subaccount:', error);
      throw error;
    }
  }

  static async update(id: string, subAccountData: Partial<Omit<ISubAccount, '_id' | 'createdAt' | 'updatedAt'>>): Promise<ISubAccount | null> {
    await connectToDatabase();
    try {
      const updatedSubAccount = await SubAccount.findOneAndUpdate(
        { id: id },
        { ...subAccountData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedSubAccount) {
        // Create a clean plain object without Mongoose-specific properties
        const cleanUpdatedSubAccount = { ...updatedSubAccount };
        // Ensure the id field is preserved
        cleanUpdatedSubAccount.id = cleanUpdatedSubAccount.id;
        // Remove Mongoose-specific properties
        delete (cleanUpdatedSubAccount as any).__v;
        return cleanUpdatedSubAccount as ISubAccount;
      }
      // Return clean object if no subaccount found
      return updatedSubAccount as ISubAccount;
    } catch (error) {
      console.error('Error updating subaccount:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await SubAccount.findOneAndDelete({ id: id });
      return !!result;
    } catch (error) {
      console.error('Error deleting subaccount:', error);
      return false;
    }
  }
}