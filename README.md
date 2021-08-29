## Games Masters :video_game:

_Projeto de seleção para vaga de estágio da [App Masters](https://appmasters.io/en/)._<br>
Deploy: https://games-masters.herokuapp.com/

### API

| Endpoints                  | Parâmetros                                                                                            | Descrição                                                                                                                                                                                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[GET] /**                | **query:** limit e offset, ambos opcionais.                                                           | Retorna uma lista com o nome e appid dos jogos da steam. A quantidade de items na lista pode ser limitada com os parâmetros limit e offset, por padrão é retornado todos os jogos. Código 200 .                                                                             |
| **[GET] /:id**             | **parâmetros de rota:** id do jogo (appid).<br>**query:** fields, opcional.                           | Retorna os detalhes de um determinado jogo, os campos retornados podem ser filtrados usando o parâmetro field, exemplo: /440/?fields=name,detailed_description,required_age. Por padrão todos os campos são retornados. Código 200, ou 404 caso o jogo não seja encontrado. |
| **[POST] /favorite**       | **headers:** user-hash, identificador do usuário.<br>**body:** gameid, obrigatório; rating, opcional. | Inclui um jogo na lista de favoritos do usuário, caso não exista a lista, uma nova é criada com o user-hash informado. Código 200, 404 caso o jogo não for encontrado, 422 para avaliação inválida ou 403 caso o user-hash não seja informado.                              |
| **[GET] /favorite**        | **headers:** user-hash. <br>**query:** fields, opcional.                                              | Retorna a lista de favoritos do usuário, com os detalhes de cada jogo (pode também usar o parâmetro field na url para limitar os campos). Código 200 ou 403 caso o user-hash não seja informado.                                                                            |
| **[DELETE] /favorite/:id** | **headers:** user-hash. <br>**parâmetros de rota:** id do jogo (appid)                                | Exclui um jogo da lista de favoritos. Código 200, 204 caso a lista não seja encontrado ou 403 caso o user-hash não seja informado.                                                                                                                                          |

### Instalação

Instale as dependências com yarn ou npm.<br>
Configure MONGO_URI e REDIS_URI nas variáveis de ambiente. Opcionalmente PORT.
