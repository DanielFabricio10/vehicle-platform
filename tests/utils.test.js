// __tests__/utils.test.js
const { soma } = require('../src/utils'); // Ajuste o caminho conforme necessário

describe('Função de Soma', () => {
    test('deve retornar a soma de dois números', () => {
        expect(soma(1, 2)).toBe(3); // Verifica se 1 + 2 é igual a 3
        expect(soma(-1, 1)).toBe(0); // Verifica se -1 + 1 é igual a 0
        expect(soma(0, 0)).toBe(0); // Verifica se 0 + 0 é igual a 0
    });
});
