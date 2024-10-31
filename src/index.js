// src/index.js
/*const PostgresClient = require('./db/PostgresClient');

(async () => {
  const postgresClient = new PostgresClient();

  try {
    await postgresClient.connect();

    // Executa uma consulta para obter todas as tabelas (ou alguma outra query que você queira)
    const query = 'select * from public."Veiculos";';
    const tables = await postgresClient.executeQuery(query);
    console.log('Dados:', tables);

  } catch (error) {
    console.error('Erro durante o teste de conexão ou consulta:', error);
  } finally {
    await postgresClient.disconnect();
  }
})();*/

/*
const MongoDBClient = require('./db/MongoClient');
(async () => {
const mongoClient = new MongoDBClient();
  try {
    await mongoClient.connect();

    // Supondo que você tenha uma coleção chamada 'testCollection'
    const query = {}; // Aqui você pode passar um filtro, ou deixar vazio para obter todos os documentos
    const results = await mongoClient.executeQuery('testCollection', query);
    console.log('Documentos na coleção testCollection:', results);

  } catch (error) {
    console.error('Erro durante o teste de conexão ou consulta no MongoDB:', error);
  } finally {
    await mongoClient.disconnect();
  }
})();
*/
