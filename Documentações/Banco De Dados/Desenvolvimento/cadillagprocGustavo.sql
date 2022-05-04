-- novaResposta
delimiter $$
create procedure novaResposta(usuario_id int, topico_id int,resp_texto longtext)
begin
	if((usuario_id > 0)&&(topico_id != "")) then
		begin
			insert into resposta(resp_texto,top_id,usu_id) values (usuario_id,topico_id,resp_texto);
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
	if((c_nome != "")&&(c_id > 0)) then
	  begin	
		insert into Disciplina(Disc_nome,cur_id) values (d_nome,c_id);
		select 'Nova Disciplina criada com sucesso' as reply, 1 as sucess;
      end;	
     else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
     end if;   
end$$
-- novaTurma
create procedure novaTurma(t_ano int,t_sem int,t_desc varchar(45),pf_id int,d_id int)
begin
	if((t_desc != "")&&(d_id > 0)&&(pf_d>0)&&(t_sem>0)&&(t_ano>0)) then
	  begin	
		insert into Turma(tur_ano,tur_semestre,prof_id,disc_id,tur_descricao) values (t_ano,t_sem,pf_id,d_id,t_desc);
		select 'Nova Turma criada com sucesso!!' as reply, 1 as sucess;
      end;
     else
		select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
     end if;
end$$
-- novaAtividade
create procedure novaAtividade(a_data_lim DATE,a_titulo varchar(45),a_texto longtext, pf_email varchar(45),pf_senha varchar(45), pf_id int,t_id int)
begin
	 if(!isnull(a_data_lim)&&(a_titulo!="")&&(a_texto!="")&&(pf_email!="")&&(pf_senha!="")&&(pf_id>0)&&(t_id>0)) then
		begin
			declare senha,email varchar(45);
			set senha = (select senha from Usuario where(usu_id=pf_id));
			set email = (select email from Usuario where(usu_id=pf_id));
			if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
			else
				begin
					insert into Atividade(atv_data_limite,idTurma,atv_titulo,atv_texto) values(a_data_lim,t_id,a_titulo,a_texto);
					select 'Nova Atividade criada com sucesso' as reply, 1 as sucess;
                end;
            end if;
        end;    
	 else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess	;
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
-- setPseudoCodigoAdd
-- create procedure setPseudoCodigoAdd(est_id int,ed_cod longtext)
-- begin
-- 	  	if((est_id>0)&&(ed_cod != "")) then
-- 		  begin
-- 			update Estrutura_De_Dado set ed_Add_html=ed_cod where(Estrutura_De_Dado.ed_id=est_id);
-- 			select 'PseudoCodigoAdd atulizado com sucesso' as reply, 1 as sucess;
--          end;	
--        else
-- 			select 'OS CAMPOS DEVEM SER FORNECIDOS'	;
--        end if;    
-- end$$
-- setPseudoCodigoRem
-- create procedure setPseudoCodigoRem(est_id int,ed_cod longtext)
-- begin
-- 		if((est_id>0)&&(ed_cod != "")) then
-- 			begin
--            update Estrutura_De_Dado set ed_Rem_html=ed_cod where(Estrutura_De_Dado.ed_id=est_id);
--            select 'SPseudoCodigoRem atulizado com sucesso!!!' as reply, 1 as sucess;
--            end;
-- 		else
-- 			select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
--        end if;    
-- end$$
-- setPseudoCodigoSearch
-- create procedure setPseudoCodigoSearch(est_id int,ed_cod longtext)
-- begin
-- 		if((est_id>0)&&(ed_cod != "")) then
-- 		  begin	
--            update Estrutura_De_Dado set ed_Search_html=ed_cod where(Estrutura_De_Dado.ed_id=est_id);
--            select 'PseudoCodigoSearch atulizado com sucesso' as reply, 1 as sucess;
-- 		  end;	
--        else
-- 			select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
--        end if;    
-- end$$

