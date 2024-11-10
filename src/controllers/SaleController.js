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
};

async function getAllSales() {
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
        const sale = await mongoClient.executeQuery('sales', { idPagamento: saleId });

        if(sale.length === 0) {
            throw new Error('Venda não encontrada.');
        }

        const currentSale = sale[0];
        const validStatuses = ['concluída', 'cancelada'];

        if(!validStatuses.includes(status)) {
            throw new Error('Status inválido. Use "concluída" ou "cancelada".');
        }

        if(currentSale.status === 'concluída' || currentSale.status === 'cancelada') {
            throw new Error('Venda já está concluída ou cancelada.');
        }

        await mongoClient.updateOne('sales', { idPagamento: saleId }, { $set: { status } });

        if(status === 'cancelada') {
            await mongoClient.updateOne('vehicles', { renavam: currentSale.renavam }, { $set: { status: 'disponível' } });
        }

        await mongoClient.disconnect();
        return { message: 'Status da venda atualizado para '+status+'.' };
    } catch (error) {
        throw error;
    }
};

async function deleteAllSales(query) {
    await mongoClient.connect();
    const result = await mongoClient.deleteMany('sales', query);
    await mongoClient.disconnect();
    return result;
};

module.exports = { 
    addSale, 
    getAllSales, 
    updateSaleStatus, 
    deleteAllSales
};
