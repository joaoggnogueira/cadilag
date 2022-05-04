-- novaResposta
delimiter $$
create procedure novaResposta(usuario_id int, topico_id int,resp_texto longtext)
begin
	if((usuario_id > 0)&&(topico_id != "")) then
		begin
			insert into resposta(resp_texto,top_id,usu_id, data,hora) values (usuario_id,topico_id,resp_texto, current_date(), current_time());
			select 'Nova Resposta criada com sucesso' as reply, 1 as sucess;
        end;
    else
	  select 'O CAMPO USUARIO E TOPICO DEVEM SER FORNECIDOS' as reply, 0 as sucess;
    end if;  	
end $$
-- setCssCover
create procedure setCssCover(usuario_id int,cssImgCov varchar(100))
begin
	if((usuario_id > 0)&&(cssImgCov != "")) then
	  begin		
        declare conf int;
        set conf = (select Usuario_usu_id from Configuracoes where(Usuario_usu_id=usuario_id));
        if(isnull(conf)) then
			insert into Configuracoes(Usuario_usu_id,cssImgCover) values(usuario_id,cssImgCover);
        else
			update Configuracoes set Configuracoes.cssImgCover=cssImgCov where(Configuracoes.Usuario_usu_id=usuario_id);
        end if;
        select 'CssCover Inserido/Atualizado com sucesso!!!' as reply, 1 as sucess;
      end;  
	else
	  select 'O CAMPO USUARIO_ID E cssImgCov DEVEM SER FORNECIDOS' as reply, 0 as sucess;
    end if;  	
end$$
-- setImgUser
create procedure setImgUser(usuario_id int,imgUser varchar(100))
begin
	if((usuario_id >0)&&(imgUser != "")) then
	  begin		
        declare conf int;
        set conf = (select Usuario_usu_id from Configuracoes where(Usuario_usu_id=usuario_id));
        if(isnull(conf)) then
			insert into Configuracoes(Usuario_usu_id,Path_imguser) values(usuario_id,imgUser);
        else
			update Configuracoes set Configuracoes.Path_imguser=imgUser where(Configuracoes.Usuario_usu_id=usuario_id);
        end if;
        select 'Atualização/Inserção ImgUser Realizado com sucesso' as reply, 1 as sucess;
      end;  
	else
	  select 'O CAMPO USUARIO_ID E imgUser DEVEM SER FORNECIDOS' as reply, 0 as sucess;
    end if; 
end$$
-- setImgCover
create procedure setImgCover(usuario_id int,imgCover varchar(100))
begin
	if((usuario_id >0)&&(imgCover != "")) then
	  begin		
        declare conf int;
        set conf = (select Usuario_usu_id from Configuracoes where(Usuario_usu_id=usuario_id));
        if(isnull(conf)) then
			insert into Configuracoes(Usuario_usu_id,Path_imgcover) values(usuario_id,imgCover);
        else
			update Configuracoes set Configuracoes.Path_imgcover=imgCover where(Configuracoes.Usuario_usu_id=usuario_id);
        end if;
		select 'Atualização/Inserção da ImgCover realizada com sucesso' as reply, 1 as sucess;
      end;  
	else
	  select 'O CAMPO USUARIO_ID E imgCover DEVEM SER FORNECIDOS' as reply, 0 as sucess;
    end if; 
end$$
-- novoCurso
create procedure novoCurso(c_nome varchar(45),c_sigla varchar(5),ins_id int)
begin
	if((ins_id >0)&&(c_nome != "")&&(c_sigla != "")) then
	  begin
		insert into Curso(cur_nome,cur_sigla,inst_id) values (c_nome,c_sigla,ins_id);
		select 'Novo Curso criado com sucesso' as reply, 1 as sucess;
      end;
	else
	  select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
    end if; 
end$$
-- novaDisciplina
create procedure novaDisciplina(d_nome varchar(45),c_id int)
begin
	if((d_nome != "")&&(c_id > 0)) then
	  begin	
		insert into Disciplina(Disc_nome,cur_id) values (d_nome,c_id);
		select 'Nova Disciplina criada com sucesso' as reply, 1 as sucess;
      end;	
     else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
     end if;   
end$$
-- novaTurma
create procedure novaTurma(t_ano int,t_sem int,pf_id int,d_id int)
begin
	if((d_id > 0)&&(pf_id>0)&&(t_sem>0)&&(t_ano>0)) then
	  begin	
		insert into Turma(tur_ano,tur_semestre,prof_id,disc_id) values (t_ano,t_sem,pf_id,d_id);
		select 'Nova Turma criada com sucesso!!' as reply, 1 as sucess;
      end;
     else
		select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
     end if;
end$$
-- novaAtividade
CREATE DEFINER=`root`@`localhost` PROCEDURE `novaAtividade`(a_data_lim DATE,a_titulo varchar(45),a_texto longtext,t_id int)
begin
	 if(!isnull(a_data_lim)&&(a_titulo!="")&&(a_texto!="")&&(t_id>0)) then
		begin
			insert into Atividade(atv_data_limite,idTurma,atv_titulo,atv_texto, atv_data, atv_hora) values(a_data_lim,t_id,a_titulo,a_texto, current_date(), current_time());
			select 'Nova Atividade criada com sucesso' as reply, 1 as sucess,(SELECT last_insert_id()) as id;
        end;    
	 else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
	 end if;  
end$$
-- setTurmaAluno
create procedure serTurmaAluno(a_id int, tur_id int)
begin
	if((alu_id>0)&&(turm_id>0)) then
	  begin	
        update Aluno set Aluno.idTurma=tur_id where Aluno.alu_id=a_id;
        select 'Aluno Registrado em uma Turma com sucesso!!' as reply, 1 as sucess;
       end; 
    else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
	end if;		
