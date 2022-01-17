<?php

namespace controladores;

use controladores\PDOCadilag;
use PDO;

/**
 * Armazena e realiza a crição de Statements para ENTRADAS PROGRAMADAS
 */
class EpPDO extends PDOCadilag {

    /**
     * Cria uma Statement para recuperar dados da entrada programada
     * @param integer $idEp id na tabela de Entrada Programada
     * @return PDOStatement o statement
     */
    public function getJsonStmt($idEp) {
        $stmt = $this->prepare('SELECT descricao,json,Estrutura_De_Dado_ed_id,Usuario_usu_id ' .
                        'FROM entradaprogramada ' .
                        'WHERE `idEntradaProgramada` = :idEp');
        $stmt->bindValue(':idEp', $idEp, PDO::PARAM_INT);
        return $stmt;
    }

    /**
     * Cria uma Statement para inserir uma nova entrada programada
     * @param integer $idEstrutura id na tabela de estrutura de dado
     * @param string $rotulo rótulo da entrada programada
     * @param integer $totalEp total de entradas 
     * @param string $json dados da entrada programada
     * @return PDOStatement o statement
     */
    public function insertStmt($idEstrutura, $rotulo, $totalEp, $json) {
        $stmt = $this->prepare(
                        'INSERT INTO entradaprogramada(`Usuario_usu_id`,`Estrutura_De_Dado_ed_id`,descricao,totalep,json,`data`,hora) '
                        . 'VALUES (:iduser,:idestrutura,:rotulo,:total,:json,current_date(),current_time())');
        $stmt->bindParam(':iduser', $this->idUser, PDO::PARAM_INT);
        $stmt->bindParam(':idestrutura', $idEstrutura, PDO::PARAM_INT);
        $stmt->bindParam(':rotulo', $rotulo, PDO::PARAM_STR);
        $stmt->bindParam(':total', $totalEp, PDO::PARAM_INT);
        $stmt->bindParam(':json', $json, PDO::PARAM_STR);
        return $stmt;
    }
    
    /**
     * Cria uma Statement para listar todas as entradas programadas de outros usuários
     * @param integer $idEstrutura id na tabela de estrutura de dado
     * @return PDOStatement o statement
     */
    public function listaOthersEpStmt($idEstrutura){
        $stmt = $this->prepare('SELECT ' .
                        'e.idEntradaProgramada as id, ' .
                        'e.descricao as rotulo, ' .
                        'DATE_FORMAT(e.data, "%d/%m/%Y") as data, ' .
                        'e.hora as hora, ' .
                        'e.totalep as total, ' .
                        'u.usu_fname as fname, ' .
                        'u.usu_lname as lname, ' .
                        'u.usu_nickname as nickname, ' .
                        'u.email as email ' .
                        'FROM entradaprogramada e ' .
                        'INNER JOIN usuario u ON u.usu_id = e.`Usuario_usu_id` ' .
                        'WHERE e.`Usuario_usu_id` <> :idUser ' .
                        'AND e.`Estrutura_De_Dado_ed_id` = :idStruct ');
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        $stmt->bindValue(':idStruct', $idEstrutura, PDO::PARAM_INT);
        return $stmt;
    }

    /**
     * Cria uma Statement para listar todas as entradas programadas do usuário
     * @param integer $idEstrutura id na tabela de estrutura de dado
     * @return PDOStatement o statement
     */
    public function listaStmt($idEstrutura) {
        $stmt = $this->prepare('SELECT ' .
                        'idEntradaProgramada as id, ' .
                        'descricao as rotulo, ' .
                        'DATE_FORMAT(data, "%d/%m/%Y") as data, ' .
                        'hora as hora, ' .
                        'totalep as total ' .
                        'FROM entradaprogramada ' .
                        'WHERE `Usuario_usu_id` = :idUser' .
                        ' AND `Estrutura_De_Dado_ed_id` = :idStruct');
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        $stmt->bindValue(':idStruct', $idEstrutura, PDO::PARAM_INT);
        return $stmt;
    }

    /**
     * Cria uma Statement para remover a entrada programada
     * @param integer $idEp id na tabela de Entrada Programada
     * @return PDOStatement o statement
     */
    public function deleteStmt($idEp) {
        $stmt = $this->prepare('DELETE FROM entradaprogramada' .
                        ' WHERE `Usuario_usu_id` = :idUser' .
                        ' AND `idEntradaProgramada` = :idEp');
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        $stmt->bindValue(':idEp', $idEp, PDO::PARAM_INT);
        return $stmt;
    }

    /**
     * Cria uma Statement para obter detalhes sobre a entrada programada
     * @param integer $idEp id na tabela de Entrada Programada
     * @return PDOStatement o statement
     */
    public function descriptionStmt($idEp) {
        $stmt = $this->prepare('SELECT ' .
                        'descricao as rotulo, ' .
                        'DATE_FORMAT(data, "%d/%m/%Y") as data, ' .
                        'hora as hora ' .
                        'FROM entradaprogramada ' .
                        'WHERE `Usuario_usu_id` = :idUser ' .
                        'AND `idEntradaProgramada` = :idEp');
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        $stmt->bindValue(':idEp', $idEp, PDO::PARAM_INT);
        return $stmt;
    }

    /**
     * Cria uma Statement para atualizar as entradas programadas
     * @param string $rotulo rótulo da entrada programada
     * @param integer $idEp id na tabela de Entrada Programada
     * @param integer $total total de entradas 
     * @param string $json dados da entrada programada
     * @return PDOStatement o statement
     */
    public function updateStmt($rotulo, $idEp, $total, $json) {
        $stmt = $this->prepare('UPDATE entradaprogramada SET '
                        . 'descricao = :rotulo,json = :json , totalep = :total, '
                        . 'hora = current_time(),`data` = current_date() '
                        . 'WHERE `idEntradaProgramada` = :idep AND `Usuario_usu_id` = :usuid');
        $stmt->bindValue(':rotulo', $rotulo, PDO::PARAM_STR);
        $stmt->bindValue(':idep', $idEp, PDO::PARAM_INT);
        $stmt->bindValue(':usuid', $this->idUser, PDO::PARAM_INT);
        $stmt->bindValue(':total', $total, PDO::PARAM_INT);
        $stmt->bindValue(':json', $json, PDO::PARAM_STR);
        return $stmt;
    }

}
