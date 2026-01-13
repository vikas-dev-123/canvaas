import { connectToDatabase } from '../lib/db';
import { SubAccount, ISubAccount } from '../models/SubAccount';

export class SubAccountService {
  static async findById(id: string): Promise<ISubAccount | null> {
    await connectToDatabase();
    try {
      const subAccount = await SubAccount.findById(id).lean();
      if (subAccount) {
        // Transform _id to id for frontend compatibility
        (subAccount as any).id = (subAccount as any)._id;
      }
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
      // Transform _id to id for all subaccounts for frontend compatibility
      const result = subAccounts.map(subAccount => {
        (subAccount as any).id = (subAccount as any)._id;
        return subAccount as ISubAccount;
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
      const subAccount = new SubAccount(subAccountData);
      const savedSubAccount = await subAccount.save();
      // Transform _id to id for frontend compatibility
      const result = savedSubAccount.toObject();
      (result as any).id = (result as any)._id;
      return result as ISubAccount;
    } catch (error) {
      console.error('Error creating subaccount:', error);
      throw error;
    }
  }

  static async update(id: string, subAccountData: Partial<Omit<ISubAccount, '_id' | 'createdAt' | 'updatedAt'>>): Promise<ISubAccount | null> {
    await connectToDatabase();
    try {
      const updatedSubAccount = await SubAccount.findByIdAndUpdate(
        id,
        { ...subAccountData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedSubAccount) {
        // Transform _id to id for frontend compatibility
        (updatedSubAccount as any).id = (updatedSubAccount as any)._id;
      }
      return updatedSubAccount as ISubAccount;
    } catch (error) {
      console.error('Error updating subaccount:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await SubAccount.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting subaccount:', error);
      return false;
    }
  }
}