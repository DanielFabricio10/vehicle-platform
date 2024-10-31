const { Pool } = require('pg');

class PostgresClient {
  constructor() {
    this.pool = new Pool({
      user: 'root',                       
      host: 'postgres',                  
      database: 'plataforma-veiculos',    
      password: 'root',                   
      port: 5432,                         
    });
  }

  async connect() {
    try {
      this.client = await this.pool.connect();
      console.log('Conexão com PostgreSQL estabelecida com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar ao PostgreSQL:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.release();
      await this.pool.end();
      console.log('Conexão com PostgreSQL encerrada.');
    } catch (error) {
      console.error('Erro ao encerrar a conexão com PostgreSQL:', error);
      throw error;
    }
  }

  async executeQuery(query, params = []) {
    try {
      const result = await this.client.query(query, params);
      return result.rows; 
    } catch (error) {
      console.error('Erro ao executar a query:', error);
      throw error;
    }
  }
}

module.exports = PostgresClient;
