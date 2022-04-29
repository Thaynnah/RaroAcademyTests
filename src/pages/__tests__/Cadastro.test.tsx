import { Cadastro } from '../Cadastro';

import { render, screen } from '@testing-library/react'
import faker from '@faker-js/faker';
import { validaErroApresentadoEmTela } from '../../helpers/teste/validaErroApresentadoEmTela';
import { validaErroNaoApresentadoEmTela } from '../../helpers/teste/validaErroNaoApresentadoEmTela';
import { setValorInput } from '../../helpers/teste/setValorInput';
import axios from 'axios';

const makeSut = () => {
  return render(
    <Cadastro />
  );
}

describe('Cadastro Page', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(makeSut);

  it('deve bloquear o submit caso os campos não estejam válidos', () => {
    const button = screen.getByText('Cadastrar');
    expect(button).toBeDisabled();
  });

  it('deve validar o formato de e-mail no cadastro', () => {
    const input = screen.getByPlaceholderText("e-mail");
    const value = faker.internet.email();
    const mensagemDeValidacao = "Formato de e-mail inválido";
    validaErroApresentadoEmTela(input, mensagemDeValidacao);
    validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
  });

  describe('deve validar os critérios de aceitação da senha', () => {
    let input: HTMLElement;
    beforeEach(() => {
      input = screen.getByPlaceholderText('Senha');
    });

    it('senha deve ter 8 dígitos ou mais', () => {
      const value = faker.lorem.paragraph();
      const mensagemDeValidacao = 'Senha deve ter ao menos 8 caracteres';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it('senha deve ter letra maiuscula', () => {
      const value = 'Teste';
      const mensagemDeValidacao = 'Senha deve conter pelo menos uma letra maiúscula';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it('senha deve ter letra minúscula', () => {
      const value = 'Teste';
      const mensagemDeValidacao = 'Senha deve conter pelo menos uma letra minúscula';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it('senha deve ter números', () => {
      const value = 'Teste 1';
      const mensagemDeValidacao = 'Senha deve conter pelo menos um número';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it('senha deve ter caracteres especiais', () => {
      const value = 'Teste@1';
      const mensagemDeValidacao = 'Senha deve conter pelo menos um caractere especial';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });
  });

  it('deve garantir que senha e confirmação sejam iguais', () => {
    const inputSenha = screen.getByPlaceholderText("Senha");
    const value = "Testando123";
    setValorInput(inputSenha, value);
  });

  it('deve enviar o formulário se todos os dados estiverem preenchidos corretamente', () => {
    const nome = screen.getByPlaceholderText('Nome');
    const email = screen.getByPlaceholderText('e-mail');
    const senha = screen.getByPlaceholderText('Senha');
    const confirmacaoSenha = screen.getByPlaceholderText('Confirmação de Senha');
    const codigoAcesso = screen.getByPlaceholderText('Código de Acesso');
    const botao = screen.getByText('Cadastrar');
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: 'S3nh@!123',
      codigoAcesso: faker.lorem.paragraph(),
    };

    setValorInput(nome, dados.nome);
    setValorInput(email, dados.email);
    setValorInput(senha, dados.senha);
    setValorInput(confirmacaoSenha, dados.senha);
    setValorInput(codigoAcesso, dados.codigoAcesso);

    expect(botao).not.toBeDisabled();
  });

  it('deve notificar o usuário que o cadastro foi efetuado com sucesso', () => {
    jest.spyOn(axios, 'post').mockResolvedValue('ok');
    const nome = screen.getByPlaceholderText('Nome');
    const email = screen.getByPlaceholderText('e-mail');
    const senha = screen.getByPlaceholderText('Senha');
    const confirmacaoSenha = screen.getByPlaceholderText('Confirmação de Senha');
    const codigoAcesso = screen.getByPlaceholderText('Código de Acesso');
    const botao = screen.getByText('Cadastrar');
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: 'S3nh@!123',
      codigoAcesso: faker.lorem.paragraph(),
    };

    setValorInput(nome, dados.nome);
    setValorInput(email, dados.email);
    setValorInput(senha, dados.senha);
    setValorInput(confirmacaoSenha, dados.senha);
    setValorInput(codigoAcesso, dados.codigoAcesso);
    botao.click();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/cadastrar'),
      dados
    );
  });

  it('deve apresentar os erros de validação para o usuário, caso a API retorne erro', () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error('Erro de validação'));
    const nome = screen.getByPlaceholderText("Nome");
    const email = screen.getByPlaceholderText("e-mail");
    const senha = screen.getByPlaceholderText("Senha");
    const confirmacaoSenha = screen.getByPlaceholderText("Confirmação de Senha");
    const codigoAcesso = screen.getByPlaceholderText("Código de Acesso");
    const botao = screen.getByText("Cadastrar");
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: "S3nh@!123",
      codigoAcesso: faker.lorem.paragraph(),
    };

    setValorInput(nome, dados.nome);
    setValorInput(email, dados.email);
    setValorInput(senha, dados.senha);
    setValorInput(confirmacaoSenha, dados.senha);
    setValorInput(codigoAcesso, dados.codigoAcesso);
    botao.click();

    expect(axios.post).toHaveBeenCalledWith(
      new Error('Erro de validação'),
      dados
    );
  });
});
