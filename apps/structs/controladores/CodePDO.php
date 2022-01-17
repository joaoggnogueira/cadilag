<?php

namespace controladores;

use controladores\PDOCadilag;
use PDO;

/**
 * Armazena e realiza a crição de Statements para CÓDIGOS FONTES
 */
class CodePDO extends PDOCadilag {

    /**
     * Cria uma Statement para inserção de novo código fonte
     * @param integer $idEstruturaDeDados 
     * @param string $title o rótulo do código fonte
     * @param string $language a linguagem do código fonte
     * @param string $jsonAdd os dados do código fonte de inserção
     * @param string $jsonRem os dados do código fonte de remoção
     * @param string $jsonSearch os dados do código fonte de busca
     * @return PDOStatement o statement
     */
    public function insertStmt($idEstruturaDeDados, $title, $language, $jsonAdd, $jsonRem, $jsonSearch) {
        $stmt = $this->prepare(
                'INSERT INTO `codigo` (`titulo`, `linguagem`,`idUser`,`idEstrutura`,`jsonAdd`,`jsonRem`,`jsonSearch`) '
                . 'VALUES (:titulo,:language,:idUser,:idEstrutura,:jsonAdd,:jsonRem,:jsonSearch)');
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        $stmt->bindValue(':idEstrutura', $idEstruturaDeDados, PDO::PARAM_INT);
        $stmt->bindValue(':titulo', $title, PDO::PARAM_STR);
        $stmt->bindValue(':language', $language, PDO::PARAM_STR);
        $stmt->bindValue(':jsonAdd', $jsonAdd, PDO::PARAM_STR);
        $stmt->bindValue(':jsonRem', $jsonRem, PDO::PARAM_STR);
        $stmt->bindValue(':jsonSearch', $jsonSearch, PDO::PARAM_STR);
        return $stmt;
    }

    /**
     * Cria uma Statement para alteração de código fonte
     * @param integer $idCode id na tabela código fonte
     * @param string $title o rótulo do código fonte
     * @param string $language a linguagem do código fonte
     * @param string $jsonAdd os dados do código fonte de inserção
     * @param string $jsonRem os dados do código fonte de remoção
     * @param string $jsonSearch os dados do código fonte de busca
     * @return PDOStatement o statement
     */
    public function updateStmt($idCode, $title, $language, $jsonAdd, $jsonRem, $jsonSearch) {
        if ($title && $language) {
            $stmt = $this->prepare('UPDATE `codigo` SET `titulo` = :titulo, linguagem = :language, `jsonAdd` = :jsonAdd, `jsonRem` = :jsonRem, `jsonSearch` = :jsonSearch, datetime = NOW() '
                    . 'WHERE id = :idCode AND `idUser` = :idUser');
            $stmt->bindValue(':titulo', $title, PDO::PARAM_STR);
            $stmt->bindValue(':language', $language, PDO::PARAM_STR);
        } else {
            $stmt = $this->prepare('UPDATE `codigo` SET `jsonAdd` = :jsonAdd, `jsonRem` = :jsonRem, `jsonSearch` = :jsonSearch, datetime = NOW() '
                    . 'WHERE id = :idCode AND `idUser` = :idUser');
        }
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        $stmt->bindValue(':idCode', $idCode, PDO::PARAM_INT);
        $stmt->bindValue(':jsonAdd', $jsonAdd, PDO::PARAM_STR);
        $stmt->bindValue(':jsonRem', $jsonRem, PDO::PARAM_STR);
        $stmt->bindValue(':jsonSearch', $jsonSearch, PDO::PARAM_STR);
        return $stmt;
    }

    /**
     * Cria uma Statement para recuperar todas as informações do código fonte
     * @param integer $idCode id na tabela código fonte
     * @return PDOStatement o statement
     */
    public function descriptionStmt($idCode) {
        $stmt = $this->prepare("SELECT * FROM codigo WHERE codigo.id = :idCode");
        $stmt->bindValue(':idCode', $idCode, PDO::PARAM_STR);
        return $stmt;
    }

    /**
     * Cria uma Statement para listar os código fonte do usuário
     * @param integer $idEstrutura id na tabela Estruturas de Dados
     * @return PDOStatement o statement
     */
    public function listOwnStmt($idEstrutura) {
        $stmt = $this->prepare('SELECT '
                . 'c.titulo as "rotulo" '
                . ',c.linguagem as "linguagem" '
                . ',c.datetime as "datetime" '
                . ',c.id as "id" '
                . 'FROM codigo c '
                . 'WHERE c.`idUser` = :idUser AND '
                . 'c.`idEstrutura` = :idEstrutura');
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        $stmt->bindValue(':idEstrutura', $idEstrutura, PDO::PARAM_INT);
        return $stmt;
    }
    
    /**
     * Cria uma Statement para listar todas as Estruturas de Dados
     * @return PDOStatement o statement
     */
    public function listEstruturasStmt(){
        $stmt = $this->prepare('SELECT e.ed_id as id,e.ed_nome as nome FROM estrutura_de_dado e');
        return $stmt;
    }

    /**
     * Cria uma Statement para  listar os código fonte do todos os usuários
     * @param integer $idestrutura id na tabela Estruturas de Dados
     * @return PDOStatement o statement
     */
    public function listStmt($idestrutura) {
        $stmt = $this->prepare(
                'SELECT u.usu_fname as "fname"'
                . ',u.usu_lname as "lname"'
                . ',u.usu_nickname as "nickname"'
                . ',u.email as "email" '
                . ',c.idUser as "iduser"'
                . ',c.titulo as "titulo"'
                . ',c.linguagem as "linguagem"'
                . ',c.datetime as "datetime"'
                . ',c.id as "idCode"'
                . 'FROM codigo c '
                . 'INNER JOIN usuario u ON u.usu_id = c.idUser '
                . 'WHERE c.idEstrutura = :idEstrutura');
        $stmt->bindValue(':idEstrutura', $idestrutura, PDO::PARAM_INT);
        return $stmt;
    }

    /**
     * Cria uma Statement para recuperar o código fonte pelo seu id
     * @param integer $idCode id na tabela código fonte
     * @return PDOStatement o statement
     */
    public function codeStmt($idCode) {
        $stmt = $this->prepare('SELECT `jsonAdd` as addCode,`jsonRem` as remCode,`jsonSearch` as searchCode FROM codigo WHERE id = :idCode');
        $stmt->bindValue(':idCode', $idCode, PDO::PARAM_INT);
        return $stmt;
    }

    /**
     * Cria uma Statement para remover o código fonte pelo seu id
     * @param integer $idCode id na tabela código fonte
     * @return PDOStatement o statement
     */
    public function deleteStmt($idCode) {
        $stmt = $this->prepare('DELETE FROM codigo WHERE `idUser` = :idUser AND id = :idCode');
        $stmt->bindValue(':idCode', $idCode, PDO::PARAM_INT);
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        return $stmt;
    }
    
    /**
     * Cria uma Statement para recuperar detalhes sobre o código fonte pelo seu id
     * @param integer $idCode id na tabela código fonte
     * @return PDOStatement o statement
     */
    public function codeDetailStmt($idCode) {
        $stmt = $this->prepare("SELECT idEstrutura as idEstrutura,titulo as title,linguagem as language FROM codigo WHERE codigo.id = :idCode AND codigo.`idUser` = :idUser");
        $stmt->bindValue(':idCode', $idCode, PDO::PARAM_INT);
        $stmt->bindValue(':idUser', $this->idUser, PDO::PARAM_INT);
        return $stmt;
    }

}
