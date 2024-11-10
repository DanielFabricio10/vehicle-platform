# Plataforma de Venda de Veículos

Este projeto é uma plataforma para revenda de veículos automotores, implementada como parte do desafio de desenvolvimento de microsserviços.

## Requisitos

Antes de rodar o projeto, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
1. [Docker](https://www.docker.com/get-started) (para criar e orquestrar os containers)
2. [Docker Compose](https://docs.docker.com/compose/install/) (para facilitar a gestão de múltiplos containers)
3. [Node.js](https://nodejs.org/en/download/) (para rodar o código do serviço principal e do serviço de venda de veículos)
4. [npm](https://www.npmjs.com/get-npm) (gerenciador de pacotes do Node.js)

Após verificado/instaldo todas as tecnologias listadas acima, podemos seguir para o clone do projeto:
1. git clone https://github.com/DanielFabricio10/vehicle-platform.git

Agora no terminal de comando, acesse a pasta do projeto e execute:
1. **docker-compose up -d --build** para subir os containers e buildar a aplicação
2. **docker-compose run app npm test** para executar os testes e validar se todas as funcionalidades da aplicação estão operaveis

**Pronto o projeto está operavel para validação/atualizações!**
