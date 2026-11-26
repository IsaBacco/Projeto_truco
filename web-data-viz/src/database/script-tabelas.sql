

/*
tabelas do projeto
*/
create database truco;

use truco;

create table usuario (

	idUsuario int primary key auto_increment,
    nome varchar(45),
    email varchar(45),
    senha varchar(45),  
    constraint chkEmail check (email like '%@%')

);

insert into usuario (nome, email, senha) values 
	('teste', 'testes@gmail.com' , '12345688');