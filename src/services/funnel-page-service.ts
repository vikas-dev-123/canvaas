import { connectToDatabase } from '../lib/db';
import { FunnelPage, IFunnelPage } from '../models/FunnelPage';

export class FunnelPageService {
  static async findById(id: string): Promise<IFunnelPage | null> {
    await connectToDatabase();
    try {
      const funnelPage = await FunnelPage.findOne({ id: id }).lean();
      if (funnelPage) {
        // Clean up the funnelPage object for Next.js compatibility
        const { _id, __v, ...cleanFunnelPage } = funnelPage;
        cleanFunnelPage.id = cleanFunnelPage.id ?? _id?.toString();
        return cleanFunnelPage as IFunnelPage;
      }
      return null;
    } catch (error) {
      console.error('Error finding funnel page by ID:', error);
      return null;
    }
  }

  static async findByFunnelId(funnelId: string): Promise<IFunnelPage[]> {
    await connectToDatabase();
    try {
      const funnelPages = await FunnelPage.find({ funnelId }).sort({ order: 1 }).lean();
      // Clean up the funnelPage objects for Next.js compatibility
      const result = funnelPages.map(funnelPage => {
        const { _id, __v, ...cleanFunnelPage } = funnelPage;
        cleanFunnelPage.id = cleanFunnelPage.id ?? _id?.toString();
        return cleanFunnelPage as IFunnelPage;
      });
      return result;
    } catch (error) {
      console.error('Error finding funnel pages by funnel ID:', error);
      return [];
    }
  }

  static async create(funnelPageData: Omit<IFunnelPage, '_id'>): Promise<IFunnelPage> {
    await connectToDatabase();
    try {
      const funnelPage = new FunnelPage(funnelPageData);
      const savedFunnelPage = await funnelPage.save();
      // Clean up the funnelPage object for Next.js compatibility
      const funnelPageObj = savedFunnelPage.toObject();
      const { _id, __v, ...cleanResult } = funnelPageObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IFunnelPage;
    } catch (error) {
      console.error('Error creating funnel page:', error);
      throw error;
    }
  }

  static async update(id: string, funnelPageData: Partial<IFunnelPage>): Promise<IFunnelPage | null> {
    await connectToDatabase();
    try {
      const updatedFunnelPage = await FunnelPage.findOneAndUpdate(
        { id: id },
        { ...funnelPageData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedFunnelPage) {
        // Clean up the funnelPage object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedFunnelPage } = updatedFunnelPage;
        cleanUpdatedFunnelPage.id = cleanUpdatedFunnelPage.id ?? _id?.toString();
        return cleanUpdatedFunnelPage as IFunnelPage;
      }
      return null;
    } catch (error) {
      console.error('Error updating funnel page:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await FunnelPage.findOneAndDelete({ id: id });
      return !!result;
    } catch (error) {
      console.error('Error deleting funnel page:', error);
      return false;
    }
  }
}