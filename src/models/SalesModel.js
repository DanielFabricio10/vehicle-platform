class Sale {
    constructor({ cpfCnpj, nomeCliente, renavam, valorCompra }) {
      this.dataAtual = new Date(); // Data atual
      this.cpfCnpj = cpfCnpj; // CPF ou CNPJ do cliente
      this.nomeCliente = nomeCliente; // Nome do cliente
      this.renavam = renavam; // Renavam do carro comprado
      this.valorCompra = valorCompra; // Valor atual do carro no momento da compra
      this.idPagamento = this.generatePaymentId(); // ID de pagamento gerado
      this.status = 'pendente'; // Status padrão
    }
  
    generatePaymentId() {
      return Math.random().toString(36).substring(2, 15); // Gera um ID aleatório
    }
  
    static isValid(data) {
      // Validação do CPF/CNPJ (simples, você pode melhorar)
      const regex = /^\d{11}$|^\d{14}$/; // Apenas aceita CPF (11 dígitos) ou CNPJ (14 dígitos)
      if (!regex.test(data.cpfCnpj)) {
        return { valid: false, message: 'CPF ou CNPJ inválido.' };
      }
      return { valid: true };
    }
  }
  
  module.exports = Sale;
  