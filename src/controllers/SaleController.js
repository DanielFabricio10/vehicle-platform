const saleService = require('../services/SaleService');
const MongoDBClient = require('../db/MongoClient');

const mongoClient = new MongoDBClient();

async function addSale(saleData) {
  try {
    const newSale = await saleService.createSale(saleData);
    return newSale;
  } catch (error) {
    throw error;
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

async function updateSaleStatus(saleId, status) {
  try {
      await mongoClient.connect();

      // Verificar se a venda existe
      const sale = await mongoClient.executeQuery('sales', { idPagamento: saleId });
      if (sale.length === 0) {
          throw new Error('Venda não encontrada.');
      }

      const currentSale = sale[0];

      // Validar se o status é válido
      const validStatuses = ['concluída', 'cancelada'];
      if (!validStatuses.includes(status)) {
          throw new Error('Status inválido. Use "concluída" ou "cancelada".');
      }

      // Verificar se a venda já foi concluída ou cancelada
      if (currentSale.status === 'concluída' || currentSale.status === 'cancelada') {
          throw new Error('Venda já está concluída ou cancelada.');
      }

      // Atualizar o status da venda
      await mongoClient.updateOne('sales', { idPagamento: saleId }, { $set: { status } });

      // Se o status for "cancelada", atualizar o status do veículo para "disponível"
      if (status === 'cancelada') {
          await mongoClient.updateOne('vehicles', { renavam: currentSale.renavam }, { $set: { status: 'disponível' } });
      }

      await mongoClient.disconnect();
      return { message: 'Status da venda atualizado para '+status+'.' };
  } catch (error) {
      throw error;
  }

}

async function deleteAllSales(query) {
    await mongoClient.connect();
    const result = await mongoClient.deleteMany('sales', query);
    await mongoClient.disconnect();
    return result;
}

module.exports = { 
    addSale, 
    getAllSales, 
    updateSaleStatus, 
    deleteAllSales
};
