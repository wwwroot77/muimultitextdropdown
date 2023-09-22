import { Pool } from 'pg';
import MybatisMapper from 'mybatis-mapper';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

MybatisMapper.createMapper(['tmp/mybatisMapper.xml']);

export default async function handler(req, res) {
    try {
      const connection = await pool.connect();
      const username = "bescon";
      var param = {
        user_id : username
      }
      console.log("username" + username);
      const sql = MybatisMapper.getStatement("namespace1", "user_list", param);
      const { rows } = await connection.query(sql);         
      connection.release();
      return res.send(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      
      
    }
}