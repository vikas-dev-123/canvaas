import { connectToDatabase } from '../lib/db';
import { Pipeline, IPipeline } from '../models/Pipeline';

export class PipelineService {
  static async findById(id: string): Promise<IPipeline | null> {
    await connectToDatabase();
    try {
      const pipeline = await Pipeline.findById(id).lean();
      if (pipeline) {
        // Clean up the pipeline object for Next.js compatibility
        const { _id, __v, ...cleanPipeline } = pipeline;
        cleanPipeline.id = cleanPipeline.id ?? _id?.toString();
        return cleanPipeline as IPipeline;
      }
      return null;
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
      // Clean up the pipeline object for Next.js compatibility
      const pipelineObj = savedPipeline.toObject();
      const { _id, __v, ...cleanResult } = pipelineObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IPipeline;
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
        // Clean up the pipeline object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedPipeline } = updatedPipeline;
        cleanUpdatedPipeline.id = cleanUpdatedPipeline.id ?? _id?.toString();
        return cleanUpdatedPipeline as IPipeline;
      }
      return null;
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