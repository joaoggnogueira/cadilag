use Cadillag;

insert into Instituicao (inst_nome, inst_uf) values ('Universidade Estadual Paulista Júlio de Mesquita Filho', 'SP');
insert into Instituicao (inst_nome, inst_uf) values ('Universidade de São Paulo', 'SP');
insert into Instituicao (inst_nome, inst_uf) values ('Pontifícia Universidade Católica de Minas Gerais', 'MG');
insert into Instituicao (inst_nome, inst_uf) values ('Universidade Federal do Rio de Janeiro', 'RJ');
insert into Instituicao (inst_nome, inst_uf) values ('Universidade Estadual de Maringá', '');

insert into Usuario (usu_nome, inst_id) values ('Júlio', 5);
insert into Usuario (usu_nome, inst_id) values ('Rafaela', 1);
insert into Usuario (usu_nome, inst_id) values ('Tomás', 2);
insert into Usuario (usu_nome, inst_id) values ('Isabelle', 3);
insert into Usuario (usu_nome, inst_id) values ('Otávio', 4);
insert into Usuario (usu_nome, inst_id) values ('William', 5);
insert into Usuario (usu_nome, inst_id) values ('Juliana', 1);
insert into Usuario (usu_nome, inst_id) values ('Hideki', 2);
insert into Usuario (usu_nome, inst_id) values ('Elisabeth', 2);
insert into Usuario (usu_nome, inst_id) values ('Ronaldo', 5);

-- cur_id pode ser auto_increment

insert into Curso (cur_id, cur_nome, cur_sigla) values (1 , 'Matemática', 'MAT');
insert into Curso (cur_id, cur_nome, cur_sigla) values (2 , 'Ciência da Computação', 'BCC');
insert into Curso (cur_id, cur_nome, cur_sigla) values (3 , 'Engenharia da Computação', 'ECOM');
insert into Curso (cur_id, cur_nome, cur_sigla) values (4 , 'Matemática Aplicada e Computacional', 'MAC');
insert into Curso (cur_id, cur_nome, cur_sigla) values (5 , 'Engenharia Eletrônica', 'ELE');

insert into Aluno (alu_id, cur_id) values (1, 1);
insert into Aluno (alu_id, cur_id) values (2, 2);
insert into Aluno (alu_id, cur_id) values (3, 3);
insert into Aluno (alu_id, cur_id) values (4, 4);
insert into Aluno (alu_id, cur_id) values (5, 5);


insert into Professor (prof_id) values (6);
insert into Professor (prof_id) values (7);
insert into Professor (prof_id) values (8);
insert into Professor (prof_id) values (9);
insert into Professor (prof_id) values (10);

-- disc_id pode ser auto_increment

insert into Disciplina (disc_id, disc_nome) values (1, 'Complexidade de Algoritmos');
insert into Disciplina (disc_id, disc_nome) values (2, 'Algoritmos e Técnicas de Programação');
insert into Disciplina (disc_id, disc_nome) values (3, 'Introdução à Programação com Java');
insert into Disciplina (disc_id, disc_nome) values (4, 'Banco de Dados I');
insert into Disciplina (disc_id, disc_nome) values (5, 'Estruturas de Dados');


insert into Turma (disc_id, tur_ano, tur_semestre, prof_id) values (1, 2013, 1, 6);
insert into Turma (disc_id, tur_ano, tur_semestre, prof_id) values (2, 2014, 2, 7);
insert into Turma (disc_id, tur_ano, tur_semestre, prof_id) values (3, 2015, 1, 8);
insert into Turma (disc_id, tur_ano, tur_semestre, prof_id) values (4, 2015, 2, 9);
insert into Turma (disc_id, tur_ano, tur_semestre, prof_id) values (5, 2014, 1, 10);



insert into Arquivo (arq_id, arq_nome, arq_extensao, disc_id, arq_disponivel, prof_id)
    values (1, 'arvore_rubro_negra', '.c', 1, 1, 7);
insert into Arquivo (arq_id, arq_nome, arq_extensao, disc_id, arq_disponivel, prof_id)
    values (2, 'especificacao_atividade1', '.pdf', 2, 1, 6);
insert into Arquivo (arq_id, arq_nome, arq_extensao, disc_id, arq_disponivel, prof_id)
    values (3, 'arvore_trie', '.c', 4, 1, 8);
insert into Arquivo (arq_id, arq_nome, arq_extensao, disc_id, arq_disponivel, prof_id)
    values (4, 'arvore_patricia', '.c', 3, 1, 9);
insert into Arquivo (arq_id, arq_nome, arq_extensao, disc_id, arq_disponivel, prof_id)
    values (5, 'arvore_b', '.c', 5, 1, 10);

insert into Tipo_Permissao (tper_nome, tper_value) values ('Especial',1);
insert into Tipo_Permissao (tper_nome, tper_value) values ('Completa',2);
insert into Tipo_Permissao (tper_nome, tper_value) values ('Parcial',3);
insert into Tipo_Permissao (tper_nome, tper_value) values ('Simples',4);
insert into Tipo_Permissao (tper_nome, tper_value) values ('Única',5);    

