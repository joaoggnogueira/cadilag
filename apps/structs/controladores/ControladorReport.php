<?php

namespace controladores;

use PDO;
use config\Database;

/**
 * Controlador representa todas operações relaciona a report
 */
class ControladorReport {

    private $connection;

    public function __construct() {
        try {
            $this->connection = new ReportPDO(
                    'mysql:host=localhost;dbname=' . Database::$mysql_dbname, Database::$mysql_user, Database::$mysql_password
            );
        } catch (PDOException $e) {
            echo '<code>' . $e->getMessage() . '</code>';
            die();
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }

    /**
     * Verifica se o usuário existe no banco de dados
     * @param string $email email do usuário
     * @return integer|boolean retorna o id do usuário usuário caso esteja vinculado no sistema, ou false caso contrário
     */
    public function checkAcess($email) {
        return $this->connection->checkAcess($email);
    }

    /**
     * Insere um novo Report sobre problemas em animações
     * @param string $idEstrutura id na tabela de estruturas de dados
     * @param string $text rótulo do report
     * @param string $json dados sobre o report
     * @return boolean returna se foi possível realizar a operação
     */
    public function insertReport($idEstrutura, $text, $json) {
        try {
            $stmt = $this->connection->insertStmt($idEstrutura, $text, $json);

            return $stmt->execute();
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return false;
    }


}