-- verificarPermissãoPseudocodigoAdd
create procedure verificarPermissãoPseudocodigoAdd(alun_id int,esd_id int)
begin
	if((alun_id>0)&&(est_id>0)) then
		begin
		 declare permission int;	
		  set permission = (select Tipo_Permissao_tper_value from Permissoes_has_Tipo_Permissao inner join Permissoes on (Permissoes_permissoes_id=permissao_id) inner join Turma on (Turma_idTurma=idTurma) 
            inner join Aluno on (Turma.idTurma=Aluno.idTurma) where((alun_id=Aluno.alu_id)&&(Permissoes.ed_id=esd_id)&&(Tipo_Permissao_tper_value=1)));
          
          if((permission!= null)&&(permission=1)) then
			select 'O Aluno tem permissão para PseudoCodeAdd'	as reply, 1 as sucess;
          else
			select 'O Aluno não tem permissão para PseudoCodeAdd'	as reply, 0 as sucess;
          end if;  
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
    end if;    
end$$
-- verificarPermissãoPseudocodigoSearch
create procedure verificarPermissãoPseudocodigoSearch(alun_id int,esd_id int)
begin
	if((alun_id>0)&&(est_id>0)) then
		begin
		 declare permission int;	
		  set permission = (select Tipo_Permissao_tper_value from Permissoes_has_Tipo_Permissao inner join Permissoes on (Permissoes_permissoes_id=permissao_id) inner join Turma on (Turma_idTurma=idTurma) 
            inner join Aluno on (Turma.idTurma=Aluno.idTurma) where((alun_id=Aluno.alu_id)&&(Permissoes.ed_id=esd_id)&&(Tipo_Permissao_tper_value=3)));
          
          if((permission!= null)&&(permission=3)) then
			select 'O Aluno tem permissão para PseudoCodeSearch'	as reply, 1 as sucess;
          else
			select 'O Aluno não tem permissão para PseudoCodeSearch'	as reply, 0 as sucess;
          end if;  
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
    end if;    
end$$
-- verificarPermissãoPseudocodigoRem
create procedure verificarPermissãoPseudocodigoRem(alun_id int,esd_id int)
begin
	if((alun_id>0)&&(est_id>0)) then
		begin
		 declare permission int;	
		  set permission = (select Tipo_Permissao_tper_value from Permissoes_has_Tipo_Permissao inner join Permissoes on (Permissoes_permissoes_id=permissao_id) inner join Turma on (Turma_idTurma=idTurma) 
            inner join Aluno on (Turma.idTurma=Aluno.idTurma) where((alun_id=Aluno.alu_id)&&(Permissoes.ed_id=esd_id)&&(Tipo_Permissao_tper_value=2)));
          
          if((permission!= null)&&(permission=2)) then
			select 'O Aluno tem permissão para PseudoCodeRem'	as reply, 1 as sucess;
          else
			select 'O Aluno não tem permissão para PseudoCodeRem'	as reply, 0 as sucess;
          end if;  
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
    end if;    
end$$
-- verificarPermissãoAnimacaoAdd
create procedure verificarPermissãoAnimacaoAdd(alun_id int,esd_id int)
begin
	if((alun_id>0)&&(est_id>0)) then
		begin
		 declare permission int;	
		  set permission = (select Tipo_Permissao_tper_value from Permissoes_has_Tipo_Permissao inner join Permissoes on (Permissoes_permissoes_id=permissao_id) inner join Turma on (Turma_idTurma=idTurma) 
            inner join Aluno on (Turma.idTurma=Aluno.idTurma) where((alun_id=Aluno.alu_id)&&(Permissoes.ed_id=esd_id)&&(Tipo_Permissao_tper_value=4)));
          
          if((permission!= null)&&(permission=4)) then
			select 'O Aluno tem permissão para AnimacaoAdd'	as reply, 1 as sucess;
          else
			select 'O Aluno não tem permissão para AnimacaoAdd'	as reply, 0 as sucess;
          end if;  
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
    end if;    
