import { pool } from './mysql-db';
import fs from 'fs';
import path from 'path';

/**
 * Execute the MySQL schema migration
 */
export const runMigration = async (): Promise<void> => {
  try {
    console.log('Starting database migration...');
    
    // Read the SQL schema file
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'mysql-schema.sql');
    const sqlSchema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    const connection = await pool.getConnection();
    
    try {
      // Execute each statement
      for (const statement of statements) {
        if (statement) {
          console.log(`Executing: ${statement.substring(0, 100)}...`);
          await connection.execute(statement);
        }
      }
      
      console.log('Database migration completed successfully!');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  }
};

// If this file is run directly, execute the migration
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('Migration script completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}