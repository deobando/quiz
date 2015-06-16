var path = require('path');

//postgres DATABASE_URL=postgres://user:passwd@host:port/database
//SQLite DATABASE_URL=sqlite://:@:/
var url=process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	=	(url[6]||null);
var user	=	(url[2]||null);
var pwd		=	(url[3]||null);
var protocol=	(url[1]||null);
var dialect	=	(url[1]||null);
var port	=	(url[5]||null);
var host	=	(url[4]||null);
var storage	=	process.env.DATABASE_STORAGE;

//cargar modelo ORM
var Sequelize=require('sequelize');

//usar BBDD SQLite
//var sequelize = new Sequelize(null,null,null,
//	{dialect: "sqlite",storage: "quiz.sqlite"}
//	);
var sequelize = new Sequelize(DB_name,user,pwd,
	{dialect: protocol,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage, //solo SQLite (.env)
		omitNull: true //solo postgres
	}
);

//importar la definicion de la tabla Quiz en quiz.js
//var Quiz=sequelize.import(path.join(__dirname,'quiz'));
var quiz_path=path.join(__dirname,'quiz');
var Quiz=sequelize.import(quiz_path);

exports.Quiz=Quiz;	//exportar definicion de la tabla Quiz

//sequelize.sync() crea e inicializa tabla de preg en DB
//sequelize.sync().success(function(){
	//success(..) ejecuta el manejador una vez creada la tabla
sequelize.sync().then(function(){	
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count===0){ //la tabla se inicializa solo si esta vacia
			Quiz.create({pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			});
			Quiz.create({pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa'
			});
			Quiz.create({pregunta: 'Capital de Colombia',
				respuesta: 'Bogota'
			});
			Quiz.create({pregunta: 'Capital de Brasil',
				respuesta: 'Brasilia'
			});
			Quiz.create({pregunta: 'Capital de Argentina',
				respuesta: 'Buenos Aires'
			});
			Quiz.create({pregunta: 'Capital de Alemania',
				respuesta: 'Berlin'
			});
			Quiz.create({pregunta: 'Capital de Francia',
				respuesta: 'Paris'
			});
			Quiz.create({pregunta: 'Capital de Japon',
				respuesta: 'Tokio'
			});			
			Quiz.create({pregunta: 'Capital de Rusia',
				respuesta: 'Moscu'
			})
			.then(function(){console.log('Base de Datos Inicializada')});
		};
	});
});