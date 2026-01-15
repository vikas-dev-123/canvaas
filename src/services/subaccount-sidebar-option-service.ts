import { connectToDatabase } from '../lib/db';
import { SubAccountSidebarOption, ISubAccountSidebarOption } from '../models/SubAccountSidebarOption';

export class SubAccountSidebarOptionService {
  static async findById(id: string): Promise<ISubAccountSidebarOption | null> {
    await connectToDatabase();
    try {
      const option = await SubAccountSidebarOption.findById(id).lean();
      if (option) {
        // Clean up the option object for Next.js compatibility
        const { _id, __v, ...cleanOption } = option;
        cleanOption.id = cleanOption.id ?? _id?.toString();
        return cleanOption as ISubAccountSidebarOption;
      }
      return null;
    } catch (error) {
      console.error('Error finding subaccount sidebar option by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<ISubAccountSidebarOption[]> {
    await connectToDatabase();
    try {
      const options = await SubAccountSidebarOption.find({ subAccountId }).lean();
      // Clean up the option objects for Next.js compatibility
      const result = options.map(option => {
        const { _id, __v, ...cleanOption } = option;
        cleanOption.id = cleanOption.id ?? _id?.toString();
        return cleanOption as ISubAccountSidebarOption;
      });
      return result;
    } catch (error) {
      console.error('Error finding subaccount sidebar options by subaccount ID:', error);
      return [];
    }
  }

  static async create(optionData: Omit<ISubAccountSidebarOption, '_id'>): Promise<ISubAccountSidebarOption> {
    await connectToDatabase();
    try {
      const option = new SubAccountSidebarOption(optionData);
      const savedOption = await option.save();
      // Clean up the option object for Next.js compatibility
      const optionObj = savedOption.toObject();
      const { _id, __v, ...cleanResult } = optionObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as ISubAccountSidebarOption;
    } catch (error) {
      console.error('Error creating subaccount sidebar option:', error);
      throw error;
    }
  }

  static async update(id: string, optionData: Partial<ISubAccountSidebarOption>): Promise<ISubAccountSidebarOption | null> {
    await connectToDatabase();
    try {
      const updatedOption = await SubAccountSidebarOption.findByIdAndUpdate(
        id,
        { ...optionData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedOption) {
        // Clean up the option object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedOption } = updatedOption;
        cleanUpdatedOption.id = cleanUpdatedOption.id ?? _id?.toString();
        return cleanUpdatedOption as ISubAccountSidebarOption;
      }
      return null;
    } catch (error) {
      console.error('Error updating subaccount sidebar option:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await SubAccountSidebarOption.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting subaccount sidebar option:', error);
      return false;
    }
  }
}