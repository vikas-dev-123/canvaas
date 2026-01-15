import { connectDB } from '../lib/db';
import { SubAccount, ISubAccount } from '../models/SubAccount';
import { v4 as uuidv4 } from 'uuid';

export class SubAccountService {
  static async findById(id: string): Promise<ISubAccount | null> {
    await connectDB();
    try {
      // Find by the custom id field (UUID) - primary application ID
      const subAccount = await SubAccount.findOne({ id: id }).lean();
      
      if (subAccount) {
        // Clean up the subAccount object for Next.js compatibility
        const { _id, __v, ...cleanSubAccount } = subAccount;
        cleanSubAccount.id = cleanSubAccount.id ?? _id?.toString();
        return cleanSubAccount as ISubAccount;
      }
      return null;
    } catch (error) {
      console.error('Error finding subaccount by ID:', error);
      return null;
    }
  }

  static async findByAgencyId(agencyId: string): Promise<ISubAccount[]> {
    await connectDB();
    try {
      const subAccounts = await SubAccount.find({ agencyId }).lean();
      // Clean up the subAccount objects for Next.js compatibility
      const result = subAccounts.map(subAccount => {
        const { _id, __v, ...cleanSubAccount } = subAccount;
        cleanSubAccount.id = cleanSubAccount.id ?? _id?.toString();
        return cleanSubAccount as ISubAccount;
      });
      return result;
    } catch (error) {
      console.error('Error finding subaccounts by agency ID:', error);
      return [];
    }
  }

  static async create(subAccountData: Omit<ISubAccount, '_id' | 'createdAt' | 'updatedAt'>): Promise<ISubAccount> {
    await connectDB();
    try {
      // Ensure the subaccount has a UUID id if not provided
      const dataToSave = {
        ...subAccountData,
        id: subAccountData.id || uuidv4()
      };
      const subAccount = new SubAccount(dataToSave);
      const savedSubAccount = await subAccount.save();
      // Clean up the subAccount object for Next.js compatibility
      const subAccountObj = savedSubAccount.toObject();
      const { _id, __v, ...cleanResult } = subAccountObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as ISubAccount;
    } catch (error) {
      console.error('Error creating subaccount:', error);
      throw error;
    }
  }

  static async update(id: string, subAccountData: Partial<Omit<ISubAccount, '_id' | 'createdAt' | 'updatedAt'>>): Promise<ISubAccount | null> {
    await connectDB();
    try {
      const updatedSubAccount = await SubAccount.findOneAndUpdate(
        { id: id },
        { ...subAccountData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedSubAccount) {
        // Clean up the subAccount object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedSubAccount } = updatedSubAccount;
        cleanUpdatedSubAccount.id = cleanUpdatedSubAccount.id ?? _id?.toString();
        return cleanUpdatedSubAccount as ISubAccount;
      }
      return null;
    } catch (error) {
      console.error('Error updating subaccount:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await SubAccount.findOneAndDelete({ id: id });
      return !!result;
    } catch (error) {
      console.error('Error deleting subaccount:', error);
      return false;
    }
  }
}