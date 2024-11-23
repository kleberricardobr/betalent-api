O projeto foi desenvolvido utilizado o Framework **Adonis5** com o ORM **Lucid**.

# Configurações

Os objetos do banco de dados (MySQL) devem ser configurados via migration e para isso, antes de iniciar a API, realizar o seguinte procedimento:

 - Criar um database no MySQL (via Workbench por exemplo): **create database nome_banco**

 - Apontar as configurações do banco no arquivo **.env**

 - Acionar o migration para criação dos objetos: **node ace migration:run**

 - Para iniciar a API rodar: **npm run dev** ou **node ace serve --watch**

# Descrições Técnicas

 - Em **app/Controllers/Http** estão disponíveis todos os controllers da aplicação, os quais são referenciados pelo arquivo **/start/routes.ts**

 - Foram criados Services (**app/Services**) para **melhor organização** do código e isolamento de responsabilidades

 - Também fez-se uso de **Dtos (app/Dto)** para **conversão dos dados vindos do Request e Transferidos para o Service**. Nos Dtos utilizou-se rules para **validação dos dados recebidos**

 - Para a rota de Vendas foi criada um classe específica para exceções (**Exceptions/VendaException.ts**), a qual é utilizada durante validações (realizadas no app/Services/VendasService.ts) : verificação se cliente e produto existem

 - Para a rota de Produtos foi criada um classe específica para exceções (**Exceptions/ProdutoException.ts**), a qual é utilizada durante validações: verificação se produto existe e durante a deleção verificado se existem vendas vinculadas

 - Para a autencicação das rotas referentes a clientes, produtos e vendas, utilizou-se um **middleware ("auth")**

 - Utilizado **transactions** para o cadastro de clientes, uma vez que possuem relações com outras entidades (telefones e endereço)


# Endpoint disponíveis

 ## /betalent/usuarios    

  ### POST  /betalent/usuarios --- UsuariosController.store

  - Cria um usuario para que seja possível realizar o login e recuperar um token

  - Exemplo de JSON necessário no Body da requisição:
  '''
    {
	"email": "kleber@kleber",
	"password": "123kleber"
    }
  '''

## /betalent/login    

  ### POST  /betalent/login --- AuthController.login

  - Realiza o login recuperando um token válido por 60 minutos  

  - Exemplo de JSON necessário no Body da requisição:
  '''
    {
	  "email": "kleber@kleber",
	  "password": "123kleber"
    }
  '''

  - Exemplo de resposta bem sucedida:
  '''
    {
	  "type": "bearer",
	  "token": "MQ.iP-tMar4gkZ5ocbgBV6-FV8p1rMyDrC3a_2anD6jPQ7r0em0rMSPXUmunzcv",
	  "expires_at": "2024-11-23T12:34:01.404-03:00"
    }
  '''

**Para todas as rotas abaixo adicionar no Header --> "Authorization: Bearer token_recuperado_do_login"**

