import { pool } from './mysql-db';

/**
 * Execute a transaction with automatic rollback on error
 */
export const withTransaction = async <T>(
  callback: (connection: any) => Promise<T>
): Promise<T> => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Execute a query within a transaction
 * This is a helper to ensure all operations happen within a transaction
 */
export const executeInTransaction = async <T>(
  query: (connection: any) => Promise<T>
): Promise<T> => {
  return withTransaction(query);
};