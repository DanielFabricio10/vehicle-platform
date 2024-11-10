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

    let existingVehicle;
    try {
        existingVehicle = await mongoClient.executeQuery('vehicles', {
            $or: [
                { renavam: vehicleData.renavam },
                { placa: vehicleData.placa }
            ]
        });
    } catch (error) {
        await mongoClient.disconnect();
        throw new Error('Erro ao verificar veículo no banco de dados.');
    }

    if (!Array.isArray(existingVehicle)) {
        await mongoClient.disconnect();
        throw new Error('Erro ao verificar veículo no banco de dados.');
    }

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

async function getVehicles(status, order) {
    try {
        await mongoClient.connect();

        const query = {};

        if(status) {
            query.status = status;
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const vehicles = await mongoClient.executeQueryWithSort('vehicles', query, { preco: sortOrder });

        await mongoClient.disconnect();
        return vehicles;

    } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        throw new Error('Erro ao buscar veículos');
    }
}

async function getVehicleRenavam(renavamSelect) {
    try {
        await mongoClient.connect();
        const vehicles = await mongoClient.executeQuery('vehicles', {renavam: renavamSelect});

        await mongoClient.disconnect();
        return vehicles[0];

    } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        throw new Error('Erro ao buscar veículos');
    }
}

async function deleteAllVehicles(query) {
    await mongoClient.connect();
    const result = await mongoClient.deleteMany('vehicles', query);
    await mongoClient.disconnect();
    return result;
}

module.exports = {
    addVehicle,
    updateVehicle,
    deleteAllVehicles,
    getVehicles,
    getVehicleRenavam
};