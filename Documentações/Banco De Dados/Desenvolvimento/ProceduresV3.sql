USE `cadilag` ;
DELIMITER $$


/*
	Nova Entrada Programada
*/
DROP PROCEDURE IF EXISTS voteResposta $$
CREATE PROCEDURE voteResposta(_idresp INT,_valor BOOLEAN,_iduser INT)
BEGIN
	declare busca boolean;
    declare userid int;
	SET busca = (select valor from voto where voto.Resposta_resp_id=_idresp AND voto.Usuario_usu_id=_iduser);
	
    SET userid = (select usu_id from resposta WHERE resp_id=_idresp);
    if(userid<>_iduser) then
		if(isnull(busca)) then
			INSERT into voto(Resposta_resp_id,Usuario_usu_id,valor) values (_idresp,_iduser,_valor);
		else
        begin
			if(busca!=_valor) then
				update voto set valor = _valor where Resposta_resp_id = _idresp AND Usuario_usu_id = _iduser;
			else
				DELETE from voto where Resposta_resp_id = _idresp AND Usuario_usu_id = _iduser;
            end if;
        end;
        end if;
    end if;
END$$

/*
	Nova Entrada Programada
*/
DROP PROCEDURE IF EXISTS detailTurma $$
CREATE PROCEDURE detailTurma(_idturma INT)
BEGIN
	if(_idturma>0) THEN
		BEGIN
			SELECT usuario.*,disciplina.*,curso.*,instituicao.* FROM usuario,turma,disciplina,curso,instituicao WHERE turma.idTurma=_idturma AND disciplina.disc_id=turma.disc_id AND curso.cur_id=disciplina.cur_id AND instituicao.inst_id=curso.inst_id AND turma.prof_id=usuario.usu_id; 
        END;
    ELSE
		SELECT "Campos vazios ou incorretos" as reply,false as sucess;
    END IF;
END$$
/*
	Nova Entrada Programada
*/
DROP PROCEDURE IF EXISTS novaEprogramada $$
CREATE PROCEDURE novaEprogramada(_iduser INT,_idestrutura INT,_descricao VARCHAR(45))
BEGIN
	if(_iduser>0 && _idestrutura>0 && _descricao<>"") THEN
		BEGIN
			insert into entradaprogramada(descricao,Usuario_usu_id,Estrutura_De_Dado_ed_id,hora,data) values (_descricao,_iduser,_idestrutura,current_time(),current_date());   
			SELECT "Salvo com sucesso" as reply,last_insert_id() as ID, true as sucess; 
        END;
    ELSE
		SELECT "Campos vazios ou incorretos" as reply,false as sucess;
    END IF;
END $$

/*
	Criar Instituição
*/
DROP PROCEDURE IF EXISTS novaInstituicao $$
CREATE PROCEDURE novaInstituicao(_nome varchar(100),_uf varchar(2))
BEGIN
	if(_nome<>"" && _uf<>"") THEN
		insert into Instituicao(inst_nome,inst_uf) values (_nome,_uf);   
    ELSE
		SELECT "Campos vazios" as reply,false as sucess;
    END IF;
END $$

/*
	Cadastro de Aluno
*/
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
                    insert into Configuracoes(Usuario_usu_id) values(id);
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
						INSERT INTO Usuario(email,senha, dia_cadastro) VALUES (_email,MD5(_senha),current_date());
                        SET id = LAST_INSERT_ID();
                        insert into Configuracoes(Usuario_usu_id) values(id);
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

/*
Checar Email e Senha
*/
DROP PROCEDURE IF EXISTS CheckPassword $$
CREATE PROCEDURE CheckPassword(_email varchar(45),_senha varchar(45))
BEGIN
	IF ((_email<>"")&&(_senha<>"")) THEN	
		BEGIN
			IF exists (SELECT * FROM Usuario WHERE Usuario.email=_email) THEN
				BEGIN
					IF(MD5(_senha)=(SELECT Usuario.senha FROM Usuario WHERE Usuario.email=_email)) THEN
						SELECT "Bem-vindo!" AS reply,true AS sucess;
					ELSE
						SELECT "Senha incorreta!" AS reply,false AS sucess;
					END IF;
				END;
			ELSE 
				SELECT "Usuário não encontrado!" AS reply,false AS sucess;
			END IF;
		END;
    ELSE
		SELECT "alunoUma ou as duas entradas são vazias" AS reply,false AS sucess;
    END IF;
