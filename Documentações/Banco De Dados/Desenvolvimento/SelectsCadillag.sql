-- Nome de todos os usuários que petencem a uma certa instituição:
Select usu_nome from usuario,instituicao where(usuario.inst_id=instituicao.inst_id);
-- Assunto do tópicos criados por um certo usuário:
Select top_assunto from topico,aluno,usuario where((usuario.usu_nome="Nome_Do_Aluno") and (usuario.usu_id=aluno.alu_id) and (aluno.alu_id=topico.alu_id));
-- Respostas de um certo usuário em relação a um tópico:
Select resp_id,resp_texto from resposta,usuario,topico where((usuario.usu_nome="Nome_Do_Usuario") AND (resposta.top_id=topico.top_id) AND (resposta.usu_id=usuario.usu_id));
-- Atividades submetidas por um aluno:
Select atv_id from atividade,atividade_has_aluno,aluno,usuario where ((usuario.usu_nome="Nome_Do_Aluno") AND  (usuario.usu_id=aluno.alu_id) and (aluno.alu_id=atividade_has_aluno.alu_id) and 
      (atividade.atv_id=atividade_has_aluno.atv_id));
-- Nome,ano e semestre das turmas que um aluno faz parte:
Select disciplina.disc_nome,turma.tur_ano,turma.tur_semestre from disciplina,turma,usuario,aluno,aluno_has_turma,professor where((usuario.usu_nome="Nome_Do_Aluno") AND (usuario.usu_id=aluno.alu_id)and
                 (aluno.alu_id=aluno_has_turma.alu_id)and (turma.tur_ano=aluno_has_turma.tur_ano) and (turma.tur_semestre=aluno_has_turma.tur_semestre) and (turma.disc_id=displina.disc_id)
                 and (aluno_has_turma.prof_id=professor.prof_id) and (turma.prof_id=professor.prof_id));
-- Arquivos que um professor possui no reositório:                       
Select arq_nome,arq_extensao from arquivo,professor,usuario where((usuario.usu_nome="Nome_Do_Professor") AND (usuario.usu_id=professor.prof_id)and(arquivo.prof_id=professor.prof_id));
-- Nome,ano e semestre das turmas que um professor administra:
Select disciplina.disc_nome,turma.tur_ano,turma.tur_semestre from disciplina,turma,usuario,professor where((usuario.usu_nome="Nome_Do_Professor") AND (usuario.usu_id=professor.prof_id)and
                 (turma.tur_semestre=aluno_has_turma.tur_semestre) and (turma.disc_id=displina.disc_id)
                 and (aluno_has_turma.prof_id=professor.prof_id) and (turma.prof_id=professor.prof_id));
-- Nome,ano e semestre das turmas que são de uma disciplina:                    
Select turma.tur_ano,turma.tur_semestre from turma,disciplina where ((displina.disc_nome="Nome_Da_disicplina") and (disciplina.disc_id=turma.disc_id));
-- Nome dos alunos vinculados a uma turma:
Select usu_nome from usuario,aluno,turma,aluno_has_turma where((turma.disc_id="id_disc")and(turma.tur_ano="ano_turma")and(turma.semestre="semestre")and(turma.prof_id="id_prof")
			     and (turma.disc_id=aluno_has_turma.disc_id)and(turma.tur_ano=aluno_has_turma.tur_ano)and(turma.semestre=aluno_has_turma.tur_semestre)and(turma.prof_id=aluno_has_turma.prof_id)
                 and (aluno_has_turma.alu_id=aluno.alu_id)and(aluno.alu_id=usuario.usu_id));
-- Atividades submetidas por uma turma:                                 
Select atividade.atv_id from atividade,turma where ((turma.disc_id=atividade.disc_id)and(turma.tur_ano=atividade.tur_ano)and(turma.semestre=atividade.tur_semestre)and(turma.prof_id=atividade.prof_id));
-- Nome dos alunos pertencentes a um curso:                 
Select usuario.usu_nome from usuario,aluno,curso where((curso.cur_nome="nome_curso")and(curso.cur_id=aluno.cur_id)and (usuario.usu_id=aluno.alu_id));
-- Assunto(nome do assunto) de um tópico:
select assunto.ast_nome,topico.top_assunto from assunto,topico where((assunto.ast_id=topico.ast_id));
-- Todos os tópicos criados por um usuário:
Select topico.top_assunto from topico,usuario where ((usuario.usu_nome="nome do usuario")and (usuario.usu_id=topico.usu_id));
