const SaleController    = require('../src/controllers/SaleController');
const VehicleController = require('../src/controllers/VehicleController');

describe('Venda de veículos', () => {
    let vehicleData;
    let renavam;

    beforeEach(async () => {
        vehicleData = {
            marca: 'Marca A',
            modelo: 'Modelo X',
            ano: 2015,
            cor: 'Branco',
            preco: 15000,
            renavam: '12121212121',
            placa: 'ABA1212'
        };

        const vehicle = await VehicleController.addVehicle(vehicleData);
        expect(vehicle.insertedId).toBeDefined();
        renavam = vehicleData.renavam;
    });

    afterEach(async () => {
        await VehicleController.deleteAllVehicles({});
        await SaleController.deleteAllSales({});
    });

    afterAll(async () => {
        await VehicleController.deleteAllVehicles({});
        await SaleController.deleteAllSales({});
    });

    it('deve registrar uma venda e aprovar corretamente', async () => {
        const saleData = {
            cpfCnpj: '55566677788',
            nomeCliente: "João",
            renavam
        };

        const sale = await SaleController.addSale(saleData);
        expect(sale.idPagamento).toBeDefined();

        const vehicle = await VehicleController.getVehicleRenavam(renavam);
        expect(vehicle.status).toBe('vendido');

        const salePaid = await SaleController.updateSaleStatus(sale.idPagamento, 'concluída');
        expect(salePaid.message).toBe('Status da venda atualizado para concluída.');
    });

    it('deve registrar uma venda e cancelar corretamente', async () => {
        const saleData = {
            cpfCnpj: '55566677788',
            nomeCliente: "João",
            renavam
        };

        const sale = await SaleController.addSale(saleData);
        expect(sale.idPagamento).toBeDefined();

        const vehicle = await VehicleController.getVehicleRenavam(renavam);
        expect(vehicle.status).toBe('vendido');

        const salePaid = await SaleController.updateSaleStatus(sale.idPagamento, 'cancelada');
        expect(salePaid.message).toBe('Status da venda atualizado para cancelada.');
    });

    it('não deve permitir cancelar e aprovar uma venda já aprovada', async () => {
        const saleData = {
            cpfCnpj: '55566677788',
            nomeCliente: "João",
            renavam
        };  
    
        const sale = await SaleController.addSale(saleData);
        expect(sale.idPagamento).toBeDefined();
    
        const saleApproved = await SaleController.updateSaleStatus(sale.idPagamento, 'concluída');
        expect(saleApproved.message).toBe('Status da venda atualizado para concluída.');
    
        await expect(SaleController.updateSaleStatus(sale.idPagamento, 'cancelada')).rejects.toThrow(
            'Venda já está concluída ou cancelada.' 
        );

        await expect(SaleController.updateSaleStatus(sale.idPagamento, 'concluída')).rejects.toThrow(
            'Venda já está concluída ou cancelada.'
        );
    });

    it('não deve permitir cancelar e aprovar uma venda já cancelada', async () => {
        const saleData = {
            cpfCnpj: '55566677788',
            nomeCliente: "João",
            renavam
        }; 
    
        const sale = await SaleController.addSale(saleData);
        expect(sale.idPagamento).toBeDefined();
    
        const saleApproved = await SaleController.updateSaleStatus(sale.idPagamento, 'cancelada');
        expect(saleApproved.message).toBe('Status da venda atualizado para cancelada.');
    
        await expect(SaleController.updateSaleStatus(sale.idPagamento, 'concluída')).rejects.toThrow(
            'Venda já está concluída ou cancelada.'
        );

        await expect(SaleController.updateSaleStatus(sale.idPagamento, 'cancelada')).rejects.toThrow(
            'Venda já está concluída ou cancelada.'
        );
    });

    it('não deve permitir realizar a compra de um carro não cadastrado', async () => {
        const saleData = {
            cpfCnpj: '55566677788',
            nomeCliente: 'João',
            renavam: '23232323232'
        };
    
        await expect(SaleController.addSale(saleData)).rejects.toThrow(
            'Veículo não encontrado ou não disponível.'
        );
    });
    
    it('não deve permitir realizar a compra de um carro com status de vendido', async () => {
        const saleData = {
            cpfCnpj: '55566677788',
            nomeCliente: 'João',
            renavam
        };
    
        const sale = await SaleController.addSale(saleData);
        expect(sale.idPagamento).toBeDefined();

        await expect(SaleController.addSale(saleData)).rejects.toThrow(
            'Veículo não encontrado ou não disponível.'
        );
    });

    describe('Testes de performance', () => {

        const generateRenavam = () => Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('');
        const generatePlaca   = () => {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
            const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return randomLetters + randomNumbers;
        };

        it('deve registrar e aprovar 500 vendas em um teste de performance', async () => {
            const salesData = [];
        
            for(let i = 0; i < 500; i++) {
                const vehicleData = {
                    marca: 'Marca A',
                    modelo: `Modelo ${i}`,
                    ano: 2020,
                    cor: 'Preto',
                    preco: 20000 + i,
                    renavam: generateRenavam(),
                    placa: generatePlaca()
                };
        
                const vehicle = await VehicleController.addVehicle(vehicleData);
                expect(vehicle.insertedId).toBeDefined();
        
                const saleData = {
                    cpfCnpj: '55566677788',
                    nomeCliente: `Cliente ${i}`,
                    renavam: vehicleData.renavam
                };
        
                const sale = await SaleController.addSale(saleData);
                expect(sale.idPagamento).toBeDefined();
        
                salesData.push(sale.idPagamento);
            }

            for(const saleId of salesData) {
                const saleApproved = await SaleController.updateSaleStatus(saleId, 'concluída');
                expect(saleApproved.message).toBe('Status da venda atualizado para concluída.');
            }
        
            console.log(`Teste de performance concluído: 500 vendas registradas e aprovadas com sucesso.`);
        });

        it('deve registrar e cancelar 500 vendas em um teste de performance', async () => {
            const salesData = [];
        
            for(let i = 0; i < 500; i++) {
                const vehicleData = {
                    marca: 'Marca A',
                    modelo: `Modelo ${i}`,
                    ano: 2020,
                    cor: 'Preto',
                    preco: 20000 + i,
                    renavam: generateRenavam(),
                    placa: generatePlaca()
                };
        
                const vehicle = await VehicleController.addVehicle(vehicleData);
                expect(vehicle.insertedId).toBeDefined();
        
                const saleData = {
                    cpfCnpj: '55566677788',
                    nomeCliente: `Cliente ${i}`,
                    renavam: vehicleData.renavam
                };
        
                const sale = await SaleController.addSale(saleData);
                expect(sale.idPagamento).toBeDefined();
        
                salesData.push(sale.idPagamento);
            }

            for(const saleId of salesData) {
                const saleApproved = await SaleController.updateSaleStatus(saleId, 'cancelada');
                expect(saleApproved.message).toBe('Status da venda atualizado para cancelada.');
            }
        
            console.log(`Teste de performance concluído: 500 vendas registradas e canceladas com sucesso.`);
        });
    });
});