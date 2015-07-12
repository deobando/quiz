var models=require('../models/models.js');

//Lista de tematicas
var tema=["Otro","Geografia","Humanidades","Ocio","Ciencia","Tecnologia"]

//Autoload - factoriza el cod si ruta incluye :quizId
exports.load=function(req,res,next,quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz=quiz;
				next();
			}else{
				next(new Error('No existe quizId = '+quizId));
			}
		}).catch(function(error){
			next(error);
		});
};

//GET /quizes
exports.index=function(req,res){
	//res.render('quizes/question',{pregunta: 'Capital de Italia'});
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index',{quizes: quizes,
			errors: [],tema: tema});
	}).catch(function(error){
		next(error);
	});
};

//GET /quizes/:id
exports.show=function(req,res){
	//models.Quiz.find(req.params.quizId).then(function(quiz){
	//	res.render('quizes/show',{quiz: quiz});
	//})
	res.render('quizes/show',{quiz: req.quiz,
		errors: [],tema: tema});
};

//GET /quizes/answer
exports.answer=function(req,res){
	/*
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta===quiz.respuesta){
			res.render('quizes/answer', 
				{quiz: quiz, respuesta: 'Correcto'});
		}else{
			res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Incorrecto'});
		}
	})
	*/
	var resultado='Incorrecto';
	if (req.query.respuesta===req.quiz.respuesta) {
		resultado='Correcto';
	}
	res.render('quizes/answer',{quiz: req.quiz,
			respuesta: resultado,
			errors: [],tema: tema});
};

//GET /quizes/busqueda
exports.busqueda=function(req,res){
	var texto='%'+req.query.search+'%';
  	models.Quiz.findAll({where: ["pregunta like ?", texto]}).then(function(quizes){
  		res.render('quizes/index', {quizes:quizes,
  			errors: [],tema: tema});
  	}).catch(function(error){
  		next(error);
  	})
};

//GET /quizes/new
exports.new=function(req,res){
	var quiz=models.Quiz.build(//crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
	);
	res.render('quizes/new',{quiz: quiz,
		errors: [],tema: tema});
};

// POST /quizes/create

/*
$ npm uninstall sequelize
$ npm install -save sequelize@2.0.0
*/
exports.create=function(req,res){
	var quiz=models.Quiz.build( req.body.quiz );

	quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/new',{quiz: quiz,errors: err.errors,tema: tema});
			}else{
				//guarda en DB los campos pregunta y respuesta de quiz
				quiz
				.save({fields:["pregunta","respuesta","tema"]})
				.then(function(){res.redirect('/quizes')})
			}//res.redirect: redireccion http a lista de preguntas
		}
	);
};

/*
//solo con el: $ npm install -save sequelize

exports.create=function(req,res){
	var quiz=models.Quiz.build( req.body.quiz );

	var errors=quiz.validate();//ya q el obj errors no tiene then()
	if(errors){
		var i=0;
		var errores=new Array();//se convierte en [] con la propiedad message por compatibildad con layout
		for (var prop in errors) errores[i++]={message:errors[prop]};
			res.render('quizes/new',{quiz:quiz, errors:errores});
	}else{
		//guarda en DB los campos pregunta y respuesta de quiz
		quiz
		.save({fields:["pregunta","respuesta"]})
		.then(function(){res.redirect('/quizes')});
	}
};
*/

// GET /quizes/:id/edit
exports.edit=function(req,res){
	var quiz=req.quiz //autoload de instancia a quiz
	res.render('quizes/edit',{quiz:quiz,errors: [],tema: tema});
};

// PUT /quizes/:id
exports.update=function(req,res){
	req.quiz.pregunta=req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;
	req.quiz.tema=req.body.quiz.tema;

	req.quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/edit',{quiz: req.quiz, errors: err.errors,tema: tema});
			}else{
				req.quiz //save: guarda campos preg y rta en DB
				.save({fields: ["pregunta","respuesta","tema"]})
				.then(function(){res.redirect('/quizes');});
			}	//redireccion http a lista de pregsuntas (url relativo)
		}
	);
};

//DELETE /quizes/:id
exports.destroy=function(req,res){
	req.quiz.destroy().then( function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

