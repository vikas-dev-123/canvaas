import { connectToDatabase } from '../lib/db';
import { Lane, ILane } from '../models/Lane';

export class LaneService {
  static async findById(id: string): Promise<ILane | null> {
    await connectToDatabase();
    try {
      const lane = await Lane.findById(id).lean();
      if (lane) {
        // Transform _id to id for frontend compatibility
        (lane as any).id = (lane as any)._id;
      }
      return lane as ILane;
    } catch (error) {
      console.error('Error finding lane by ID:', error);
      return null;
    }
  }

  static async findByPipelineId(pipelineId: string): Promise<ILane[]> {
    await connectToDatabase();
    try {
      const lanes = await Lane.find({ pipelineId }).sort({ order: 1 }).lean();
      // Transform _id to id for all lanes for frontend compatibility
      const result = lanes.map(lane => {
        (lane as any).id = (lane as any)._id;
        return lane as ILane;
      });
      return result;
    } catch (error) {
      console.error('Error finding lanes by pipeline ID:', error);
      return [];
    }
  }

  static async create(laneData: Omit<ILane, '_id'>): Promise<ILane> {
    await connectToDatabase();
    try {
      const lane = new Lane(laneData);
      const savedLane = await lane.save();
      // Transform _id to id for frontend compatibility
      const result = savedLane.toObject();
      (result as any).id = (result as any)._id;
      return result as ILane;
    } catch (error) {
      console.error('Error creating lane:', error);
      throw error;
    }
  }

  static async update(id: string, laneData: Partial<ILane>): Promise<ILane | null> {
    await connectToDatabase();
    try {
      const updatedLane = await Lane.findByIdAndUpdate(
        id,
        { ...laneData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedLane) {
        // Transform _id to id for frontend compatibility
        (updatedLane as any).id = (updatedLane as any)._id;
      }
      return updatedLane as ILane;
    } catch (error) {
      console.error('Error updating lane:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Lane.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting lane:', error);
      return false;
    }
  }
}