end$$
-- verificarPermissãoAnimacaoRem
create procedure verificarPermissãoAnimacaoRem(alun_id int,esd_id int)
begin
	if((alun_id>0)&&(est_id>0)) then
		begin
		 declare permission int;	
		  set permission = (select Tipo_Permissao_tper_value from Permissoes_has_Tipo_Permissao inner join Permissoes on (Permissoes_permissoes_id=permissao_id) inner join Turma on (Turma_idTurma=idTurma) 
            inner join Aluno on (Turma.idTurma=Aluno.idTurma) where((alun_id=Aluno.alu_id)&&(Permissoes.ed_id=esd_id)&&(Tipo_Permissao_tper_value=5)));
          
          if((permission!= null)&&(permission=5)) then
			select 'O Aluno tem permissão para AnimacaoRem'	as reply, 1 as sucess;
          else
			select 'O Aluno não tem permissão para AnimacaoRem'	as reply, 0 as sucess;
          end if;  
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
    end if;    
end$$
-- verificarPermissãoAnimacaoSearch
create procedure verificarPermissãoAnimacaoRem(alun_id int,esd_id int)
begin
	if((alun_id>0)&&(est_id>0)) then
		begin
		 declare permission int;	
		  set permission = (select Tipo_Permissao_tper_value from Permissoes_has_Tipo_Permissao inner join Permissoes on (Permissoes_permissoes_id=permissao_id) inner join Turma on (Turma_idTurma=idTurma) 
            inner join Aluno on (Turma.idTurma=Aluno.idTurma) where((alun_id=Aluno.alu_id)&&(Permissoes.ed_id=esd_id)&&(Tipo_Permissao_tper_value=6)));
          
          if((permission!= null)&&(permission=6)) then
			select 'O Aluno tem permissão para AnimacaoSearch'	as reply, 1 as sucess;
          else
			select 'O Aluno não tem permissão para AnimacaoSearch'	as reply, 0 as sucess;
          end if;  
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS'	as reply, 0 as sucess;
    end if;    
end$$
-- initTiposDePermissao
create procedure initTiposDePermissao()
begin
	delete from Tipo_Permissao where (tper_value!=null);
    insert into Tipo_Permissao(tper_value,tper_nome) values(1, 'PseudocodeAdd');
	insert into Tipo_Permissao(tper_value,tper_nome) values(2, 'PseudocodeRem');
	insert into Tipo_Permissao(tper_value,tper_nome) values(3, 'PseudocodeSearch');
	insert into Tipo_Permissao(tper_value,tper_nome) values(4, 'AnimationAdd');
	insert into Tipo_Permissao(tper_value,tper_nome) values(5, 'AnimationRem');
	insert into Tipo_Permissao(tper_value,tper_nome) values(6, 'AnimationSearch');
    select 'Tipos de permissão inicializados com sucesso' as reply, 1 as sucess;
end$$    
-- HabitilarPseudocodeAdd
create procedure habitilarPseudocodeAdd(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int)
begin
		declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			insert into Permissoes(ed_id,Turma_idTurma) values(est_id,tumea_id);
            insert into Permissoes_has_Tipo_Permissao(select last_insert_id(),1);
            select 'PseucodeAdd habilitado com sucesso!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- RemoverPseudocodeAdd
create procedure removerPseudocodeAdd(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int,perm_id int)
begin
			declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			delete from Permissoes where permissao_id=perm_id;
            delete from Permissoes_has_Tipo_Permissao where (permissao_id=perm_id) and (Tipo_Permissao_has_tper_value=1);
            select 'PseucodeAdd removido com sucesso!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- HabitilarPseudocodeRem
create procedure habitilarPseudocodeRem(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int)
begin
		declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			insert into Permissoes(ed_id,Turma_idTurma) values(est_id,tumea_id);
            insert into Permissoes_has_Tipo_Permissao(select last_insert_id(),2);
            select 'Pseudocoderem habilitado com sucesso!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- RemoverPseudocodeRem
