drop database Cadillag;
create database Cadillag;

use Cadillag;

create table Instituicao(
inst_id int auto_increment primary key,
inst_nome varchar(100) not null,
inst_uf varchar(2) not null
);

create table Usuario(
usu_id int auto_increment primary key,
usu_nome varchar(100) not null,
inst_id int not null,
constraint fk_inst foreign key (inst_id) references Instituicao(inst_id)
);

create table Curso(
cur_id int primary key,
cur_nome varchar(45) not null,
cur_sigla varchar(5) not null
);

create table Aluno(
alu_id int primary key,
cur_id int not null,
constraint pk_curso1 foreign key (cur_id) references Curso(cur_id),
constraint pk_aluno1 foreign key (alu_id) references Usuario(usu_id)
);

create table Professor(
prof_id int primary key,
constraint pk_prof2 foreign key (prof_id) references Usuario(usu_id)
);

create table Disciplina(
disc_id int primary key,
disc_nome varchar(45) not null
);

create table Turma(
disc_id int not null,
tur_ano int not null,
tur_semestre int not null,
prof_id int not null,
primary key(disc_id, tur_ano, tur_semestre, prof_id),
constraint pk_disc3 foreign key (disc_id) references Disciplina(disc_id),
constraint pk_prof3 foreign key (prof_id) references Professor(prof_id)
); 

create table Atividade(
atv_id int auto_increment primary key,
disc_id int not null,
prof_id int not null,
tur_ano int not null,
tur_semestre int not null,
atv_data_limite date not null,
constraint pk_atividade foreign key (disc_id, tur_ano, tur_semestre, prof_id) references Turma(disc_id, tur_ano, tur_semestre, prof_id)
);

create table Arquivo(
arq_id int primary key,
arq_nome varchar(45) not null,
arq_extensao varchar(5) not null,
disc_id int not null,
arq_disponivel boolean not null,
prof_id int not null,
constraint pk_disc5 foreign key (disc_id) references Disciplina(disc_id),
constraint pk_prof5 foreign key (prof_id) references Professor(prof_id)  
);

create table Tipo_Permissao(
tper_nome varchar(45) not null,
tper_value int primary key
);

create table Estrutura(
ed_id int primary key,
ed_nome varchar(45) not null
);

create table Permissoes(
ed_id int not null,
tper_value int not null,
disc_id int not null,
prof_id int not null,
tur_ano int not null,
tur_semestre int not null,
constraint pk_ed6 foreign key (ed_id) references Estrutura(ed_id),
constraint pk_tper_value6 foreign key (tper_value) references Tipo_Permissao(tper_value),
constraint pk_disc6 foreign key (disc_id, tur_ano, tur_semestre, prof_id) references Turma(disc_id, tur_ano, tur_semestre, prof_id),
primary key(ed_id, tper_value, disc_id, prof_id, tur_ano, tur_semestre)
);

create table Assunto(
ast_id int primary key,
ast_nome varchar(100) not null
);

create table Topico(
top_id int auto_increment primary key,
top_assunto varchar(100) not null,
usu_id int not null,
ast_id int not null,
constraint pk_usu7 foreign key (usu_id) references Usuario(usu_id),
constraint pk_ast7 foreign key (ast_id) references Assunto(ast_id) 
);
      
create table Resposta(
resp_id int auto_increment primary key,
resp_texto longtext not null,
top_id int not null,
usu_id int not null,
constraint pk_top8 foreign key (top_id) references Topico(top_id),
constraint pk_usu8 foreign key (usu_id) references Usuario(usu_id)
); 

create table Atividade_has_Aluno(
atv_id int not null,
alu_id int not null,
atv_alu_extensao varchar(5) not null,
atv_alu_data_entrega date not null,
primary key(atv_id, alu_id),
constraint pk_atv9 foreign key (atv_id) references Atividade(atv_id),
constraint pk_aluno9 foreign key (alu_id) references Aluno(alu_id)
);

create table Aluno_has_Turma(
alu_id int not null,
disc_id int not null,
prof_id int not null,
tur_ano int not null,
tur_semestre int not null,
constraint pk_alu0 foreign key (alu_id) references Aluno(alu_id),
constraint pk_disc0 foreign key (disc_id, tur_ano, tur_semestre, prof_id) references Turma(disc_id, tur_ano, tur_semestre, prof_id),
primary key(alu_id, disc_id, prof_id, tur_ano, tur_semestre)
); 
