import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { DB_DATABASE, DB_HOST, DB_PASS, DB_USER } from '../config';

const pool: Pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

export const executeTransaction = async <T = any>(operation: () => Promise<T>): Promise<T> => {
  const connection = await getConnection();
  try {
    await beginTransaction(connection);
    const result = await operation();
    await commitTransaction(connection);
    return result;
  } catch (error) {
    await rollbackTransaction(connection);
    throw error;
  } finally {
    connection.release();
  }
};

const getConnection = async (): Promise<PoolConnection> => {
  return pool.getConnection();
};

const beginTransaction = async (connection: PoolConnection): Promise<void> => {
  await connection.beginTransaction();
};

const commitTransaction = async (connection: PoolConnection): Promise<void> => {
  await connection.commit();
};

const rollbackTransaction = async (connection: PoolConnection): Promise<void> => {
  await connection.rollback();
};
