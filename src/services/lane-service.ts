import { connectDB } from '../lib/db';
import { Lane, ILane } from '../models/Lane';

export class LaneService {
  static async findById(id: string): Promise<ILane | null> {
    await connectDB();
    try {
      const lane = await Lane.findById(id).lean();
      if (lane) {
        // Clean up the lane object for Next.js compatibility
        const { _id, __v, ...cleanLane } = lane;
        cleanLane.id = cleanLane.id ?? _id?.toString();
        return cleanLane as ILane;
      }
      return null;
    } catch (error) {
      console.error('Error finding lane by ID:', error);
      return null;
    }
  }

  static async findByPipelineId(pipelineId: string): Promise<ILane[]> {
    await connectDB();
    try {
      const lanes = await Lane.find({ pipelineId }).sort({ order: 1 }).lean();
      // Clean up the lane objects for Next.js compatibility
      const result = lanes.map(lane => {
        const { _id, __v, ...cleanLane } = lane;
        cleanLane.id = cleanLane.id ?? _id?.toString();
        return cleanLane as ILane;
      });
      return result;
    } catch (error) {
      console.error('Error finding lanes by pipeline ID:', error);
      return [];
    }
  }

  static async create(laneData: Omit<ILane, '_id'>): Promise<ILane> {
    await connectDB();
    try {
      const lane = new Lane(laneData);
      const savedLane = await lane.save();
      // Clean up the lane object for Next.js compatibility
      const laneObj = savedLane.toObject();
      const { _id, __v, ...cleanResult } = laneObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as ILane;
    } catch (error) {
      console.error('Error creating lane:', error);
      throw error;
    }
  }

  static async update(id: string, laneData: Partial<ILane>): Promise<ILane | null> {
    await connectDB();
    try {
      const updatedLane = await Lane.findByIdAndUpdate(
        id,
        { ...laneData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedLane) {
        // Clean up the lane object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedLane } = updatedLane;
        cleanUpdatedLane.id = cleanUpdatedLane.id ?? _id?.toString();
        return cleanUpdatedLane as ILane;
      }
      return null;
    } catch (error) {
      console.error('Error updating lane:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await Lane.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting lane:', error);
      return false;
    }
  }
}