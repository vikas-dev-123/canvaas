import { connectToDatabase } from '../lib/db';
import { Pipeline, IPipeline } from '../models/Pipeline';

export class PipelineService {
  static async findById(id: string): Promise<IPipeline | null> {
    await connectToDatabase();
    try {
      const pipeline = await Pipeline.findById(id).lean();
      if (pipeline) {
        // Transform _id to id for frontend compatibility
        (pipeline as any).id = (pipeline as any)._id;
      }
      return pipeline as IPipeline;
    } catch (error) {
      console.error('Error finding pipeline by ID:', error);
      return null;
    }
  }

  static async create(pipelineData: Omit<IPipeline, '_id'>): Promise<IPipeline> {
    await connectToDatabase();
    try {
      const pipeline = new Pipeline(pipelineData);
      const savedPipeline = await pipeline.save();
      // Transform _id to id for frontend compatibility
      const result = savedPipeline.toObject();
      (result as any).id = (result as any)._id;
      return result as IPipeline;
    } catch (error) {
      console.error('Error creating pipeline:', error);
      throw error;
    }
  }

  static async update(id: string, pipelineData: Partial<IPipeline>): Promise<IPipeline | null> {
    await connectToDatabase();
    try {
      const updatedPipeline = await Pipeline.findByIdAndUpdate(
        id,
        { ...pipelineData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedPipeline) {
        // Transform _id to id for frontend compatibility
        (updatedPipeline as any).id = (updatedPipeline as any)._id;
      }
      return updatedPipeline as IPipeline;
    } catch (error) {
      console.error('Error updating pipeline:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Pipeline.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting pipeline:', error);
      return false;
    }
  }
}