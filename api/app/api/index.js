/* Código simplório, apenas para fornecer o serviço para a aplicação */
var api = {}


api.dados = function(req, res) {

    res.json([
        {id: 1, nome:'alberto', email:'alberto.souza@email.com.br',senha:'123456'},
        {id: 2,nome:'denis', email:'denis@email.com.br',senha:'123456'},
        {id: 3,nome:'daniel', email:'daniel@email.com.br',senha:'123456'},
        {id: 4,nome:'danilo', email:'danilo.souza@email.com.br',senha:'123456'}
    ]);
    
};


module.exports = api;