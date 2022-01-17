<?php

/**
 * Representa um usuário Professor e todas as suas operações, também pode ser utilizada como Entidade
 */
class Professor extends ControladorUsuario {

    public function __construct($email) {
        parent::__construct();
        parent::setUser($email);
    }
    
    /**
     * Verifica se o Professor possui permissão para administrar turmas
     * @return boolean
     */
    public function possuiAcesso() {
        $iduser = parent::getUserId();
        try {
            $stmt = parent::getConnection()->prepare('SELECT prof_confirmado FROM professor WHERE prof_id=:iduser');
            $stmt->bindParam(':iduser', $iduser, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['prof_confirmado'] === '1';
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera uma Turma administrada pelo Professor na posição $index
     * @param type $index a posição da turma entre as outras que o professor administra
     * @return \Turma
     */
    public function getTurmaByIndex($index) {

        $iduser = (int) parent::getUserId();
        $indexini = (int) $index;
        $indexfim = $indexini + 1;
        try {
            $stmt = parent::getConnection()->prepare(''
                    . 'SELECT t.*,f.name AS filename FROM turma t '
                    . 'LEFT JOIN file f ON f.id = t.id_file_plano_de_ensino '
                    . 'WHERE prof_id = :iduser '
                    . 'LIMIT :indexini,:indexfim');

            $stmt->bindParam(':iduser', $iduser, PDO::PARAM_INT);
            $stmt->bindParam(':indexini', $indexini, PDO::PARAM_INT);
            $stmt->bindParam(':indexfim', $indexfim, PDO::PARAM_INT);
            if($stmt->execute()){
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return new Turma($result);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    /**
     * Recupera o total de turmas que o professor possui
     * @return integer o total, ou false caso ocorra alguma falha do banco de dados
     */
    public function getTotalTurmas() {
        $iduser = parent::getUserId();
        try {
            $stmt = parent::getConnection()->prepare('SELECT COUNT(t.idTurma) AS total FROM turma t WHERE t.prof_id=:iduser');
            $stmt->bindParam(':iduser', $iduser, PDO::PARAM_INT);
            $stmt->execute();
            $fetch = $stmt->fetch(PDO::FETCH_ASSOC);
            return $fetch['total'];
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    /**
     * Recupera uma lista com informações de Turmas no qual o professor administra
     * @return array(Turma) Array de Objeto com informações das Turmas 
     */
    public function getTurmas() {

        $iduser = parent::getUserId();

        try {
            $stmt = parent::getConnection()->prepare('SELECT * FROM turma WHERE prof_id=:iduser');
            $stmt->bindParam(':iduser', $iduser, PDO::PARAM_INT);
            $stmt->execute();

            $lista = array();
            while ($turma = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $lista[] = new Turma($turma);
            }
            return $lista;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o total de solicitações para solicitações para turmas no qual o professor administra
     * @return integer total ou false caso o banco de de dado falhar
     */
    public function getTotalSolicitacoes() {
        $iduser = parent::getUserId();
        try {
            $stmt = parent::getConnection()->prepare('SELECT COUNT(idsolicitacao) AS total FROM solicitacao,turma WHERE turma.`idTurma`=solicitacao.`Turma_idTurma` AND turma.prof_id=:iduser');
            $stmt->bindParam(':iduser', $iduser, PDO::PARAM_INT);
            $stmt->execute();
            $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
            return (int) $fecth['total'];
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Cria uma nova Instituição 
     * @param string $nome Nome da Instituição
     * @param string $uf Sigla do Estado da Instituição
     * @return integer retorna o id da nova instituição na tabela, ou false caso ocorra alguma falha no banco de dados
     */
    public function novaInstituicao($nome, $uf) {

        try {
            $db = parent::getConnection();
            $db->beginTransaction();
            $stmt = $db->prepare('INSERT INTO instituicao(inst_nome,inst_uf) VALUES (:nome,:uf)');
            $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
            $stmt->bindParam(':uf', $uf, PDO::PARAM_STR);
            if ($stmt->execute()) {
                $lastId = $db->lastInsertId();
                $db->commit();
                return $lastId;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            $this->connection->rollBack();
        }
        return false;
    }

    /**
     * Cria um novo Curso para uma instituição
     * @param string $nome o nome do curso
     * @param string $sigla a sigla do curso (código no sistema da instituição)
     * @param integer $idinst id na tabela instituição, sendo o id instituição no qual o curso pertence
     * @return integer retorna o ID do curso criado, ou false caso ocorra alguma falha no banco de dados
     */
    public function novoCurso($nome, $sigla, $idinst) {
        try {
            $db = parent::getConnection();
            $db->beginTransaction();
            $stmt = $db->prepare('INSERT INTO curso(cur_nome,cur_sigla,inst_id) VALUES (:nome,:sigla,:id)');
            $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
            $stmt->bindParam(':sigla', $sigla, PDO::PARAM_STR);
            $stmt->bindParam(':id', $idinst, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lastId = $db->lastInsertId();
                $db->commit();
                return $lastId;
            } else {
                parent::rollback();
            }
        } catch (PDOException $e) {
            parent::rollback();
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Cria uma nova disciplina para um curso
     * @param string $nome o nome da DISCIPLINA
     * @param integer $idcurso o id na tabela do CURSO, no qual a disciplina pertence
     * @return integer O id da disciplina criada ou false caso ocorra alguma falha no banco de dados
     */
    public function novaDisciplina($nome, $idcurso) {
        $db = parent::getConnection();
        try {
            $db->beginTransaction();
            $stmt = $db->prepare('INSERT INTO disciplina(disc_nome,cur_id) VALUES (:nome,:id)');
            $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
            $stmt->bindParam(':id', $idcurso, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lastId = $db->lastInsertId();
                $db->commit();
                return $lastId;
            } else {
                parent::rollback();
            }
        } catch (PDOException $e) {
            parent::rollback();
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Cria uma nova Turma
     * @param integer $ano ano de realização
     * @param integer $semestre semestre de realização (1 ou 2)
     * @param integer $iddisc id na tabela disciplina, no qual pertence a turma
     * @return integer retorna o id da turma criada ou false caso ocorra alguma falha no banco de dados
     */
    public function novaTurma($ano, $semestre, $iddisc) {
        $iduser = (int) parent::getUserId();
        try {
            parent::getConnection()->beginTransaction();
            $stmt = parent::getConnection()->prepare('INSERT INTO turma(tur_ano,tur_semestre,prof_id,disc_id) VALUES (:ano,:semestre,:idprof,:iddisc)');
            $stmt->bindParam(':ano', $ano, PDO::PARAM_INT);
            $stmt->bindParam(':semestre', $semestre, PDO::PARAM_INT);
            $stmt->bindParam(':idprof', $iduser, PDO::PARAM_INT);
            $stmt->bindParam(':iddisc', $iddisc, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lastid = (int) parent::getConnection()->lastInsertId();
                parent::getConnection()->commit();
                return $lastid;
            } else {
                parent::rollback();
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            parent::rollback();
        }
        return false;
    }

    /**
     * Responde a solicitação de entrada para a turma
     * @param integer $id id na tabela solicitação
     * @param boolean $resposta Representa a resposta, true se aceita ou false se recusa
     * @return boolean retorna se foi possível realizar a operação
     */
    public function responderSolicitacao($id, $resposta) {
        $iduser = (int) parent::getUserId();
        try {
            $stmtQuery = parent::getConnection()->prepare("SELECT * FROM turma t WHERE t.prof_id=:idprof AND t.idTurma=(select solicitacao.Turma_idTurma FROM solicitacao WHERE solicitacao.idsolicitacao=:id)");
            $stmtQuery->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtQuery->bindParam(':idprof', $iduser, PDO::PARAM_INT);
            $stmtQuery->execute();
            if ($stmtQuery->execute() && $stmtQuery->rowCount() == 1) {
                parent::getConnection()->beginTransaction();
                if ($resposta) {
                    $stmtUpdate = parent::getConnection()->prepare("UPDATE aluno set aluno.idTurma=(select solicitacao.Turma_idTurma FROM solicitacao WHERE solicitacao.idsolicitacao=:id) "
                            . "WHERE aluno.alu_id=(select solicitacao.Aluno_alu_id FROM solicitacao WHERE solicitacao.idsolicitacao=:id)");
                    $stmtUpdate->bindParam(':id', $id, PDO::PARAM_INT);
                    $continue = $stmtUpdate->execute();
                } else {
                    $continue = true;
                }
                if ($continue) {
                    $stmtDelete = parent::getConnection()->prepare("DELETE FROM solicitacao WHERE idsolicitacao=:id");
                    $stmtDelete->bindParam(':id', $id, PDO::PARAM_INT);
                    if ($stmtDelete->execute()) {
                        return parent::getConnection()->commit();
                    } else {
                        parent::rollback();
                    }
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            parent::rollback();
        }
        return false;
    }

    /**
     * Verifica se o professor tem acesso ao material didático,<br/>
     * Ou seja, verifica se o material pertence a turma do professor
     * @param integer $idfile id na tabela material didático
     * @return boolean retorna true se possui acesso ou false caso contrário, ou caso falhar a operação no banco de dados
     */
    public function checkAcessToMaterial($idfile) {
        $connection = parent::getConnection();
        $iduser = (int) parent::getUserId();
        $stmt = $connection->prepare(
                'SELECT * FROM materialdidatico m '
                . 'INNER JOIN turma t ON m.`Turma_idTurma`=t.`idTurma` '
                . 'WHERE m.`idMaterialDidatico`=:idfile AND '
                . 't.prof_id=:iduser');
        $stmt->bindValue(':iduser', $iduser, PDO::PARAM_INT);
        $stmt->bindValue(':idfile', $idfile, PDO::PARAM_INT);
        return $stmt->execute() && $stmt->rowCount() == 1;
    }

    /**
     * Remove o material didático, se o Professor for o autor
     * @param integer $id id na tabela material didático
     * @return boolean se a operação foi realizada com sucesso
     */
    public function deletarMaterial($id) {
        $iduser = (int) parent::getUserId();
        $connection = parent::getConnection();
        try {

            $stmtSELECT = $connection->prepare('SELECT m.id_file AS id_file FROM materialdidatico m '
                    . 'INNER JOIN turma t ON t.`idTurma` = m.`Turma_idTurma` '
                    . 'WHERE m.`idMaterialDidatico`=:id AND t.prof_id=:idprof');

            $stmtSELECT->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtSELECT->bindParam(':idprof', $iduser, PDO::PARAM_INT);

            if ($stmtSELECT->execute() && $stmtSELECT->rowCount() == 1) {

                $fetch = $stmtSELECT->fetch(PDO::FETCH_ASSOC);
                $idfile = $fetch["id_file"];

                $connection->beginTransaction();

                $stmt = $connection->prepare('DELETE FROM materialdidatico WHERE `idMaterialDidatico`=:id');
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);

                if ($stmt->execute()) {

                    $stmt = $connection->prepare('DELETE FROM file WHERE id = :idfile');
                    $stmt->bindParam(':idfile', $idfile, PDO::PARAM_INT);

                    if ($stmt->execute()) {
                        return $connection->commit();
                    } else {
                        $connection->rollBack();
                    }
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            if ($connection->inTransaction()) {
                $connection->rollBack();
            }
        }
        return false;
    }

    /**
     * Recupera o Arquivo Binário do Material Didático
     * @param integer $idmaterial id na tabela material didático
     * @return BinaryFile o arquivo binário, ou false, caso o usuário não tenha acesso, ou ocorra alguma falha no banco de dados
     */
    public function getBlobMaterial($idmaterial) {
        if ($this->checkAcessToMaterial($idmaterial)) {
            return parent::getBlobContentMaterial($idmaterial);
        }
        return false;
    }
    
    /**
     * Recupera Informações do Material Didático
     * @param integer $idmaterial id na tabela material didático
     * @return MaterialDidatico o Objeto com as informações do Material Didático ou false, caso o usuário não tenha acesso, ou ocorra alguma falha no banco de dados
     */
    public function getMaterialDidatico($idmaterial) {
        if ($this->checkAcessToMaterial($idmaterial)) {
            return parent::getMaterialDidatico($idmaterial);
        }
        return false;
    }

    /**
     * Verifica se o professor tem acesso ao arquvio de atividade,<br/>
     * Ou seja, verifica se a atividade pertence a turma do professor
     * @param integer $idfile id na tabela arquivo
     * @return boolean retorna true se possui acesso ou false caso contrário, ou caso falhar a operação no banco de dados
     */
    public function checkAcessToArquivo($idfile) {
        $connection = parent::getConnection();
        $iduser = (int) parent::getUserId();
        $stmt = $connection->prepare(
                'SELECT * FROM arquivo a '
                . 'INNER JOIN atividade atv ON atv.atv_id = a.idatividade '
                . 'INNER JOIN turma t ON atv.idTurma = t.`idTurma` '
                . 'WHERE a.arq_id = :idfile AND '
                . 't.prof_id = :iduser');
        $stmt->bindValue(':iduser', $iduser, PDO::PARAM_INT);
        $stmt->bindValue(':idfile', $idfile, PDO::PARAM_INT);
        return $stmt->execute() && $stmt->rowCount() == 1;
    }

   /**
    * Insere um novo arquivo de atividade, caso o professor for o autor
    * @param array $file array com informações o arquivo de upload
    * @param integer $idatividade id na tabela atividade
    * @return Arquivo retorna o Objeto com as informações do Arquivo de Atividade, ou false em caso de falha no banco de dados
    */ 
    public function novoArquivo($file, $idatividade) {
        $connection = parent::getConnection();
        $id = (int) parent::getUserId();
        try {
            $stmt = $connection->prepare(
                    'SELECT * FROM atividade a '
                    . 'INNER JOIN turma t ON t.idTurma = a.idTurma '
                    . 'WHERE t.prof_id=:iduser AND a.atv_id=:idatv');
            $stmt->bindParam(':iduser', $id, PDO::PARAM_INT);
            $stmt->bindParam(':idatv', $idatividade, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
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
                //$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
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
                        $connection->rollBack();
                    }
                } else {
//                    print_r($stmt->errorInfo());
                }
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
            if ($connection->inTransaction()) {
                $connection->rollBack();
            }
        }
        return false;
    }

    /**
     * Recupera o arquivo binário, do arquivo de atividade
     * @param integer $id id na tabela arquivo de atividade
     * @return BinaryFile o Arquivo Binário, ou false, em caso de falha no banco de dados, ou o usuário não possui acesso ao arquivo
     */
    public function getBlobArquivoAtividade($id) {
        if ($this->checkAcessToArquivo($id)) {
            return parent::getBlobContentArquivoAtividade($id);
        } else {
            return false;
        }
    }

    /**
     * Remove todos os arquivos vinculados a uma atividade
     * @param integer $id id da atividade
     * @return boolean se foi possível de realizar a operação
     */
    public function deleteArquivosAtividade($id) {
        $iduser = (int) parent::getUserId();
        try {
            
            $stmt = parent::getConnection()->prepare('SELECT ar.id_file,ar.arq_id FROM arquivo ar '
                    . 'INNER JOIN atividade a ON ar.idatividade = a.atv_id '
                    . 'INNER JOIN turma t ON t.`idTurma` = a.`idTurma` '
                    . 'WHERE ar.idatividade=:idatv AND t.prof_id=:idprof');
            $stmt->bindParam(':idatv', $id, PDO::PARAM_INT);
            $stmt->bindParam(':idprof', $iduser, PDO::PARAM_INT);
            if($stmt->execute()){
                parent::getConnection()->beginTransaction();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $stmtArq = parent::getConnection()->prepare('DELETE FROM arquivo WHERE arq_id=:idarq');
                    $stmtArq->bindParam(':idarq', $result['arq_id'], PDO::PARAM_INT);

                    if(!$stmtArq->execute()) {
                        parent::getConnection()->rollBack();
                        return false;
                    }

                    $stmtFile = parent::getConnection()->prepare('DELETE FROM `file` WHERE id=:idfile');
                    $stmtFile->bindParam(':idfile', $result['id_file'], PDO::PARAM_INT);
                    
                    if(!$stmtFile->execute()) {
                        parent::getConnection()->rollBack();
                        return false;
                    }
                }
                return parent::getConnection()->commit();
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            if(parent::getConnection()->inTransaction()){
                parent::getConnection()->rollBack();
            }
        }
        return false;
    }

    /**
     * Remove uma atividade (observação, ou arquivos devem ser removido primeiro)
     * @param integer $idatv id na tabela atividade
     * @return boolean representa se foi possível realizar a operação no banco de dados
     */
    public function deleteAtividade($idatv) {
        $iduser = (int) parent::getUserId();
        try {
            $stmt = parent::getConnection()->prepare('SELECT a.* FROM atividade a '
                    . 'INNER JOIN turma t ON t.`idTurma`=a.`idTurma` '
                    . 'WHERE a.atv_id=:idatv AND t.prof_id=:idprof');
            $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);
            $stmt->bindParam(':idprof', $iduser, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $stmt = parent::getConnection()->prepare('DELETE FROM atividade WHERE `atv_id`=:idatv');
                $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);
                return $stmt->execute();
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

}
