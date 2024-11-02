const MongoDBClient = require('../db/MongoClient');
const Sale = require('../models/SalesModel');

const mongoClient = new MongoDBClient();

async function createSale(saleData) {
  await mongoClient.connect();

  // Valida CPF/CNPJ
  const validation = Sale.isValid(saleData);
  if (!validation.valid) {
    await mongoClient.disconnect();
    throw new Error(validation.message);
  }

  // Verifica se o veículo existe e está disponível
  const vehicle = await mongoClient.executeQuery('vehicles', { renavam: saleData.renavam });
  if (!vehicle.length || vehicle[0].status !== 'disponível') {
    await mongoClient.disconnect();
    throw new Error('Veículo não encontrado ou não disponível.');
  }

  // Cria a venda
  const newSale = new Sale({
    cpfCnpj: saleData.cpfCnpj,
    nomeCliente: saleData.nomeCliente,
    renavam: saleData.renavam,
    valorCompra: vehicle[0].preco
  });
  
  await mongoClient.insertOne('sales', newSale); // Insere a venda na coleção

  // Atualiza o status do veículo para vendido
  await mongoClient.updateOne('vehicles', { renavam: saleData.renavam }, { $set:  { status: 'vendido' }});
  //await mongoClient.updateOne('vehicles', { renavam: saleData.renavam }, { status: 'vendido' });

  await mongoClient.disconnect();
  return newSale; // Retorna os dados da venda criada*/
}

module.exports = { createSale };