create procedure removerPseudocodeRem(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int,perm_id int)
begin
			declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			delete from Permissoes where permissao_id=perm_id;
            delete from Permissoes_has_Tipo_Permissao where (permissao_id=perm_id) and (Tipo_Permissao_has_tper_value=2);
            select 'PseudocodeRem removido com sucesso!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- HabitilarPseudocodeSearch
create procedure habitilarPseudocodeSearch(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int)
begin
		declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			insert into Permissoes(ed_id,Turma_idTurma) values(est_id,tumea_id);
            insert into Permissoes_has_Tipo_Permissao(select last_insert_id(),3);
            select 'Pseudocode search habilitado com sucesso' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- RemoverPseudocodeSearch
create procedure removerPseudocodeSearch(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int,perm_id int)
begin
			declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			delete from Permissoes where permissao_id=perm_id;
            delete from Permissoes_has_Tipo_Permissao where (permissao_id=perm_id) and (Tipo_Permissao_has_tper_value=3);
            select 'PseudocodeSearch removido com sucesso!!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- HabitilarAnimationAdd
create procedure habitilarAnimationAdd(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int)
begin
		declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			insert into Permissoes(ed_id,Turma_idTurma) values(est_id,tumea_id);
            insert into Permissoes_has_Tipo_Permissao(select last_insert_id(),4);
            select 'AnimationAdd habilitado com sucesso' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- RemoverAnimationAdd
create procedure removerAnimationAdd(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int,perm_id int)
begin
			declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			delete from Permissoes where permissao_id=perm_id;
            delete from Permissoes_has_Tipo_Permissao where (permissao_id=perm_id) and (Tipo_Permissao_has_tper_value=4);
            select 'AnimationAdd removido com sucesso!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- HabitilarAnimationRem
create procedure habitilarAnimationRem(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int)
begin
		declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos'as reply, 0 as sucess;
		else
		 begin		
			insert into Permissoes(ed_id,Turma_idTurma) values(est_id,tumea_id);
            insert into Permissoes_has_Tipo_Permissao(select last_insert_id(),5);
            select 'AnimationRem habilitado com sucesso!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- RemoverAnimationRem
create procedure removerAnimationRem(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int,perm_id int)
begin
		declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			delete from Permissoes where permissao_id=perm_id;
            delete from Permissoes_has_Tipo_Permissao where (permissao_id=perm_id) and (Tipo_Permissao_has_tper_value=5);
            select 'AnimationRem removido com sucesso!!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- HabitilarAnimationSearch
create procedure habitilarAnimationSearch(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int)
begin
		declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			insert into Permissoes(ed_id,Turma_idTurma) values(est_id,tumea_id);
            insert into Permissoes_has_Tipo_Permissao(select last_insert_id(),6);
            select 'AnimationSearch Habilitado com sucesso' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- RemoverAnimationSearch
create procedure removerAnimationSearch(pf_email varchar(45),pf_senha varchar(45), pf_id int,est_id int,turma_id int,perm_id int)
begin
			declare senha,email varchar(45);
		set senha = (select senha from Usuario where(usu_id=pf_id));
		set email = (select email from Usuario where(usu_id=pf_id));
        if((senha!=pf_senha) or (email!=pf_email)) then
				select 'Campo email ou senha incorretos' as reply, 0 as sucess;
		else
		 begin		
			delete from Permissoes where permissao_id=perm_id;
            delete from Permissoes_has_Tipo_Permissao where (permissao_id=perm_id) and (Tipo_Permissao_has_tper_value=6);
				select 'AnimationSearch Removido com sucesso!!' as reply, 1 as sucess;
		 end;
        end if; 
