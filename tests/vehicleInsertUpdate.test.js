const VehicleController = require('../src/controllers/VehicleController');
const MongoDBClient = require('../src/db/MongoClient');

jest.setTimeout(5000);

const mongoClient = new MongoDBClient();

beforeAll(async () => {
    await mongoClient.connect();
});

beforeEach(async () => {
    await VehicleController.deleteAllVehicles({});
});

afterAll(async () => {
    await VehicleController.deleteAllVehicles({});
    await mongoClient.disconnect();
});

describe('Vehicle Controller', () => {

    const generateRenavam = () => Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('');
    const generatePlaca   = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
        const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return randomLetters + randomNumbers;
    };

    it('não deve permitir cadastrar um veículo com renavam incorreto', async () => {
        const vehicleData = {
            renavam: '12345',
            placa: 'ABC1234',
            marca: 'Marca X',
            modelo: 'Modelo Y',
            ano: 2020,
            cor: 'Branco',
            preco: 25000,
        };

        await expect(VehicleController.addVehicle(vehicleData)).rejects.toThrow(
            'O RENAVAM é obrigatório, deve ser uma string e conter exatamente 11 dígitos numéricos.'
        );
    });

    it('não deve permitir cadastrar um veículo com placa incorreta', async () => {
        const vehicleData = {
            renavam: generateRenavam(),
            placa: 'XYZ123',
            marca: 'Marca A',
            modelo: 'Modelo X',
            ano: 2021,
            cor: 'Preto',
            preco: 30000,
        };

        await expect(VehicleController.addVehicle(vehicleData)).rejects.toThrow(
            'A placa é obrigatória, deve ser uma string e seguir o formato AAA1234.'
        );
    });

    it('deve cadastrar um veículo com sucesso', async () => {
        const vehicleData = {
            renavam: generateRenavam(),
            placa: generatePlaca(),
            marca: 'Marca X',
            modelo: 'Modelo Y',
            ano: 2020,
            cor: 'Branco',
            preco: 25000,
        };

        const result = await VehicleController.addVehicle(vehicleData);
        expect(result.insertedId).toBeDefined();

        const insertedVehicle = (await mongoClient.executeQuery('vehicles', { renavam: vehicleData.renavam }))[0];
        expect(insertedVehicle).toBeTruthy();
        expect(insertedVehicle.placa).toBe(vehicleData.placa);
    });

    it('não deve permitir cadastrar um veículo com renavam ou placa duplicada', async () => {
        const renavam = generateRenavam();
        const placa   = generatePlaca();

        const vehicleData1 = {
            renavam,
            placa,
            marca: 'Marca A',
            modelo: 'Modelo X',
            ano: 2021,
            cor: 'Preto',
            preco: 30000,
        };

        const vehicleData2 = {
            renavam,
            placa,
            marca: 'Marca B',
            modelo: 'Modelo Y',
            ano: 2022,
            cor: 'Azul',
            preco: 35000,
        };

        await VehicleController.addVehicle(vehicleData1);
        await expect(VehicleController.addVehicle(vehicleData2)).rejects.toThrow('Renavam ou placa já cadastrados.');
    });

    it('deve atualizar um veículo com sucesso', async () => {
        const renavam     = generateRenavam();
        const updatedData = { preco: 28000, modelo: 'Modelo W', cor: 'Preto' };

        const vehicleData = {
            renavam,
            placa: generatePlaca(),
            marca: 'Marca X',
            modelo: 'Modelo Y',
            ano: 2020,
            cor: 'Branco',
            preco: 25000,
        };

        await VehicleController.addVehicle(vehicleData);
        await VehicleController.updateVehicle(renavam, updatedData);

        const updatedVehicle = (await mongoClient.executeQuery('vehicles', { renavam }))[0];
        expect(updatedVehicle.preco).toBe(updatedData.preco);
        expect(updatedVehicle.modelo).toBe(updatedData.modelo);
    });

    it('não deve atualizar um veículo com renavam não cadastrado', async () => {
        const renavam    = generateRenavam();
        const updateData = { preco: 35000, modelo: 'Modelo Z' };

        await expect(VehicleController.updateVehicle(renavam, updateData)).rejects.toThrow('Veículo não encontrado');
    });

    it('deve retornar uma lista vazia quando não há veículos cadastrados', async () => {
        const result  = await VehicleController.getVehicles('disponível', 'asc');
        const result2 = await VehicleController.getVehicles('vendido', 'asc');

        expect(result).toEqual([]);
        expect(result2).toEqual([]);
    });

    it('deve retornar veículos nos status "disponível" e "vendido" ordenados por preço crescentes', async () => {
        const vehiclesInsert = [
            { renavam: '11111111111', placa: 'AAA1111', status: 'disponível', preco: 15000, marca: 'Marca A', modelo: 'Modelo X', cor: 'Branco', ano: 2015 },
            { renavam: '22222222222', placa: 'BBB2222', status: 'disponível', preco: 20000, marca: 'Marca B', modelo: 'Modelo Y', cor: 'Preto', ano: 2016 },
            { renavam: '33333333333', placa: 'CCC3333', status: 'vendido', preco: 18000, marca: 'Marca C', modelo: 'Modelo Z', cor: 'Vermelho', ano: 2020 },
            { renavam: '44444444444', placa: 'DDD4444', status: 'vendido', preco: 25000, marca: 'Marca D', modelo: 'Modelo W', cor: 'Azul', ano: 2024 }
        ];
    
        for(const vehicle of vehiclesInsert) {
            await VehicleController.addVehicle(vehicle);
        }
    
        const resultAvailable = await VehicleController.getVehicles('disponível', 'asc');
        const resultSold = await VehicleController.getVehicles('vendido', 'asc');
    
        const cleanResultAvailable = resultAvailable.map(({ _id, dataCadastro, ...rest }) => rest);
        const cleanResultSold = resultSold.map(({ _id, dataCadastro, ...rest }) => rest);

        expect(cleanResultAvailable).toEqual([
            { renavam: '11111111111', placa: 'AAA1111', status: 'disponível', preco: 15000, marca: 'Marca A', modelo: 'Modelo X', cor: 'Branco', ano: 2015 },
            { renavam: '22222222222', placa: 'BBB2222', status: 'disponível', preco: 20000, marca: 'Marca B', modelo: 'Modelo Y', cor: 'Preto', ano: 2016 }
        ]);
    
        expect(cleanResultSold).toEqual([
            { renavam: '33333333333', placa: 'CCC3333', status: 'vendido', preco: 18000, marca: 'Marca C', modelo: 'Modelo Z', cor: 'Vermelho', ano: 2020 },
            { renavam: '44444444444', placa: 'DDD4444', status: 'vendido', preco: 25000, marca: 'Marca D', modelo: 'Modelo W', cor: 'Azul', ano: 2024 }
        ]);
    });

    it('deve retornar veículos nos status "disponível" e "vendido" ordenados por preço decrescente', async () => {
        const vehiclesInsert = [
            { renavam: '11111111111', placa: 'AAA1111', status: 'disponível', preco: 15000, marca: 'Marca A', modelo: 'Modelo X', cor: 'Branco', ano: 2015 },
            { renavam: '22222222222', placa: 'BBB2222', status: 'disponível', preco: 20000, marca: 'Marca B', modelo: 'Modelo Y', cor: 'Preto', ano: 2016 },
            { renavam: '33333333333', placa: 'CCC3333', status: 'vendido', preco: 18000, marca: 'Marca C', modelo: 'Modelo Z', cor: 'Vermelho', ano: 2020 },
            { renavam: '44444444444', placa: 'DDD4444', status: 'vendido', preco: 25000, marca: 'Marca D', modelo: 'Modelo W', cor: 'Azul', ano: 2024 }
        ];
    
        for(const vehicle of vehiclesInsert) {
            await VehicleController.addVehicle(vehicle);
        }
    
        const resultAvailable = await VehicleController.getVehicles('disponível', 'desc');
        const resultSold = await VehicleController.getVehicles('vendido', 'desc');
    
        const cleanResultAvailable = resultAvailable.map(({ _id, dataCadastro, ...rest }) => rest);
        const cleanResultSold = resultSold.map(({ _id, dataCadastro, ...rest }) => rest);

        expect(cleanResultAvailable).toEqual([
            { renavam: '22222222222', placa: 'BBB2222', status: 'disponível', preco: 20000, marca: 'Marca B', modelo: 'Modelo Y', cor: 'Preto', ano: 2016 },
            { renavam: '11111111111', placa: 'AAA1111', status: 'disponível', preco: 15000, marca: 'Marca A', modelo: 'Modelo X', cor: 'Branco', ano: 2015 }
        ]);
    
        expect(cleanResultSold).toEqual([
            { renavam: '44444444444', placa: 'DDD4444', status: 'vendido', preco: 25000, marca: 'Marca D', modelo: 'Modelo W', cor: 'Azul', ano: 2024 },
            { renavam: '33333333333', placa: 'CCC3333', status: 'vendido', preco: 18000, marca: 'Marca C', modelo: 'Modelo Z', cor: 'Vermelho', ano: 2020 }
        ]);
    });
    
    describe('Testes de Performance', () => {
        it('deve suportar 500 inserções sem degradação de performance', async () => {
            const startTime = Date.now();

            for (let i = 0; i < 500; i++) {
                const vehicleData = {
                    renavam: generateRenavam(),
                    placa: generatePlaca(),
                    marca: 'Marca X',
                    modelo: 'Modelo Y',
                    ano: 2020,
                    cor: 'Branco',
                    preco: 25000 + i,
                };

                await VehicleController.addVehicle(vehicleData);
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(5000);
        });

        it('deve atualizar um veículo repetidamente sem perda de performance', async () => {
            const renavam = generateRenavam();
            const updatedData = { preco: 28000, modelo: 'Modelo W', cor: 'Preto' };

            const vehicleData = {
                renavam,
                placa: generatePlaca(),
                marca: 'Marca X',
                modelo: 'Modelo Y',
                ano: 2020,
                cor: 'Branco',
                preco: 25000,
            };

            await VehicleController.addVehicle(vehicleData);

            const startTime = Date.now();

            for (let i = 0; i < 500; i++) {
                await VehicleController.updateVehicle(renavam, updatedData);
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(5000);
        });
    });
});
