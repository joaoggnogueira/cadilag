<?php

/**
 * Representa um usuário Aluno e todas as suas operações, também pode ser utilizada como Entidade
 */
class Aluno extends ControladorUsuario {

    public function __construct($email) {
        parent::__construct();
        parent::setUser($email);
    }

    /**
     * Desnvincula o aluno de sua Turma
     * @return boolean retorna se a operação foi realizada com sucesso no banco de dados
     */
    public function desvincularTurma() {
        $connection = parent::getConnection();
        $ID = (int) parent::getUserId();
        try {
            $stmt = $connection->prepare('UPDATE aluno SET idTurma=NULL WHERE alu_id=:iduser');
            $stmt->bindValue(':iduser', $ID, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }

        return false;
    }
    
    /**
     * Lista Arquivos do aluno para uma atividade
     * @param integer $idatv id na tabela atividade
     * @return boolean|\Arquivo Array de Objetos com informações do Arquivo de Atividade ou false em caso de falha no banco
     */
    public function listarArquivosDaAtividade($idatv) {
        try {
            $connection = parent::getConnection();
            $stmt = $connection->prepare('SELECT arquivo.*,file.name as filename FROM arquivo,file WHERE file.id = arquivo.id_file AND arquivo.idatividade=:idatv AND arquivo.idusuario=:iduser ORDER BY arq_id DESC');
            $ID = (int) parent::getUserId();
            $stmt->bindParam(':iduser', $ID, PDO::PARAM_INT);
            $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);

            if($stmt->execute()) {
                $lista = array();

                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new Arquivo($result);
                }
                return $lista;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }

        return false;
    }