end$$
-- initEstruturaDeDados
create procedure initEstruturaDeDados()
begin
	delete from Estrutura_De_Dado where (ed_id!=null);
    insert into Estrutura_De_Dado(ed_id,ed_nome) values(1, 'Lista Encadeada Ordenada Simples');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(2, 'Lista Encadeada Ordenada Estática');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(3, 'Lista Encadeada Ordenada Dupla');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(4, 'Lista Encadeada Não Ordenada Simples');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(5, 'Lista Encadeada Não Ordenada Dupla');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(6, 	'Lista Cruzada');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(7, 'Fila Estática Simples');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(8, 'Fila Dinâmica Com Prioridade');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(9, 'Fila Dinâmica Sem Prioridade');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(10, 'Fila Circular');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(11, 'Pilha Estática Normal');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(12, 'Pilha Estática Múltipla');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(13, 'Pilha Dinâmica Simples');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(14, 'Hashing sem tratamento');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(15, 'Hashing com tratamento');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(16, 'Árvore AVL');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(17, 'Árvore B');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(18, 'Árvore B+');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(19, 'Árvore Rubro-Negra');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(20, 'Árvore Binaria');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(21, 'Árvore Trie');
	insert into Estrutura_De_Dado(ed_id,ed_nome) values(22, 'Árvore Patricia');
    select 'Estruturas de Dados inicializadas com sucesso!!!' as reply, 1 as sucess;
    
end$$
 
create procedure obterRespostaAoTopico(topic_id int)
begin
	if((topic_id>0)) then
		begin
			select * from Resposta inner join Topico on(Topico.top_id=Resposta.top_id) where (topic_id=Topico.top_id);
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
	end if;
end$$
-- regitrarLogin
create procedure registrarLogin(usua_id int)
begin
	if((usua_id>0)) then
		begin
			update Usuario set last_login_date=null,last_login_hour=null where (Usuario.usu_id=usua_id);
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
	end if;
end$$
-- regitrarLogout
create procedure registrarLogout(usua_id int)
begin
	if((usua_id>0)) then
		begin
			update Usuario set last_login_date=CURDATE(),last_login_hour=CURTIME() where (Usuario.usu_id=usua_id);
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as failure;
	end if;
end$$    

-- responderSolicitação
create procedure responderSolicitacao(solicitacao_id int, resposta BOOL)
begin
	if((solicitacao_id>0)&&(resposta = true))then
		begin
			update Aluno set Aluno.idTurma=(select solicitacao.Turma_idTurma from solicitacao where solicitacao.idsolicitacao=solicitacao_id) where Aluno.alu_id=(select solicitacao.Aluno_alu_id from solicitacao where solicitacao.idsolicitacao=solicitacao_id);
			delete from solicitacao where idsolicitacao=solicitacao_id;
			select 'Aluno Vinculado com sucesso!!!' as reply, 1 as sucess;
        end;
     else
     begin
      delete from solicitacao where idsolicitacao=solicitacao_id;
      select 'Solicitacao negada!!!' as reply, 0 as sucess;
	 end;
     end if; 
end$$

-- verificarEhAluno
create procedure verificarEhAluno(usua_id int)
begin
	if(usua_id>0) then
		begin
			declare valor int;
            set valor = (select alu_id from Aluno where usua_id=Aluno.alu_id);
            if(valor>0) then
				select 'O usuario é um aluno!!!' as reply, 1 as sucess;
            else 
				select 'O usuario não é um aluno!!!' as reply, 0 as sucess;
			end if;
        end;
    else 
		select 'O usuario não é um aluno!!!' as reply, 0 as sucess;
    end if;    
end$$
-- estruturaDeDadosProgramada
create procedure estruturaDeDadosProgramada(usua_id int)
begin
	if(usua_id>0) then
		begin
			select ed_id,ed_nome from estrutura_de_dado where ed_id IN( select distinct Estrutura_De_Dado_ed_id from EntradaProgramada inner join Usuario on(EntradaProgramada.Usuario_usu_id=Usuario.usu_id) where (EntradaProgramada.Usuario_usu_id=usua_id));
        end;
    else 
		select 'O usuario inválido!!!' as reply, 0 as sucess;
	end if;
end$$

-- registrarNovoArquivoParaUmaAtividade
create procedure registrarNovoArquivoParaUmaAtividade(usua_id int,nome_arq varchar(100), ext_arq varchar(100), caminho_arq varchar(100),id_ativ int)
begin
	if((usua_id>0)&&(nome_arq!="")&&(ext_arq!="")&&(caminho_arq!="")&&(id_ativ>0)) then
		begin
			insert into Arquivo(idusuario,descricao,tipo,caminho,id_ativ,data,hora) values(usua_id,nome_arq,ext_arq, caminho_arq,id_ativ,curdate(),current_time());
			select 'Arquivo inserido com sucesso' as reply, 1 as sucess;
		end;
    else
		select 'OS CAMPOS DEVEM SER PREENCHIDOS' as reply, 0 as sucess;
    end if;    
end$$      


-- solicitarEntradaEmTurma
create procedure solicitarEntradaEmTurma(usua_id int,turma_id int)
begin
	if((usua_id>0)&&(turma_id>0)) then
		begin
		  declare val int;
			
		  set val= (select alu_id from Aluno where alu_id=usua_id);
          if(val>0) then
			begin
				insert into solicitacao(Aluno_alu_id,Turma_idTurma) values (usua_id,turma_id);
                select 'Solicitação efetuada com sucesso!!!' as reply, 1 as sucess;
            end;
           else
            select 'O usuario não é um aluno!!!' as reply, 0 as sucess;
           end if; 
        end;
    else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
    end if;
end$$