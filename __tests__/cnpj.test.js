const request = require('supertest');
const app = require('../app');

describe('TEST COM CNPJ', () => {
    it('Teste da Consulta', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('<h1>Consulta de CNPJ</h1>');
    });

    it('Teste para retornar um erro caso esteja com menos de 14 digitos', async () => {
        const cnpj = '00.808.396/0003-6';
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404);
    });

    it('Teste que retornara um erro caso esteja com caracter', async () => {
        const cnpj = '00.808.396/0003-AB';
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404);
    });

    it('CNPJ mal formatado', async () => {
        const cnpj = '12.345.678/1234-5';
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404);
    });

    // Teste CNPJ com números repetidos
    it('CNPJ com números repetidos', async () => {
        const cnpj = '11.111.111/1111-11';
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404);
    });


    it('CNPJ com pontuação errada', async () => {
        const cnpj = '12.345.678.0001-95'; 
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404); 
    });


    it('CNPJ com mais de 14 dígitos', async () => {
        const cnpj = '12.345.678/0001-9500'; 
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404); // CNPJ inválido
    });


    it('CNPJ com dígito verificador negativo', async () => {
        const cnpj = '12.345.678/0001-9X'; 
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404); 
    });

    
    it('CNPJ válido de empresa fictícia', async () => {
        const cnpj = '00.000.000/0001-91';
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404); 
    });

    it('CNPJ com dígitos verificadores errados', async () => {
        const cnpj = '12.345.678/0001-99'; 
        const response = await request(app)
            .get('/consultar')
            .query({ cnpj });
        
        expect(response.statusCode).toBe(404); 
    });
});