## /betalent/clientes    

  ### GET  /betalent/clientes --- clientes.index › ClientesController.index
  - Recupera informações principais dos clientes 

  - Exemplo de JSON de resposta:
  '''
  {
	"clientes": [
		{
			"id": 2,
			"nome": "Teste - 123",
			"cpf": "45456456",
			"endereco": {
				"id": 3,
				"logradouro": "rua das testes 123",
				"numero": "164",
				"cep": "12123",
				"cidade": "Mococa",
				"estado": "SP"
			},
			"telefones": [
				{
					"id": 3,
					"numero": "3333"
				}
			]
		}
	]
  }
  '''
  
  ### GET  /betalent/clientes/:id --- clientes.show › ClientesController.show
  - Recupera dados detalhados de um cliente (informar seu **id** no final da url)
  - Para filtrar mês e/ou ano, utilizar query params. Exemplo: /betalent/clientes/10/?mes=11&ano=2024

  - Exemplo de JSON de resposta:
  '''
  {
	"id": 2,
	"nome": "Teste - 123",
	"cpf": "45456456",
	"endereco": {
		"id": 3,
		"logradouro": "rua das testes 123",
		"numero": "164",
		"cep": "12123",
		"cidade": "Mococa",
		"estado": "SP"
	},
	"telefones": [
		{
			"id": 3,
			"numero": "3333"
		}
	],
	"vendas": [
		{
			"data_venda": "2024-11-23T12:11:26.000-03:00",
			"total": 19.3,
			"quantidade": 10,
			"produto_descricao": "produto teste",
			"produto_codigo": "999123"
		}
	]
  }
  ''' 

  ### POST  /betalent/clientes --- clientes.store › ClientesController.store  
  - Cadastra um novo cliente

  - Exemplo de JSON a ser enviado no Body da requisição:
  '''
  {
  	"nome": "Teste",
  	"cpf": "111.111.111.11",
  	"telefones":[
  		{"numero":  "1999999999"}
  	],
  	"endereco": {
  		"logradouro": "rua dos testes",
  		"numero": "164",
  		"cep": "12123",
  		"cidade": "Mococa",
  		"estado": "SP"
  		
  	}
  }
  '''

  ### PUT /betalent/clientes/:id --- clientes.update › ClientesController.update
  - Atualiza os dados de um cliente cadastrado 
  - O JSON para enviar no Body da requisição é igual ao do endpoint anterior (store)
  
  ### DELETE  /betalent/clientes/:id --- clientes.destroy › ClientesController.destroy
  - Remove um cliente cadastrado, suas vendas serão deletadas em cascata



## /betalent/produtos  

  ### GET  /betalent/produtos --- produtos.index › ProdutosController.index
  - Recupera dados principais dos produtos
  
  - Exemplo de JSON retornado:
  '''
  {
  	"produtos": [
  		{
              "id": 1,
  			"descricao": "666999",
  			"codigo_barras": "99966",
  			"preco": 1.93
  		}
  	]
  }
  '''
  
  ### GET  /betalent/produtos/:id --- produtos.show › ProdutosController.show
  - Recupera informações detalhadas de um produto
  
  - Exemplo de JSON retornado:
  '''
  {
  	"produto": {
  		"id": 1,
  		"criado_em": "2024-11-23T12:09:34.000-03:00",
  		"ultima_atualizacao": "2024-11-23T12:10:03.000-03:00",
  		"descricao": "descricao qualquer",
  		"codigo_barras": "999",
  		"preco": 1.93
  	}
  }
  '''
  
  ### POST  /betalent/produtos --- produtos.store › ProdutosController.store
  - Inclui um novo produto
  
  - Exemplo de JSON a ser enviado no Body da requisição:
  '''
  {
  	"codigoBarras": "12344",
  	"descricao": "descricao 123",
  	"preco": "1.93"	
  }
  '''
  
  ### PUT  /betalent/produtos/:id --- produtos.update › ProdutosController.update
  - Atualiza um produto existente
  
  - Exemplo de JSON a ser enviado no Body da requisição:
  '''
  {
  	"codigoBarras": "12344",
  	"descricao": "descricao 123",
  	"preco": "1.93"	
  }
  '''
  
  ### DELETE  /betalent/produtos/:id --- produtos.destroy › ProdutosController.destroy
  - Remove um produto existente
  - **Caso existam vendas vinculadas ao produto, será necessário antes, excluir todos os clientes vinculados**
  

## /betalent/vendas

  ### POST  /betalent/vendas --- VendasController.store
  - Registra um venda (a relação é de 1 para 1 tanto com o cliente, quanto com o produto)
  
  - Exemplo de JSON a ser enviado no corpo da requisição:
  '''
  {
  	"quantidade": "10",
  	"clienteId": "2",
  	"codigoBarras": "99966"
  }
  '''