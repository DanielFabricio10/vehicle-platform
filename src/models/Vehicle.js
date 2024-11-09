class Vehicle {
    constructor({ marca, modelo, ano, cor, preco, renavam, placa }) {
      this.dataCadastro = new Date().toISOString(); 
      this.marca = marca;
      this.modelo = modelo;
      this.ano = ano;
      this.cor = cor;
      this.preco = preco;
      this.renavam = renavam;
      this.placa = placa;
      this.status = 'disponível';
    }
  
    static isValid(vehicleData) {
        if (!vehicleData.marca || typeof vehicleData.marca !== 'string') {
            return { valid: false, message: 'A marca é obrigatória e deve ser uma string.' };
        }
        if (!vehicleData.modelo || typeof vehicleData.modelo !== 'string') {
            return { valid: false, message: 'O modelo é obrigatório e deve ser uma string.' };
        }
        if (!vehicleData.ano || typeof vehicleData.ano !== 'number' || vehicleData.ano < 1886 || vehicleData.ano > new Date().getFullYear()) {
            return { valid: false, message: 'O ano deve ser um número válido.' };
        }
        if (!vehicleData.cor || typeof vehicleData.cor !== 'string') {
            return { valid: false, message: 'A cor é obrigatória e deve ser uma string.' };
        }
        if (!vehicleData.preco || typeof vehicleData.preco !== 'number' || vehicleData.preco <= 0) {
            return { valid: false, message: 'O preço deve ser um número maior que zero.' };
        }
        if (!vehicleData.renavam || typeof vehicleData.renavam !== 'string' || !/^\d{11}$/.test(vehicleData.renavam)) {
            return { valid: false, message: 'O RENAVAM é obrigatório, deve ser uma string e conter exatamente 11 dígitos numéricos.' };
        }
        if (!vehicleData.placa || typeof vehicleData.placa !== 'string' || !/^[A-Z]{3}\d{4}$/.test(vehicleData.placa)) {
            return { valid: false, message: 'A placa é obrigatória, deve ser uma string e seguir o formato AAA1234.' };
        }
    
        return { valid: true, message: 'Veículo válido.' };
    }
  }
  
module.exports = Vehicle;
  