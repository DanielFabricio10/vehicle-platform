// __tests__/databaseConnections.test.js
const PostgresClient = require('../src/db/PostgresClient'); // Ajuste o caminho conforme necessário
const MongoDBClient = require('../src/db/MongoClient'); // Ajuste o caminho conforme necessário

describe('Database Connections', () => {
    let postgresClient;
    let mongoClient;

    beforeAll(async () => {
        // Inicia a conexão com PostgreSQL
        postgresClient = new PostgresClient();
        await postgresClient.connect();
        
        // Inicia a conexão com MongoDB
        mongoClient = new MongoDBClient();
        await mongoClient.connect();
    });

    afterAll(async () => {
        // Fecha as conexões após os testes
        await postgresClient.disconnect();
        await mongoClient.disconnect();
    });

    test('PostgreSQL connection should be established and query executed', async () => {
        const query = 'SELECT * FROM public."Veiculos";';
        const results = await postgresClient.executeQuery(query);
        expect(results).toBeDefined(); // Verifica se os resultados não estão indefinidos
        expect(Array.isArray(results)).toBe(true); // Verifica se os resultados são um array
        // Você pode adicionar mais verificações dependendo do que espera dos dados
    });

    test('MongoDB connection should be established and query executed', async () => {
        const query = {}; // Aqui você pode passar um filtro, ou deixar vazio para obter todos os documentos
        const results = await mongoClient.executeQuery('testCollection', query);
        expect(results).toBeDefined(); // Verifica se os resultados não estão indefinidos
        expect(Array.isArray(results)).toBe(true); // Verifica se os resultados são um array
        // Você pode adicionar mais verificações dependendo do que espera dos dados
    });
});