-- ed_id pode ser auto_increment
insert into Estrutura (ed_id, ed_nome) values (1, 'Árvore AVL');
insert into Estrutura (ed_id, ed_nome) values (2, 'Tabelas Hash');
insert into Estrutura (ed_id, ed_nome) values (3, 'Listas Cruzadas');
insert into Estrutura (ed_id, ed_nome) values (4, 'Pilhas Mútiplas');
insert into Estrutura (ed_id, ed_nome) values (5, 'Árvore B');
insert into Estrutura (ed_id, ed_nome) values (6, 'Árvore Rubro-Negra');
insert into Estrutura (ed_id, ed_nome) values (7, 'Lista Duplamente Encadeada');

insert into Permissoes (ed_id, tper_value, disc_id, prof_id, tur_ano, tur_semestre)
    values (1,1,1,6,2013,1);
insert into Permissoes (ed_id, tper_value, disc_id, prof_id, tur_ano, tur_semestre)
    values (2,2,2,7,2014, 2);
insert into Permissoes (ed_id, tper_value, disc_id, prof_id, tur_ano, tur_semestre)
    values (1,1,3,8,2015,1);
insert into Permissoes (ed_id, tper_value, disc_id, prof_id, tur_ano, tur_semestre)
    values (1,1,4,9,2015,2);
insert into Permissoes (ed_id, tper_value, disc_id, prof_id, tur_ano, tur_semestre)
    values (1,1,5,10,2014,1);        


insert into Assunto (ast_id, ast_nome) values (1, 'Árvore Binária');
insert into Assunto (ast_id, ast_nome) values (2, 'Lista Encadeada');
insert into Assunto (ast_id, ast_nome) values (3, 'Pilha');
insert into Assunto (ast_id, ast_nome) values (4, 'Árvore B+');
insert into Assunto (ast_id, ast_nome) values (5, 'Árvore B*');


insert into Topico (top_id, top_assunto, usu_id, ast_id)
    values (1, 'Inserção', 6, 1);
insert into Topico (top_id, top_assunto, usu_id, ast_id)
    values (2, 'Remoção', 3, 1);
insert into Topico (top_id, top_assunto, usu_id, ast_id)
    values (3, 'Inserção', 2, 4);
insert into Topico (top_id, top_assunto, usu_id, ast_id)
    values (4, 'Busca', 6, 3);
insert into Topico (top_id, top_assunto, usu_id, ast_id)
    values (5, 'Busca', 2, 5);


-- resp id pode ser auto_increment
insert into Resposta (resp_id, resp_texto, top_id, usu_id)
    values(1,'Está Incorreto',1,1); 
insert into Resposta (resp_id, resp_texto, top_id, usu_id)
    values(2,'Está correto',2,2);
insert into Resposta (resp_id, resp_texto, top_id, usu_id)
    values(3,'O que é isso?',3,3);
insert into Resposta (resp_id, resp_texto, top_id, usu_id)
    values(4,'Sério?',3,3); 
insert into Resposta (resp_id, resp_texto, top_id, usu_id)
    values(5,'Pensa mais um pouco',4,4);

-- atv_id pode ser auto_increment

insert into Atividade (atv_id, disc_id, prof_id, tur_ano, tur_semestre, atv_data_limite)
    values (1, 1, 6, 2013, 1, '2014-04-30');
insert into Atividade (atv_id, disc_id, prof_id, tur_ano, tur_semestre, atv_data_limite)
    values (2, 2, 7, 2014, 2, '2013-05-24');
insert into Atividade (atv_id, disc_id, prof_id, tur_ano, tur_semestre, atv_data_limite)
    values (3, 3, 8, 2015, 1, '2014-05-16');
insert into Atividade (atv_id, disc_id, prof_id, tur_ano, tur_semestre, atv_data_limite)
    values (4, 4, 9, 2015, 2, '2015-08-25');
insert into Atividade (atv_id, disc_id, prof_id, tur_ano, tur_semestre, atv_data_limite)
    values (5, 5, 10, 2014, 1, '2014-03-25');

insert into Atividade_has_Aluno (atv_id, alu_id, atv_alu_extensao, atv_alu_data_entrega)
    values (5, 5, '.rar', '2014-03-24');
insert into Atividade_has_Aluno (atv_id, alu_id, atv_alu_extensao, atv_alu_data_entrega)
    values (1, 2, '.rar', '2014-04-26');
insert into Atividade_has_Aluno (atv_id, alu_id, atv_alu_extensao, atv_alu_data_entrega)
    values (4, 1, '.rar', '2015-08-22');
insert into Atividade_has_Aluno (atv_id, alu_id, atv_alu_extensao, atv_alu_data_entrega)
    values (3, 4, '.doc', '2014-05-15');
insert into Atividade_has_Aluno (atv_id, alu_id, atv_alu_extensao, atv_alu_data_entrega)
    values (2, 3, '.pdf', '2013-05-24');


insert into Aluno_has_Turma (alu_id, disc_id, prof_id, tur_ano, tur_semestre)
    values (5, 5, 10, 2014, 1);
insert into Aluno_has_Turma (alu_id, disc_id, prof_id, tur_ano, tur_semestre)
    values (1, 1, 6, 2013, 1);
insert into Aluno_has_Turma (alu_id, disc_id, prof_id, tur_ano, tur_semestre)
    values (2, 2, 7, 2014, 2);
insert into Aluno_has_Turma (alu_id, disc_id, prof_id, tur_ano, tur_semestre)
    values (2, 3, 8, 2015, 1);
insert into Aluno_has_Turma (alu_id, disc_id, prof_id, tur_ano, tur_semestre)
    values (3, 4, 9, 2015, 2);


