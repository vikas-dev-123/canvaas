import { connectToDatabase } from '../lib/db';
import { Ticket, ITicket } from '../models/Ticket';
import { Tag, ITag } from '../models/Tag';
import { TicketTag, ITicketTag } from '../models/TicketTag';

export class TicketService {
  static async findById(id: string): Promise<ITicket | null> {
    await connectToDatabase();
    try {
      const ticket = await Ticket.findById(id).lean();
      if (ticket) {
        // Clean up the ticket object for Next.js compatibility
        const { _id, __v, ...cleanTicket } = ticket;
        cleanTicket.id = cleanTicket.id ?? _id?.toString();
        return cleanTicket as ITicket;
      }
      return null;
    } catch (error) {
      console.error('Error finding ticket by ID:', error);
      return null;
    }
  }

  static async findByLaneId(laneId: string): Promise<ITicket[]> {
    await connectToDatabase();
    try {
      const tickets = await Ticket.find({ laneId }).sort({ order: 1 }).lean();
      // Clean up the ticket objects for Next.js compatibility
      const result = tickets.map(ticket => {
        const { _id, __v, ...cleanTicket } = ticket;
        cleanTicket.id = cleanTicket.id ?? _id?.toString();
        return cleanTicket as ITicket;
      });
      return result;
    } catch (error) {
      console.error('Error finding tickets by lane ID:', error);
      return [];
    }
  }

  static async findByCustomerId(customerId: string): Promise<ITicket[]> {
    await connectToDatabase();
    try {
      const tickets = await Ticket.find({ customerId }).lean();
      // Clean up the ticket objects for Next.js compatibility
      const result = tickets.map(ticket => {
        const { _id, __v, ...cleanTicket } = ticket;
        cleanTicket.id = cleanTicket.id ?? _id?.toString();
        return cleanTicket as ITicket;
      });
      return result;
    } catch (error) {
      console.error('Error finding tickets by customer ID:', error);
      return [];
    }
  }

  static async create(ticketData: Omit<ITicket, '_id'>): Promise<ITicket> {
    await connectToDatabase();
    try {
      const ticket = new Ticket(ticketData);
      const savedTicket = await ticket.save();
      // Clean up the ticket object for Next.js compatibility
      const ticketObj = savedTicket.toObject();
      const { _id, __v, ...cleanResult } = ticketObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as ITicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  static async update(id: string, ticketData: Partial<ITicket>): Promise<ITicket | null> {
    await connectToDatabase();
    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        id,
        { ...ticketData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedTicket) {
        // Clean up the ticket object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedTicket } = updatedTicket;
        cleanUpdatedTicket.id = cleanUpdatedTicket.id ?? _id?.toString();
        return cleanUpdatedTicket as ITicket;
      }
      return null;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Ticket.findByIdAndDelete(id);
      // Also remove any ticket-tag relationships
      await TicketTag.deleteMany({ ticketId: id });
      return !!result;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      return false;
    }
  }

  static async findTagsByTicketId(ticketId: string): Promise<ITag[]> {
    await connectToDatabase();
    try {
      // Find all ticket-tag relationships for this ticket
      const ticketTags = await TicketTag.find({ ticketId }).lean();
      
      // Extract tag IDs
      const tagIds = ticketTags.map(tt => tt.tagId);
      
      // Find the actual tags
      const tags = await Tag.find({ _id: { $in: tagIds } }).lean();
      
      // Clean up the tag objects for Next.js compatibility
      const result = tags.map(tag => {
        const { _id, __v, ...cleanTag } = tag;
        cleanTag.id = cleanTag.id ?? _id?.toString();
        return cleanTag as ITag;
      });
      
      return result;
    } catch (error) {
      console.error('Error finding tags by ticket ID:', error);
      return [];
    }
  }

  static async addTagsToTicket(ticketId: string, tagIds: string[]): Promise<void> {
    await connectToDatabase();
    try {
      // Create ticket-tag relationships
      const ticketTagRelationships = tagIds.map(tagId => ({
        ticketId,
        tagId
      }));
      
      // Insert the relationships
      await TicketTag.insertMany(ticketTagRelationships, { ordered: false }); // ordered: false continues despite errors
    } catch (error) {
      console.error('Error adding tags to ticket:', error);
      // Don't throw error as some relationships might have been created
    }
  }

  static async removeTagsFromTicket(ticketId: string, tagIds: string[]): Promise<void> {
    await connectToDatabase();
    try {
      // Remove specific ticket-tag relationships
      await TicketTag.deleteMany({
        ticketId,
        tagId: { $in: tagIds }
      });
    } catch (error) {
      console.error('Error removing tags from ticket:', error);
    }
  }

  static async updateTicketTags(ticketId: string, tagIds: string[]): Promise<void> {
    await connectToDatabase();
    try {
      // Remove all existing relationships for this ticket
      await TicketTag.deleteMany({ ticketId });
      
      if (tagIds.length > 0) {
        // Create new relationships
        const ticketTagRelationships = tagIds.map(tagId => ({
          ticketId,
          tagId
        }));
        
        await TicketTag.insertMany(ticketTagRelationships, { ordered: false });
      }
    } catch (error) {
      console.error('Error updating ticket tags:', error);
    }
  }
}