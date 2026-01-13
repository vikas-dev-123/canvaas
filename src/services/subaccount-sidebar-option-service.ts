import { connectToDatabase } from '../lib/db';
import { SubAccountSidebarOption, ISubAccountSidebarOption } from '../models/SubAccountSidebarOption';

export class SubAccountSidebarOptionService {
  static async findById(id: string): Promise<ISubAccountSidebarOption | null> {
    await connectToDatabase();
    try {
      const option = await SubAccountSidebarOption.findById(id).lean();
      return option as ISubAccountSidebarOption;
    } catch (error) {
      console.error('Error finding subaccount sidebar option by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<ISubAccountSidebarOption[]> {
    await connectToDatabase();
    try {
      const options = await SubAccountSidebarOption.find({ subAccountId }).lean();
      return options as ISubAccountSidebarOption[];
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
      return savedOption as ISubAccountSidebarOption;
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
      return updatedOption as ISubAccountSidebarOption;
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