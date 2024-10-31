const { MongoClient } = require('mongodb');

class MongoDBClient {
  constructor() {
    this.url = 'mongodb://mongo:27017'; 
    this.databaseName = 'plataforma-veiculos';
    this.client = new MongoClient(this.url);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Conexão com MongoDB estabelecida com sucesso!');
      this.db = this.client.db(this.databaseName);
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log('Conexão com MongoDB encerrada.');
    } catch (error) {
      console.error('Erro ao encerrar a conexão com MongoDB:', error);
      throw error;
    }
  }

  async executeQuery(collectionName, query) {
    try {
      const collection = this.db.collection(collectionName);
      const results = await collection.find(query).toArray();
      return results;
    } catch (error) {
      console.error('Erro ao executar a query no MongoDB:', error);
      throw error;
    }
  }
}

module.exports = MongoDBClient;
