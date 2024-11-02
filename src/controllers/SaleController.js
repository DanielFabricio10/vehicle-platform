const saleService = require('../services/SaleService');
const MongoDBClient = require('../db/MongoClient');

const mongoClient = new MongoDBClient();

async function addSale(req, res) {
  try {
    const saleData = req.body;
    const newSale = await saleService.createSale(saleData);
    res.status(201).json({ message: 'Carro vendido com sucesso', newSale});
  } catch (error) {
    console.error('Erro ao cadastrar venda:', error);
    res.status(400).json({ error: error.message });
  }
}

const getAllSales = async () => {
    try {
        await mongoClient.connect();
        const sales = await mongoClient.executeQuery('sales', {});
        return sales;
    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        throw error;
    } finally {
        await mongoClient.disconnect();
    }
};

module.exports = { addSale, getAllSales };
