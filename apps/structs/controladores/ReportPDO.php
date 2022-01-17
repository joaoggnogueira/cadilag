<?php

namespace controladores;

use controladores\PDOCadilag;
use PDO;

/**
 * Armazena e realiza a crição de Statements para REPORT
 */
class ReportPDO extends PDOCadilag {
    
    /**
     * Cria uma Statement para inserir um novo report
     * @param integer $idCode id na tabela código fonte
     * @return PDOStatement o statement
     */
    public function insertStmt($idEstrutura,$text, $history) {
        $stmt = $this->prepare('INSERT INTO report(text,history,id_estrutura,datetime) VALUES (:text,:history,:idEstrutura,NOW())');
        $stmt->bindParam(':text', $text, PDO::PARAM_STR);
        $stmt->bindParam(':history', $history, PDO::PARAM_STR);
        $stmt->bindParam(':idEstrutura', $idEstrutura, PDO::PARAM_INT);
        return $stmt;
    }

}
