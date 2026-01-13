import { connectToDatabase } from '../lib/db';
import { AgencySidebarOption, IAgencySidebarOption } from '../models/AgencySidebarOption';

export class AgencySidebarOptionService {
  static async findById(id: string): Promise<IAgencySidebarOption | null> {
    await connectToDatabase();
    try {
      const option = await AgencySidebarOption.findById(id).lean();
      return option as IAgencySidebarOption;
    } catch (error) {
      console.error('Error finding agency sidebar option by ID:', error);
      return null;
    }
  }

  static async findByAgencyId(agencyId: string): Promise<IAgencySidebarOption[]> {
    await connectToDatabase();
    try {
      const options = await AgencySidebarOption.find({ agencyId }).lean();
      return options as IAgencySidebarOption[];
    } catch (error) {
      console.error('Error finding agency sidebar options by agency ID:', error);
      return [];
    }
  }

  static async create(optionData: Omit<IAgencySidebarOption, '_id'>): Promise<IAgencySidebarOption> {
    await connectToDatabase();
    try {
      const option = new AgencySidebarOption(optionData);
      const savedOption = await option.save();
      return savedOption as IAgencySidebarOption;
    } catch (error) {
      console.error('Error creating agency sidebar option:', error);
      throw error;
    }
  }

  static async update(id: string, optionData: Partial<IAgencySidebarOption>): Promise<IAgencySidebarOption | null> {
    await connectToDatabase();
    try {
      const updatedOption = await AgencySidebarOption.findByIdAndUpdate(
        id,
        { ...optionData, updatedAt: new Date() },
        { new: true }
      ).lean();
      return updatedOption as IAgencySidebarOption;
    } catch (error) {
      console.error('Error updating agency sidebar option:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await AgencySidebarOption.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting agency sidebar option:', error);
      return false;
    }
  }
}