END $$

/*
	Obter informações do Usuário
*/
DROP PROCEDURE IF EXISTS getUserInfo $$
CREATE PROCEDURE getUserInfo(_idUser INT)
BEGIN
	IF exists (SELECT * FROM Usuario WHERE Usuario.usu_id=_idUser) THEN
		BEGIN
			SELECT usu_fname as fname,usu_lname as lname,usu_nickname as nickname,true as sucess FROM Usuario WHERE Usuario.usu_id=_idUser;
		END;
	ELSE
		SELECT "Usuário não encontrado" As reply,false AS sucess;
	END IF;
END $$

/*
	Configurar Usuário
*/
DROP PROCEDURE IF EXISTS setFname $$
CREATE PROCEDURE setFname(_idUser INT,_Fname VARCHAR(100))
BEGIN
	IF exists (SELECT * FROM Usuario WHERE Usuario.usu_id=_idUser) THEN
		BEGIN
			UPDATE Usuario SET usu_fname=_Fname WHERE Usuario.usu_id=_idUser;
            SELECT "Primeiro Nome do Usuário Alterado" AS reply,true AS sucess;
		END;
	ELSE
		SELECT "Usuário não encontrado" As reply,false AS sucess;
	END IF;
END $$

DROP PROCEDURE IF EXISTS setLname $$
CREATE PROCEDURE setLname(_idUser INT,_Lname VARCHAR(100))
BEGIN
	IF exists (SELECT * FROM Usuario WHERE Usuario.usu_id=_idUser) THEN
		BEGIN
			UPDATE Usuario SET usu_lname=_Lname WHERE Usuario.usu_id=_idUser;
            SELECT "Último Nome do Usuário Alterado" AS reply,true AS sucess;
		END;
	ELSE
		SELECT "Usuário não encontrado" As reply,false AS sucess;
	END IF;
END $$

DROP PROCEDURE IF EXISTS setNickname $$
CREATE PROCEDURE setNickname(_idUser INT,_Nickname VARCHAR(100))
BEGIN
	IF exists (SELECT * FROM Usuario WHERE Usuario.usu_id=_idUser) THEN
		BEGIN
			UPDATE Usuario SET usu_nickname=_Nickname WHERE Usuario.usu_id=_idUser;
            SELECT "Nickname do Usuário Alterado" AS reply,true AS sucess;
		END;
	ELSE
		SELECT "Usuário não encontrado" As reply,false AS sucess;
	END IF;
END $$

/*
	Cadilag.HUB
*/
/*
	Novo Tótpico
*/

DROP PROCEDURE IF EXISTS novoTopico $$
CREATE PROCEDURE `novoTopico`(_idUser INT,_topAssunto VARCHAR(100),_textTopico LONGTEXT,_idturma INT,_particular BOOLEAN,_anonimo BOOLEAN,_report BOOLEAN)
BEGIN
	IF exists (SELECT * FROM Usuario WHERE Usuario.usu_id=_idUser) THEN
		BEGIN
			INSERT INTO Topico(usu_id,top_assunto,topico_texto, data, hora,Turma_idTurma,visible_only_by_class,anonimo,report) VALUES (_idUser,_topAssunto,_textTopico, current_date(), current_time(),_idturma,_particular,_anonimo,_report);
			SELECT "Novo Tópico registrado" as reply,true aS sucess;
        END;
	ELSE
		SELECT "Usuário não encontrado" As reply,false AS sucess;
	END IF;
END $$



/*
	Recuparar topicos
*/

DROP PROCEDURE IF EXISTS obterTopicos $$
CREATE PROCEDURE obterTopicos(_inicio INT,_fim INT)
BEGIN
IF _inicio<_fim THEN
	BEGIN
		SELECT top_id AS id,top_assunto AS titulo,topico_texto AS descricao,true AS sucess FROM Topico LIMIT _inicio,_fim;
	END;
ELSE
	SELECT "O inicio deve ser menor que o fim" AS reply,false AS sucess; 
END IF;
END $$

DELIMITER ;