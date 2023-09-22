import { Pool } from 'pg';
import MybatisMapper from 'mybatis-mapper';

const pool = new Pool({
    //connectionString: "postgres://default:wjDaO1Gd0BhP@ep-holy-recipe-99329247-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb" + "?sslmode=require"
    user: 'postgres', // 사용자 이름
    host: '192.168.100.24', // 호스트 주소
    database: 'bescon', // 데이터베이스 이름
    password: '1234', // 비밀번호
    port: 5432, // 포트 번호
});

MybatisMapper.createMapper(['src/pages/api/mybatisMapper.xml']);

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
      // 연결 해제
      
    }
}