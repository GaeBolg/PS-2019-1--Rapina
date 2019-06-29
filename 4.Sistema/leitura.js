var express = require('express'),
	bodyParser = require('body-parser'),
    multiparty = require('connect-multiparty');

var sinesp = require('sinesp-nodejs');

var app = express();

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

app.listen('11301', () => {
    console.log("Servidor online");
});

app.get('/', (req, res) => {
    res.send("Tudo certo");
});

app.post('/gg', (req, res) =>{
	console.log('===================================================');
	var dados = req.body;
	console.log(dados.best_plate_number);
	console.log(dados.data_type);

	if(dados.best_plate_number){
		sinesp.consultaPlaca(dados.best_plate_number).then(dados => {
			console.log(dados);
		  }).catch(err => {
			console.log(err);
		  })
	}

	//var placa = dados.best_plate_number;

//	res.json(dados);
});