end$$
-- PROCEDURES NOVAS DIA 26/01/2015
-- Solicitar PseudoCodeAdd
-- create procedure solicitarPseudocodeAdd(usua_id int, estr_id int)
-- begin
-- 	if((usua_id>0)&&(estr_id>0)) then
-- 		select ed_Add_html from Estrutura_De_Dado inner join EntradaProgramada on (Estrutura_De_Dado.ed_id=EntradaProgramada.Estrutura_de_Dado_ed_id)
--        inner join Usuario on (Usuario.usu_id=EntradaProgramada.Usuario_usu_id)  where ((Estrutura_De_Dado.ed_id=estr_id) and (Usuario.usu_id=usua_id));  
--    else
-- 		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
-- 	end if;	
-- end$$
-- solicitarPseudoRem
-- create procedure solicitarPseudocodeRem(usua_id int, estr_id int)
-- begin
-- 	if((usua_id>0)&&(estr_id>0)) then
-- 		select ed_Rem_html from Estrutura_De_Dado inner join EntradaProgramada on (Estrutura_De_Dado.ed_id=EntradaProgramada.Estrutura_de_Dado_ed_id)
--        inner join Usuario on (Usuario.usu_id=EntradaProgramada.Usuario_usu_id)  where ((Estrutura_De_Dado.ed_id=estr_id) and (Usuario.usu_id=usua_id));  
--    else
-- 		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess	;
-- 	end if;	
-- end$$
-- solicitarPseudocodeBusca
-- create procedure solicitarPseudocodeBusca(usua_id int, estr_id int)
-- begin
-- 	if((usua_id>0)&&(estr_id>0)) then
-- 		select ed_Search_html from Estrutura_De_Dado inner join EntradaProgramada on (Estrutura_De_Dado.ed_id=EntradaProgramada.Estrutura_de_Dado_ed_id)
--        inner join Usuario on (Usuario.usu_id=EntradaProgramada.Usuario_usu_id)  where ((Estrutura_De_Dado.ed_id=estr_id) and (Usuario.usu_id=usua_id));  
--    else
-- 		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess	;
-- 	end if;	
-- end$$
-- obterTopicosDoUsuario
-- create procedure obterTopicosDoUsuario(usua_id int)
-- begin
-- 	if((usua_id>0)) then
-- 		begin
-- 			select * from Topico inner join Usuario on(Topico.usu_id=Usuario.usu_id) where (usu_id=Usuario.usu_id);
--        end;
-- 	else
-- 		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess;
-- 	end if;
-- end$$
-- obterRespostaAoTopico
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
            select 'LOGIN REGISTRADO COM SUCESSO' as reply, 1 as sucess;
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
            select 'LOGOUT REGSTRADO COM SUCESSO' as reply, 1 as sucess;
        end;
	else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as failure;
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
-- responderSolicitação
create procedure responderSolicitacao(solicitacao_id int, resposta BOOL)
begin
	if((solicitacao_id>0)&&(resposta = true))then
		begin
			declare idturm,idAlun int;
            set idturm = (select Turma_idTurma from solicitacao where idsolicitacao=solicitacao_id);
            set idAlun = (select Aluno_al_idu from solicitacao where idsolicitacao=solicitacao_id);
            if((idturm>0)&&(idAlun>0)) then
				begin
					update Aluno set Aluno.idTurma=idturm where Aluno.alu_id=idAlun;
                    delete from solicitacao where idsolicitacao=solicitacao_id;
                    select 'Aluno Vinculado com sucesso!!!' as reply, 1 as sucess;
                end;
            else
				select 'Solicitacao não encontrada!!!' as reply, 0 as sucess;
            end if;
        end;
     else
      select 'Solicitacao negada!!!' as reply, 0 as sucess;
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
			select distinct Estrutura_De_Dado_ed_id from EntradaProgramada inner join Usuario on(EntradaProgramada.idusuario=Usuario.usu_id) where (EntradaProgramada.idusuario=usua_id);
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
			insert into Arquivo(idusuario,descricao,tipo,caminho,id_ativ) values(usua_id,nome_arq,ext_arq, caminho_arq,id_ativ);
			select 'Arquivo inserido com sucesso' as reply, 1 as sucess;
		end;
    else
		select 'OS CAMPOS DEVEM SER PREENCHIDOS' as reply, 0 as sucess;
    end if;    
end$$