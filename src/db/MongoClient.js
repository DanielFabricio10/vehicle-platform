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
      this.db = this.client.db(this.databaseName);
    } catch (error) {
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.close();
    } catch (error) {
      throw error;
    }
  }

  async executeQuery(collectionName, query) {
    try {
      const collection = this.db.collection(collectionName);
      const results = await collection.find(query).toArray();
      return results;
    } catch (error) {
        throw error;
    }
  }

  async insertOne(collectionName, vehicleData) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.insertOne(vehicleData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateOne(collectionName, query, update) {
    try {
        const collection = this.db.collection(collectionName);
        const result = await collection.updateOne(query, update);
        return result;
    } catch (error) {
        throw error;
    }
  }

  async deleteMany(collectionName, query) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.deleteMany(query);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async executeQueryWithSort(collectionName, query, sort) {
    try {
        const collection = this.db.collection(collectionName);
        const results = await collection.find(query).sort(sort).toArray();
        return results;
    } catch (error) {
        throw error;
    }
  }
}

module.exports = MongoDBClient;
