const request = require('supertest');
const app = require('../server'); // Ajuste o caminho conforme sua estrutura
const consultarCNPJ = require('consultar-cnpj');

// Mock da biblioteca consultar-cnpj
jest.mock('consultar-cnpj');

describe('Testes da API de CNPJ', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  test('GET / - Deve retornar a página inicial', async () => {
    const response = await request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/);

    expect(response.text).toContain('Consulta de CNPJ');
    expect(response.text).toContain('<form action="/consultar" method="POST"');
  });

  describe('POST /consultar', () => {
    test('Deve retornar os dados de um CNPJ válido', async () => {
      const mockEmpresa = {
        cnpj: '00.000.000/0001-91',
        razaoSocial: 'Empresa Teste LTDA',
        nomeFantasia: 'Empresa Teste',
        status: 'ATIVA',
        cnae: '6202-3/00',
        endereco: {
          logradouro: 'Rua Teste',
          numero: '123',
          complemento: 'Sala 1',
          bairro: 'Centro',
          municipio: 'São Paulo',
          uf: 'SP',
          cep: '01001-000'
        },
        telefone: '(11) 1234-5678',
        email: 'contato@empresateste.com.br'
      };

      consultarCNPJ.mockResolvedValue(mockEmpresa);

      const response = await request(app)
        .post('/consultar')
        .send({ cnpj: '00.000.000/0001-91' })
        .expect(200);

      expect(response.text).toContain('Empresa Teste LTDA');
      expect(response.text).toContain('ATIVA');
      expect(response.text).toContain('Rua Teste');
      expect(consultarCNPJ).toHaveBeenCalledWith('00000000000191');
    });

    test('Deve retornar erro para CNPJ não encontrado', async () => {
      const error = new Error('CNPJ não encontrado');
      error.response = { status: 404 };
      consultarCNPJ.mockRejectedValue(error);

      const response = await request(app)
        .post('/consultar')
        .send({ cnpj: '00.000.000/0000-00' })
        .expect(200);

      expect(response.text).toContain('CNPJ não encontrado');
    });

    test('Deve retornar erro para CNPJ inválido', async () => {
      const error = new Error('CNPJ inválido');
      consultarCNPJ.mockRejectedValue(error);

      const response = await request(app)
        .post('/consultar')
        .send({ cnpj: '11.111.111/1111-11' }) // CNPJ inválido
        .expect(200);

      expect(response.text).toContain('Erro ao consultar CNPJ');
    });

    test('Deve retornar erro para requisição sem CNPJ', async () => {
      const response = await request(app)
        .post('/consultar')
        .send({})
        .expect(200);

      expect(response.text).toContain('Erro ao consultar CNPJ');
    });
  });
});