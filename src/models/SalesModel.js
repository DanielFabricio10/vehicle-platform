class Sale {
    constructor({ cpfCnpj, nomeCliente, renavam, valorCompra }) {
      this.dataAtual   = new Date(); 
      this.cpfCnpj     = cpfCnpj; 
      this.nomeCliente = nomeCliente;
      this.renavam     = renavam; 
      this.valorCompra = valorCompra; 
      this.idPagamento = this.generatePaymentId(); 
      this.status      = 'pendente';
    }
  
    generatePaymentId() {
      return Math.random().toString(36).substring(2, 15);
    }
  
    static isValid(data) {
      const regex = /^\d{11}$|^\d{14}$/;

      if(!regex.test(data.cpfCnpj)) {
        return { valid: false, message: 'CPF ou CNPJ inválido.' };
      }

      return { valid: true };
    }
  }
  
  module.exports = Sale;
  