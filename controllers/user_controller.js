var users={
	admin: {id: 1, username: "admin", password: "1234"},
	user1: {id: 2, username: "user1", password: "5678"},
	deop: {id: 3, username: "deop", password: "1085"},
};

//comprueba si el usuario esta registrado en users
//si autenticacion falla o hay errores se ejecuta callback(error)
exports.autenticar=function(login,password,callback){
	if(users[login]){
		if(password===users[login].password){
			callback(null,users[login]);
		}else{
			callback(new Error('Password Erroneo'));
		}
	}else{
		callback(new Error('No Existe el Usuario'));
	}
};
