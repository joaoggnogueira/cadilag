delimiter $$
create procedure novaResposta(usuario_id int, topico_id int,resp_texto longtext)
begin
	if((usuario_id > 0)&&(topico_id != "")) then
		begin
			insert into resposta(resp_texto,top_id,usu_id, data, hora) values (usuario_id,topico_id,resp_texto, current_date(), current_time());
			select 'Nova Resposta criada com sucesso' as reply, 1 as sucess;
        end;
    else
	  select 'O CAMPO USUARIO E TOPICO DEVEM SER FORNECIDOS' as reply, 0 as sucess;
    end if;  	
end $$

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
					insert into Atividade(atv_data_limite,idTurma,atv_titulo,atv_texto, atv_data, atv_hora) values(a_data_lim,t_id,a_titulo,a_texto, current_date(), current_time());
					select 'Nova Atividade criada com sucesso' as reply, 1 as sucess;
                end;
            end if;
        end;    
	 else
		select 'OS CAMPOS DEVEM SER FORNECIDOS' as reply, 0 as sucess	;
	 end if;  
end$$

DROP PROCEDURE IF EXISTS novoTopico $$
CREATE PROCEDURE novoTopico(_idUser INT,_topAssunto VARCHAR(100),_textTopico LONGTEXT)
BEGIN
	IF exists (SELECT * FROM Usuario WHERE Usuario.usu_id=_idUser) THEN
		BEGIN
			INSERT INTO Topico(usu_id,top_assunto,path_topico, data, hora) VALUES (_idUser,_topAssunto,_pathTopico, current_date(), current_time());
			SELECT "Novo Tópico registrado" as reply,true aS sucess;
        END;
	ELSE
		SELECT "Usuário não encontrado" As reply,false AS sucess;
	END IF;
END $$

DROP PROCEDURE IF EXISTS LogupProfessor $$
CREATE PROCEDURE LogupProfessor(_email varchar(45),_senha varchar(45))
BEGIN
	IF(_email<>"" && _senha<>"") THEN
		BEGIN
			IF exists (SELECT * FROM Usuario WHERE Usuario.email=_email) THEN
				SELECT "Usuário já cadastrado" AS reply,"-1" as ID,false AS sucess;
			ELSE
				BEGIN
					DECLARE id INT;
					INSERT INTO Usuario(email,senha, dia_cadastro) VALUES (_email,MD5(_senha), current_date());
                    SET id = LAST_INSERT_ID();
					INSERT INTO Professor(prof_id) VALUES (id);
					SELECT "Usuário cadastrado com sucesso" AS reply,id as ID,true AS sucess;
				END;
			END IF;
		END;
	ELSE
		SELECT "Uma ou as duas entradas são vazias" AS reply,false AS sucess;
	END IF;
END $$

DROP PROCEDURE IF EXISTS LogupAluno $$
CREATE PROCEDURE LogupAluno(_email varchar(45),_senha varchar(45))
BEGIN
	IF(_email<>"" && _senha<>"") THEN
		BEGIN
			IF exists (SELECT * FROM Usuario WHERE Usuario.email=_email) THEN
				SELECT "Usuário já cadastrado" AS reply,"-1" as ID,false AS sucess;
			ELSE
				BEGIN
					BEGIN
						DECLARE id INT;
						INSERT INTO Usuario(email,senha, dia_cadastro) VALUES (_email,MD5(_senha), current_date());
                        SET id = LAST_INSERT_ID();
						INSERT INTO Aluno(alu_id) VALUES (id);
						SELECT "Usuário cadastrado com sucesso" AS reply,id as ID,true AS sucess;
					END;					
				END;
			END IF;
		END;
	ELSE
		SELECT "Uma ou as duas entradas são vazias" AS reply,false AS sucess;
	END IF;
END $$
