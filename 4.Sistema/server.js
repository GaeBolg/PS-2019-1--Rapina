var express = require('express'),
	bodyParser = require('body-parser'),
    multiparty = require('connect-multiparty');
var expressValidator = require('express-validator');

var sinesp = require('sinesp-nodejs');

var mysql = require('mysql')

var dbConnection = require ('./config/dbConnection');

var connection = dbConnection();


var app = express();
app.set('view engine', 'ejs');
app.set('views', './app/views');
 
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html'); 
});

//app.use(express.static('./app/public'));
app.use(express.static('./app'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(multiparty());

app.use(function(req, res, next){

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post('/ola', (req, res)=>{
    var placa = req.body.placa
    
    sinesp.consultaPlaca(placa).then(dados => {
        
        console.log(dados);

        inserirBanco(dados);

        return res.end(JSON.stringify(dados));
        }).catch(err => {
        console.log(err);
    });

 
})

//////////////////////////////////////////////////////////////////////////////////


app.post('/olaria', function(req, res){
    var placa = req.body.placa;

   // req.assert('user', 'Nome não pode ser vazio').notEmpty();
    //req.assert('user', 'Seu nome tem que ter de 3 a 15 caracteres').len(3, 15);

    var erros = req.validationErrors(); 

    // console.log("Erros: "+ JSON.stringify(erros));
    if(erros){
        res.render("index2", {validacao : erros});
        return;
    }

        // var post  = {id_user: req.body.user, nome: req.body.nome, senha: req.body.senha};
        var query = connection.query({
            sql: 'SELECT * from veiculos'
        }, function (error, dados, fields) {

        if(error) throw error;
        //Método de acesso a múltiplos usuários
         for(var i=0; i<dados.length; i++){
         console.log(dados[i]);
         }            
        //console.log("Query: "+query.sql);
        //console.log(dados[0]);
        if(dados.length > 0) {
              if (dados)
                // console.log("Test:" + results);
                //io.emit('conexao', {user: login.user, mensagem: 'Entrou no chat', hora: hora()});
                 for(var i=0; i<dados.length; i++){
                //return res.end(JSON.stringify(dados[i]));
                return res.json(dados);
                }
            }else{
                console.log(err);
            }

        }); 
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function inserirBanco(dados){

    var sql2 = 'SELECT 0 FROM veiculos WHERE placa = ?';
    valor = [
    [dados.placa]
    ]
    connection.query(sql2,[valor],(err, verificado) => {
    if(err){
        console.log('Verificacao FALHOU!');
        throw err;
}
        console.log("TESTE VERIFICADO:",verificado);
        if (verificado.length >= 1){
            /*Comeco do if*/
        //console.log(verificado);
        //  let query = "Select * from 'database' WHERE id=?;

        marca = dados.marca;
        anoVeiculo = dados.ano;
        modelo = dados.modelo;
        placa = dados.placa;
        uf = dados.uf;
        situacao = dados.situacao;
        municipio = dados.municipio;
        cor = dados.cor;

        var d = new Date();
        var dia = d.getDate();
        var mesSemZero = d.getMonth() + 1;
        if(mesSemZero < 10){
        var mes = "0"+mesSemZero;
        }else
        var mes = mesSemZero;
        var ano = d.getFullYear();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var data = ano+"/"+mes+"/"+dia+" "+h+":"+m+":"+s;

        var sql = "UPDATE veiculos SET marca='"+marca+"', ano='"+anoVeiculo+"', modelo='"+modelo+"', placa='"+placa+"', uf='"+uf+"', situacao='"+situacao+"', municipio='"+municipio+"', cor='"+cor+"', last_updated='"+data+"' WHERE placa='"+placa+"'  ";

        connection.query(sql, [values], (err, result) => {

            if(err){
                console.error('Algo deu errado');
                throw err;
            }


            console.log('Dados atualizados!');


        });
///////////////////////////////////////////////////////////////////////

    }/*Fim do if*/

        else if(verificado.length < 1){
        //else

        var sql = 'INSERT INTO veiculos (marca, ano, modelo, placa, uf, situacao, municipio, cor, last_updated) VALUES ?';
        marca = dados.marca;
        anoVeiculo = dados.ano;
        modelo = dados.modelo;
        placa = dados.placa;
        uf = dados.uf;
        situacao = dados.situacao;
        municipio = dados.municipio;
        cor = dados.cor;

        var d = new Date();
        var dia = d.getDate();
        var mesSemZero = d.getMonth() + 1;
        if(mesSemZero < 10){
        var mes = "0"+mesSemZero;
        }else
        var mes = mesSemZero;
        var ano = d.getFullYear();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var data = ano+"/"+mes+"/"+dia+" "+h+":"+m+":"+s;
    //  data = CURDATE();

        var values = [
        [marca,
         anoVeiculo,
         modelo,
         placa,
         uf,
         situacao,
         municipio,
         cor,
         data]
        ];


        connection.query(sql, [values], (err, result) => {

            if(err){
                console.error('Algo deu errado');
                throw err;
            }

            console.log('Dados inseridos!');


        });

////////////////////////////////////////////////////////////////////////

        }/*Fim do else if*/
        //console.log('não existe!');

    });

}








//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/principal', function(req, res){
    var login = req.body;

    req.assert('user', 'Nome não pode ser vazio').notEmpty();
    req.assert('user', 'Seu nome tem que ter de 3 a 15 caracteres').len(3, 15);

    var erros = req.validationErrors(); 

    // console.log("Erros: "+ JSON.stringify(erros));
    if(erros){
        res.render("index2", {validacao : erros});
        return;
    }

        // var post  = {id_user: req.body.user, nome: req.body.nome, senha: req.body.senha};
        var query = connection.query({
            sql: 'SELECT * from usuarios WHERE id_user = ? and senha = ?', 
            values: [req.body.user, req.body.senha]

        }, function (error, results, fields) {

        if(error) throw error;
        //Método de acesso a múltiplos usuários
        // for(var i=0; i<results.length; i++){
        // console.log(results[i].id_user);
        // }            
        console.log("Query: "+query.sql);
        if(results.length > 0) {
              if (results)
                // console.log("Test:" + results);
                //io.emit('conexao', {user: login.user, mensagem: 'Entrou no chat', hora: hora()});
                res.render('principal', {user: login.user});
            }else{
                res.render('index2', {validacao:[{msg:'Usuario ou senha incorreto'}]});
            }

        }); 
});



/////////////////////////////////////////////////////////////



app.get("/config", function(req, res){
    res.render('config');
});

app.get("/cadastro", function(req, res){
    res.render("cadastro.ejs", {regCadastro: {}});
});

app.get("/consulta", function(req, res){
    res.render("consulta.ejs");
});

app.get("/lista", function(req, res){
    res.render("lista.ejs");
});

app.post('/registro', function(req, res){
        

        req.assert('user', 'Nome não pode ser vazio').notEmpty();
        req.assert('senha', 'Senha não pode ser vazio').notEmpty();
        req.assert('user', 'Seu usuario tem que ter de 3 a 15 caracteres').len(3, 15);

        var erros = req.validationErrors(); 

        // console.log("Erros: "+ JSON.stringify(erros));
        if(erros){
            res.render("cadastro", {validacao : erros});
            return;
        }

        connection.query('select id_user from usuarios where id_user=?', [req.body.user], function(error, results,fields){
            if(results[0]){
                res.render("cadastro",  {regCadastro : [{msg: 'Usuario ja utilizado'}]});
            }else{              
                var post  = {nome:req.body.nome, cpf:req.body.cpf, id_user: req.body.user, senha: req.body.senha};
                var query = connection.query('INSERT INTO usuarios SET ?', post, function (error, results, fields) {
              if (error) throw error;
            });
                console.log(query.sql); // INSERT INTO usuarios SET `id_user` = ?, `exemplo` = 'Hello MySQL'
                res.render("cadastro",  {regCadastro : [{msg: 'Usuario cadastrado com sucesso'}]});
            }
        });

    // connection.query('insert into usuarios set 'id_user' = 1, 'nome'= matheus, 'senha'=1234', function(req, res){
    //      
    // res.render('cadastro');
    // });

    
});

///////////////////////////////////////////


var server = app.listen(80, function(){
  console.log(`Servidor rodando na porta 80`);
  console.log('Para derrubar o servidor: ctrl + c');
});

///////////////////////////////////////////

var io = require('socket.io').listen(server);

app.set('io', io);
io.on('connection', function(socket){
    console.log("Cliente conectado");

    socket.on("excluirConta", function(data){
        //data.user = conta a ser excluida
            connection.query('delete from usuarios where id_user=?',[data.user], function(error, results, fields){
                if (error) throw error;
                    console.log('Conta deletada com sucesso!');
            });

        socket.emit("contaExcluida",{
            msg: "Sua conta foi excluida"
        });
    });

    socket.on("configPassword", function(data){
        console.log("Passo1:\nSenha:"+ data.senha+"\nConfirma:"+data.novaSenha);
        if(data.senha != data.novaSenha){
            socket.emit("respostaConfig",{
                status: false,
                msg: 'Senhas diferentes'
            });
        }else{
            console.log("Passo2:\nSenha:"+ data.senha+"\nConfirma:"+data.novaSenha);
            //data.user = conta a ser alterada a senha
            //data.senha = nova senha
            connection.query('UPDATE usuarios SET senha = ? WHERE id_user = ?', [data.senha, data.user], function (error, results, fields) {
                if (error) throw error;
                socket.emit("respostaConfig", {
                    status: true,
                    msg: 'Senha alterada com sucesso'
                });
            });
        }
        console.log("Passo3:\nSenha:"+ data.senha+"\nConfirma:"+data.novaSenha);

    });
    
});