    /**
     * Cria uma solicitação para o aluno se vincular a uma turma
     * @param integer $idturma id na tabela turma
     * @return boolean se a operação foi realizada com sucesso no banco de dados
     */
    public function solicitarEntradaEmTurma($idturma) {
        $connection = parent::getConnection();
        $ID = (int) parent::getUserId();
        try {
            $stmt = $connection->prepare('insert into solicitacao(Aluno_alu_id,Turma_idTurma) values (:iduser,:idturma)');
            $stmt->bindValue(':iduser', $ID, PDO::PARAM_INT);
            $stmt->bindValue(':idturma', $idturma, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }

        return false;
    }

    /**
     * Remove a solicitação do aluno para uma turma qualquer
     * @return integer|boolean o id da solicitação removida, ou false caso ocorra alguma falha no banco
     */
    public function cancelarSolicitacao() {
        $solicitacao = $this->getSolicitacao();
        if ($solicitacao) {
            $id = (int) $solicitacao['id'];
            $connection = parent::getConnection();
            try {
                $stmt = $connection->prepare('DELETE FROM solicitacao WHERE solicitacao.idsolicitacao=:id;');
                $stmt->bindValue(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
                return $id;
            } catch (PDOException $e) {
                echo $e->getMessage();
            }
        }

        return false;
    }

    /**
     * Recupera detalhes sobre a solicitação e turma, disciplina, curso e institição da mesma em um Array<br/><br/>
     * <ul>
        * <li>'disciplina_nome' => nome da disciplina<vli>
        * <li>'instituicao_nome' => nome da instituição</li>
        * <li>'instituicao_uf' => sigla do estado da instituição</li>
        * <li>'curso_nome' => nome da disciplina</li>
        * <li>'curso_sigla' => sigla do curso</li>
        * <li>'semestre' => semestre da turma</li>
        * <li>'ano' => ano da turma</li>
        * <li>'id' => id da solicitação</li>
     * </ul>
     * @return array(string) Array com as informações ou false em caso de falha no banco</br></br></br>
     */
    public function getSolicitacao() {
        $connection = parent::getConnection();
        $ID = (int) parent::getUserId();
        try {
            $stmt = $connection->prepare('select * from instituicao,curso,disciplina,turma,solicitacao  WHERE disciplina.disc_id=turma.disc_id AND turma.idTurma=solicitacao.Turma_idTurma AND solicitacao.Aluno_alu_id=:iduser AND curso.cur_id=disciplina.cur_id AND instituicao.inst_id=curso.inst_id');
            $stmt->bindValue(':iduser', $ID, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                return array(
                    'disciplina_nome' => $result['disc_nome'],
                    'instituicao_nome' => $result['inst_nome'],
                    'instituicao_uf' => $result['inst_uf'],
                    'curso_nome' => $result['cur_nome'],
                    'curso_sigla' => $result['cur_sigla'],
                    'semestre' => $result['tur_semestre'],
                    'ano' => $result['tur_ano'],
                    'id' => $result['idsolicitacao']);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }

        return false;
    }

    /**
     * Recupera informações da Turma no qual o Aluno está vinculado
     * @return \Turma Objeto com as informações da Turma
     */
    public function getTurma() {
        $connection = parent::getConnection();
        $ID = (int) parent::getUserId();
        $stmt = $connection->prepare(
                'SELECT t.*,f.name as filename '
                . 'FROM turma t '
                . 'LEFT JOIN file f ON f.id = t.id_file_plano_de_ensino '
                . 'WHERE `idTurma` = ( Select `idTurma` from aluno where alu_id = :id )');
        $stmt->bindValue(':id', $ID, PDO::PARAM_INT);
        $execute = $stmt->execute();
        if ($execute) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                return new Turma($result);
            }
        }
        return false;

    }

    /**
     * Verifica se o Aluno possui acesso ao material didático, ou seja, se ele está vinculado com a turma<br/>
     * no qual pertence o material didático
     * @param integer $idmaterial o id na tabela Material Didático
     * @return boolean retorna se o aluno possui acesso
     */
    public function checkAcessToMaterial($idmaterial) {
        $connection = parent::getConnection();
        $iduser = (int) parent::getUserId();
        $stmt = $connection->prepare(
                'SELECT * FROM turma '
                . 'WHERE `idTurma` = ( Select `idTurma` from aluno where alu_id =:iduser ) '
                . 'AND idTurma = ( Select `idTurma` from materialdidatico where `idMaterialDidatico` =:idfile )');
        $stmt->bindValue(':iduser', $iduser, PDO::PARAM_INT);
        $stmt->bindValue(':idfile', $idmaterial, PDO::PARAM_INT);
        return $stmt->execute() && $stmt->rowCount() == 1;
    }

    /**
     * Recupera o arquivo do Material Didático se o Aluno possuir acesso
     * @param integer $idmaterial o id na tabela Material Didático
     * @return BinaryFile O Arquivo do material didático
     */
    public function getBlobMaterial($idmaterial) {
        if ($this->checkAcessToMaterial($idmaterial)) {
            return parent::getBlobContentMaterial($idmaterial);
        }
        return false;
    }

    /**
     * Recupera o detalhes sobre o Material Didático se o Aluno possuir acesso<br/>
     * <b> SOBRESCREVE MÉTODO DO CONTROLADOR USUÁRIO </b>
     * @param integer $idmaterial o id na tabela Material Didático
     * @return MaterialDidatico O Objeto com deltahes do Material Didático 
     * 
     */
    public function getMaterialDidatico($idmaterial) {
        if ($this->checkAcessToMaterial($idmaterial)) {
            return parent::getMaterialDidatico($idmaterial);
        }
        return false;
    }
    
    /**
     * Verifica se o Aluno possui acesso ao arquivo de Atividade, ou seja, se ele for o dono,<br/>
     *  ou o arquivo for do professor da sua Turma
     * @param integer $idfile o id do Arquivo de Atividade
     * @return boolean retorna se o aluno possui acesso
     */
    public function checkAcessToArquivo($idfile) {
        $connection = parent::getConnection();
        $iduser = (int) parent::getUserId();
        $stmt = $connection->prepare(
                'SELECT * FROM turma '
                . 'WHERE `idTurma` = ( Select `idTurma` from aluno where alu_id =:iduser ) '
                . 'AND idTurma = ( Select `idTurma` from arquivo arq INNER JOIN atividade atv ON arq.idatividade=atv.atv_id where arq.arq_id =:idfile '
                . 'and (arq.idusuario=:iduser '
                . 'OR arq.idusuario='
                . '(SELECT tur1.prof_id '
                . 'FROM arquivo arq1 '
                . 'INNER JOIN atividade atv1 ON atv1.atv_id=arq1.idatividade '
                . 'INNER JOIN turma tur1 ON tur1.idTurma=atv1.idTurma WHERE arq1.arq_id=:idfile)))');
        $stmt->bindValue(':iduser', $iduser, PDO::PARAM_INT);
        $stmt->bindValue(':idfile', $idfile, PDO::PARAM_INT);
        return $stmt->execute() && $stmt->rowCount() == 1;
    }
    
    /**
     * Verifica se o usuário tem acesso a turma
     * @param integer $idatividade id na tabela atividade
     * @return boolean se possui acesso
     */
    public function checkAcessToUpload($idatividade){
        $connection = parent::getConnection();
        $id = (int) parent::getUserId();
        $stmt = $connection->prepare(
                'SELECT * FROM turma t '
                . 'WHERE t.idTurma=(SELECT idTurma FROM atividade atv WHERE atv.atv_id=:idatv) AND '
                . 't.idTurma=(SELECT idTurma FROM aluno a WHERE a.alu_id=:iduser)');
        $stmt->bindParam(':iduser', $id, PDO::PARAM_INT);
        $stmt->bindParam(':idatv', $idatividade, PDO::PARAM_INT);
        return $stmt->execute() && $stmt->rowCount() == 1;
    }
    
    /**
     * Verifica se o usuário tem acesso a turma e insere novo Arquivo de Atividade
     * @param array $file arquivo resultado do upload no servidor
     * @param integer $idatividade id na tabela atividade
     * @return boolean retorna se foi possível realizar a operação no banco de dados
     */
    public function novoArquivo($file, $idatividade) {
        $connection = parent::getConnection();
        $id = (int) parent::getUserId();
        try {
            $connection->beginTransaction();
            $fileName = $file['name'];
            $tmpName = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileType = $file['type'];

            $content = file_get_contents($tmpName);
            $stmt = $connection->prepare('INSERT INTO file(name,size,type,content) VALUES (:name,:size,:type,:content)');
            $stmt->bindParam(':name', $fileName, PDO::PARAM_STR);
            $stmt->bindParam(':size', $fileSize, PDO::PARAM_STR);
            $stmt->bindParam(':type', $fileType, PDO::PARAM_STR);
            $stmt->bindParam(':content', $content, PDO::PARAM_LOB);
            if ($stmt->execute()) {
                $lastfileid = (int) $connection->lastInsertId();
                $stmt = $connection->prepare('INSERT INTO arquivo (idusuario,idatividade,id_file,data,hora) VALUES (:iduser,:idatv,:idfile,current_date(),current_time())');
                $stmt->bindParam(':iduser', $id, PDO::PARAM_INT);
                $stmt->bindParam(':idatv', $idatividade, PDO::PARAM_INT);
                $stmt->bindParam(':idfile', $lastfileid, PDO::PARAM_INT);
                if ($stmt->execute()) {
                    $id = (int) $connection->lastInsertId();
                    $connection->commit();
                    return parent::getArquivo($id);
                } else {
                    parent::rollback();
                }
            } else {
                parent::rollback();
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
            parent::rollback();
        }
        return false;
    }

    /**
     * Recupera o Arquivo de Atividade
     * @param integer $idatividade id na tabela atividade
     * @return BinaryFile Objeto com arquivo da atividade
     */
    public function getBlobArquivoAtividade($idatividade) {
        if ($this->checkAcessToArquivo($idatividade)) {
            return parent::getBlobContentArquivoAtividade($idatividade);
        }
        return false;
    }

}
