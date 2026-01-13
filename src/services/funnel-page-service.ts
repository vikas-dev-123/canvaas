import { connectToDatabase } from '../lib/db';
import { FunnelPage, IFunnelPage } from '../models/FunnelPage';

export class FunnelPageService {
  static async findById(id: string): Promise<IFunnelPage | null> {
    await connectToDatabase();
    try {
      const funnelPage = await FunnelPage.findById(id).lean();
      if (funnelPage) {
        // Transform _id to id for frontend compatibility
        (funnelPage as any).id = (funnelPage as any)._id;
      }
      return funnelPage as IFunnelPage;
    } catch (error) {
      console.error('Error finding funnel page by ID:', error);
      return null;
    }
  }

  static async findByFunnelId(funnelId: string): Promise<IFunnelPage[]> {
    await connectToDatabase();
    try {
      const funnelPages = await FunnelPage.find({ funnelId }).sort({ order: 1 }).lean();
      // Transform _id to id for all funnel pages for frontend compatibility
      const result = funnelPages.map(fp => {
        (fp as any).id = (fp as any)._id;
        return fp as IFunnelPage;
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
      // Transform _id to id for frontend compatibility
      const result = savedFunnelPage.toObject();
      (result as any).id = (result as any)._id;
      return result as IFunnelPage;
    } catch (error) {
      console.error('Error creating funnel page:', error);
      throw error;
    }
  }

  static async update(id: string, funnelPageData: Partial<IFunnelPage>): Promise<IFunnelPage | null> {
    await connectToDatabase();
    try {
      const updatedFunnelPage = await FunnelPage.findByIdAndUpdate(
        id,
        { ...funnelPageData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedFunnelPage) {
        // Transform _id to id for frontend compatibility
        (updatedFunnelPage as any).id = (updatedFunnelPage as any)._id;
      }
      return updatedFunnelPage as IFunnelPage;
    } catch (error) {
      console.error('Error updating funnel page:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await FunnelPage.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting funnel page:', error);
      return false;
    }
  }
}