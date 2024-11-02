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

  async insertOne(collectionName, vehicleData) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.insertOne(vehicleData);
      return result;
    } catch (error) {
      console.error('Erro ao inserir documento no MongoDB:', error);
      throw error;
    }
  }

  async updateOne(collectionName, query, update) {
    try {
        const collection = this.db.collection(collectionName);
        const result = await collection.updateOne(query, update);
        return result;
    } catch (error) {
        console.error('Erro ao atualizar documento no MongoDB:', error);
        throw error;
    }
  }

  async deleteMany(collectionName, query) { //REMOVER DEPOIS
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.deleteMany(query);
      return result;
    } catch (error) {
      console.error('Erro ao deletar documentos no MongoDB:', error);
      throw error;
    }
  }
}

module.exports = MongoDBClient;
