import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

export default async function handler(req, res) {
    try {
      const connection = await pool.connect();
      //const sql = MybatisMapper.getStatement("namespace1", "user_list", param);
      const { rows } = await connection.query('select user_id id,user_name as name,departmentfrom user_list');         
      connection.release();
      return res.send(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      
      
    }
}