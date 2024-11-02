const Vehicle = require('../models/Vehicle');
const MongoDBClient = require('../db/MongoClient');

const mongoClient = new MongoDBClient();

async function addVehicle(vehicleData) {
    await mongoClient.connect();

    const validation = Vehicle.isValid(vehicleData);
    
    if (!validation.valid) {
        await mongoClient.disconnect();
        throw new Error(validation.message); 
    }

    const existingVehicle = await mongoClient.executeQuery('vehicles', {
        $or: [
            { renavam: vehicleData.renavam },
            { placa: vehicleData.placa }
        ]
    });

    if (existingVehicle.length > 0) {
        await mongoClient.disconnect();
        throw new Error('Renavam ou placa já cadastrados.');
    }

    const newVehicle = new Vehicle(vehicleData);
    const result = await mongoClient.insertOne('vehicles', newVehicle);

    await mongoClient.disconnect();
    return result;
}

async function updateVehicle(renavam, updatedData) {
    await mongoClient.connect();

    try {
        const existingVehicle = await mongoClient.executeQuery('vehicles', { renavam });

        if (existingVehicle.length === 0) {
            throw new Error('Veículo não encontrado.');
        }

        const allowedFields = ['marca', 'modelo', 'ano', 'cor', 'preco', 'placa'];
        const updateData = {};

        for (const field of allowedFields) {
            if (updatedData[field] !== undefined) {
                updateData[field] = updatedData[field];
            }
        }

        const result = await mongoClient.updateOne('vehicles', { renavam }, { $set: updateData });

        return result;
    } catch (error) {
        console.error('Erro ao atualizar veículo:', error);
        throw error;
    } finally {
        await mongoClient.disconnect();
    }
}

const getAllVehicles = async () => {
    try {
        await mongoClient.connect();
        const vehicles = await mongoClient.executeQuery('vehicles', {});
        return vehicles;
    } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        throw error;
    } finally {
        await mongoClient.disconnect();
    }
};

async function deleteAllVehicles() { //REMOVER DEPOIS
    await mongoClient.connect();
    const result = await mongoClient.deleteMany('vehicles', {}); // Deleta todos os documentos
    await mongoClient.disconnect();
    return result;
}

module.exports = {
    addVehicle,
    updateVehicle,
    getAllVehicles,
    deleteAllVehicles
};