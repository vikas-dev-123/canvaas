import { pool } from './mysql-db';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseRepository<T> {
  protected tableName: string;
  protected idField: string;

  constructor(tableName: string, idField: string = 'id') {
    this.tableName = tableName;
    this.idField = idField;
  }

  async findById(id: string): Promise<T | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM ${this.tableName} WHERE ${this.idField} = ?`,
        [id]
      );
      
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as T;
      }
      
      return null;
    } finally {
      connection.release();
    }
  }

  async findAll(limit?: number, offset?: number): Promise<T[]> {
    const connection = await pool.getConnection();
    try {
      let query = `SELECT * FROM ${this.tableName}`;
      const params: any[] = [];
      
      if (limit !== undefined) {
        query += ' LIMIT ?';
        params.push(limit);
        
        if (offset !== undefined) {
          query += ' OFFSET ?';
          params.push(offset);
        }
      }
      
      const [rows] = await connection.execute(query, params);
      return Array.isArray(rows) ? rows as T[] : [];
    } finally {
      connection.release();
    }
  }

  async create(data: Partial<T>): Promise<T> {
    const connection = await pool.getConnection();
    try {
      // Add ID if not present and if the table uses UUID
      if (!data[this.idField as keyof T]) {
        (data as any)[this.idField] = uuidv4();
      }
      
      // Add timestamps if they exist
      const now = new Date();
      if ('createdAt' in data && !data['createdAt']) {
        (data as any)['createdAt'] = now;
      }
      if ('updatedAt' in data) {
        (data as any)['updatedAt'] = now;
      }
      
      const keys = Object.keys(data);
      const placeholders = keys.map(() => '?').join(', ');
      const values = Object.values(data);
      
      const query = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
      await connection.execute(query, values);
      
      // Return the created record
      return data as T;
    } finally {
      connection.release();
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const connection = await pool.getConnection();
    try {
      // Update timestamp if it exists
      if ('updatedAt' in data) {
        (data as any)['updatedAt'] = new Date();
      }
      
      const updates: string[] = [];
      const values: any[] = [];
      
      for (const [key, value] of Object.entries(data)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
      
      values.push(id);
      
      if (updates.length > 0) {
        const query = `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE ${this.idField} = ?`;
        await connection.execute(query, values);
      }
      
      // Return the updated record
      return await this.findById(id);
    } finally {
      connection.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        `DELETE FROM ${this.tableName} WHERE ${this.idField} = ?`,
        [id]
      );
      
      // @ts-ignore - MySQL returns affectedRows property
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}