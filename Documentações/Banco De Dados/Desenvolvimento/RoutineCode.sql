CREATE DEFINER=`root`@`localhost` PROCEDURE `registerCode`(_idUser INT,_idEstruturaDeDado INT)
BEGIN
    IF exists (SELECT * FROM Usuario WHERE Usuario.usu_id=_idUser) THEN
        BEGIN
            IF exists (SELECT * FROM estrutura_de_dado WHERE estrutura_de_dado.ed_id=_idEstruturaDeDado) THEN
                BEGIN
                    INSERT INTO `codigo` (`titulo`, `linguagem`,`idUser`,`idEstrutura`) VALUES ('teste', 'C',_idUser,_idEstruturaDeDado);
                    SELECT "Sucesso ao executar" AS reply,true AS success,LAST_INSERT_ID() AS LastID;
                END;
            ELSE
                SELECT "Estrutura de Dados não encontrada" AS reply,true AS success;
            END IF;
        END;
    ELSE
        SELECT "Usuário não encontrado" AS reply,false AS success;
    END IF;
END