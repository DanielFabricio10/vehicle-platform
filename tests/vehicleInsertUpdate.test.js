const VehicleController = require('../src/controllers/VehicleController');
const MongoDBClient = require('../src/db/MongoClient');

// Configura o tempo limite global
jest.setTimeout(10000); 

// Instancia o MongoDB Client
const mongoClient = new MongoDBClient();

beforeAll(async () => {
    // Conecta ao MongoDB antes de começar os testes
    await mongoClient.connect();
});

afterAll(async () => {
    // Fecha a conexão com o MongoDB após os testes
    await VehicleController.deleteAllVehicles({});
    await mongoClient.disconnect();
});

describe('Vehicle Controller', () => {

    

    //aqui

    it('deve cadastrar um veículo com sucesso', async () => {
        const vehicleData = {
            renavam: '12345679178',
            placa: 'ABC1259',
            marca: 'Marca X',
            modelo: 'Modelo Y',
            ano: 2020,
            cor: 'Branco',
            preco: 25000
        };

        // Chama o método deleteAllVehicles antes de adicionar o novo veículo
        await VehicleController.deleteAllVehicles({renavam: vehicleData.renavam});
        const result = await VehicleController.addVehicle(vehicleData);

        // Verifica se o ID foi inserido corretamente
        expect(result.insertedId).toBeDefined();

        // Verifica se o veículo foi realmente inserido no banco
        const insertedVehicle = (await mongoClient.executeQuery('vehicles', { renavam: vehicleData.renavam }))[0];
        console.log('Veículo inserido:', insertedVehicle);
        expect(insertedVehicle).toBeTruthy();
        expect(insertedVehicle.placa).toBe(vehicleData.placa);
        expect(insertedVehicle.marca).toBe(vehicleData.marca);
        expect(insertedVehicle.modelo).toBe(vehicleData.modelo);
        expect(insertedVehicle.ano).toBe(vehicleData.ano);
    });

    it('não deve permitir cadastrar um veículo com renavam ou placa duplicada', async () => {
        const vehicleData1 = {
            renavam: '12345679190',
            placa: 'XYZ1234',
            marca: 'Marca A',
            modelo: 'Modelo X',
            ano: 2021,
            cor: 'Preto',
            preco: 30000
        };

        const vehicleData2 = {
            renavam: '12345679190',  // Duplicado
            placa: 'XYZ1234',  // Duplicado
            marca: 'Marca B',
            modelo: 'Modelo Y',
            ano: 2022,
            cor: 'Azul',
            preco: 35000
        };

        // Chama o método deleteAllVehicles e insere o primeiro veículo
        await VehicleController.deleteAllVehicles({renavam: vehicleData1.renavam});
        await VehicleController.deleteAllVehicles({renavam: vehicleData2.renavam});
        await VehicleController.addVehicle(vehicleData1);

        // Tenta adicionar o veículo duplicado e espera que uma exceção seja lançada
        await expect(VehicleController.addVehicle(vehicleData2)).rejects.toThrow('Renavam ou placa já cadastrados.');
    });

    it('deve atualizar um veículo com sucesso', async () => {
        const renavam = '12345679190';
        const updatedData = { preco: 28000, modelo: 'Modelo W', cor: 'Preto' };

        // Verifica se o veículo existe antes de tentar atualizar
        const vehicleExists = await mongoClient.executeQuery('vehicles', { renavam: renavam });
        expect(vehicleExists.length).toBeGreaterThan(0); // Garante que o veículo está presente

        // Atualiza o veículo
        await VehicleController.updateVehicle(renavam, updatedData);

        // Verifica se o veículo foi atualizado no banco
        const updatedVehicle = (await mongoClient.executeQuery('vehicles', { renavam: renavam }))[0];
        expect(updatedVehicle).toBeTruthy();
        expect(updatedVehicle.preco).toBe(updatedData.preco);
        expect(updatedVehicle.modelo).toBe(updatedData.modelo);
        expect(updatedVehicle.cor).toBe(updatedData.cor);
    });

    it('não deve atualizar um veículo com renavam não cadastrado', async () => {
        const renavam = '12345675195';
        const updateData = { preco: 35000, modelo: 'Modelo Z' };

        // Tenta atualizar o veículo com renavam não cadastrado
        await expect(VehicleController.updateVehicle(renavam, updateData)).rejects.toThrow('Veículo não encontrado');
    });

    describe('Testes de Performance', () => {
        it('deve suportar 500 inserções sem degradação de performance', async () => {
            const startTime = Date.now();
            
           

            for (let i = 0; i < 500; i++) {
                const renavam = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('');

                const generateRandomLetters = () => {
                    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    let randomLetters = '';
                    for (let j = 0; j < 3; j++) {
                        randomLetters += letters[Math.floor(Math.random() * letters.length)];
                    }
                    return randomLetters;
                };
    
                const generateRandomNumbers = () => {
                    return Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 números
                };
    
                const placa = generateRandomLetters() + generateRandomNumbers();
                
                const vehicleData = {
                    renavam: renavam,  // Aqui garantimos que o renavam tenha 11 dígitos
                    placa: placa,
                    marca: 'Marca X',
                    modelo: 'Modelo Y',
                    ano: 2020,
                    cor: 'Branco',
                    preco: 25000 + i
                };
                
                await VehicleController.addVehicle(vehicleData);
            }
    
            const endTime = Date.now();
            const duration = endTime - startTime;
    
            // Aqui você pode definir um tempo de execução esperado (exemplo: 5 segundos)
            expect(duration).toBeLessThan(5000); // Teste de performance
        });

        it('deve atualizar um veículo com renavam 1234567919 repetidamente sem perda de performance', async () => {
            const renavam = '12345679190';
            const updatedData = { preco: 28000, modelo: 'Modelo W', cor: 'Preto' };
            
            // Configura o número de iterações para o teste de performance
           
            
            const startTime = Date.now(); // Marca o tempo de início
    
            for (let i = 0; i < 500; i++) {
                await VehicleController.updateVehicle(renavam, updatedData);
            }
    
            const endTime = Date.now(); // Marca o tempo de fim
            const duration = endTime - startTime; // Calcula a duração total
    
            //console.log(`Tempo total para ${iterations} atualizações: ${duration}ms`);
            
            // Define o limite de tempo máximo esperado para o número de atualizações
            expect(duration).toBeLessThan(5000); // Ajuste o limite conforme o esperado para seu sistema
        });
    });
});
