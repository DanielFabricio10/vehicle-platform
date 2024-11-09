const VehicleController = require('../src/controllers/VehicleController');
const MongoDBClient = require('../src/db/MongoClient');

describe('Vehicle Controller', () => {
    
    const mongoClient = new MongoDBClient();
    mongoClient.connect();

    

    it('deve cadastrar um veículo com sucesso', async () => {
        jest.setTimeout(10000);
        const vehicleData = {
            renavam: '123456789017',
            placa: 'ABC1259',
            marca: 'Marca X',
            modelo: 'Modelo Y',
            ano: 2020,
            cor: 'Branco',
            preco: 25000
        };

        // Chama o método addVehicle para adicionar o veículo
        await VehicleController.deleteAllVehicles();
        const result = await VehicleController.addVehicle(vehicleData);

        // Verifica se o ID foi inserido corretamente
        expect(result.insertedId).toBeDefined(); // Verifica que o insertedId foi gerado

        // Verifica se o veículo foi realmente inserido no banco
        const insertedVehicle = (await mongoClient.executeQuery('vehicles', { renavam: vehicleData.renavam }))[0]; // Acessa o primeiro item do array retornado
        console.log('Veículo inserido:', insertedVehicle);
        expect(insertedVehicle).toBeTruthy();  // Verifica se o veículo foi inserido

        // Verifica se o veículo inserido tem os dados corretos
        expect(insertedVehicle.placa).toBe(vehicleData.placa);
        expect(insertedVehicle.marca).toBe(vehicleData.marca);
        expect(insertedVehicle.modelo).toBe(vehicleData.modelo);
        expect(insertedVehicle.ano).toBe(vehicleData.ano);
    });

    it('não deve permitir cadastrar um veículo com renavam ou placa duplicada', async () => {
        jest.setTimeout(10000);
        const vehicleData1 = {
            renavam: '123456789018',
            placa: 'XYZ1234',
            marca: 'Marca A',
            modelo: 'Modelo X',
            ano: 2021,
            cor: 'Preto',
            preco: 30000
        };

        const vehicleData2 = {
            renavam: '123456789018',  // Duplicado
            placa: 'XYZ1234',  // Duplicado
            marca: 'Marca B',
            modelo: 'Modelo Y',
            ano: 2022,
            cor: 'Azul',
            preco: 35000
        };

        // Chama o método addVehicle para adicionar o primeiro veículo
        await VehicleController.deleteAllVehicles();
        await VehicleController.addVehicle(vehicleData1);

        // Tenta adicionar o veículo duplicado e espera que uma exceção seja lançada
        await expect(VehicleController.addVehicle(vehicleData2)).rejects.toThrow('Renavam ou placa já cadastrados.');
    });

    it('deve atualizar um veículo com sucesso', async () => {
        jest.setTimeout(10000);
        const renavam = '123456789018';

        

        // Adiciona o veículo
        //const result = await VehicleController.addVehicle(vehicleData);

        // Agora, vamos atualizar o veículo
        const updatedData = { preco: 28000, modelo: 'Modelo W', cor: 'Preto' };
        await VehicleController.updateVehicle(renavam, updatedData);

        // Verifica se o veículo foi atualizado no banco
        const updatedVehicle = (await mongoClient.executeQuery('vehicles', { renavam: renavam }))[0];
        expect(updatedVehicle).toBeTruthy();  // Verifica se o veículo foi encontrado

        // Verifica se os dados do veículo foram atualizados corretamente
        expect(updatedVehicle.preco).toBe(updatedData.preco);
        expect(updatedVehicle.modelo).toBe(updatedData.modelo);
        expect(updatedVehicle.cor).toBe(updatedData.cor);
    });

    it('não deve atualizar um veículo com renavam não cadastrado', async () => {
        jest.setTimeout(10000);
        renavam = '123456789020';

        const updateData = { preco: 35000, modelo: 'Modelo Z' };

        // Tenta atualizar o veículo com renavam não cadastrado
        await expect(VehicleController.updateVehicle(renavam, updateData)).rejects.toThrow('Veículo não encontrado');
    });
});
