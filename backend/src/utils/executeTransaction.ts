import { createPool, Pool, PoolConnection } from 'mysql2/promise';

const pool: Pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
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
