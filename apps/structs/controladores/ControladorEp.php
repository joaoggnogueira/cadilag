<?php

namespace controladores;

use PDO;
use config\Database;
use entidades\EntradaProgramada;

/**
 * Controlador representa todas operações relaciona as entradas programadas
 */
class ControladorEp {

    private $connection;

    public function __construct() {
        try {
            $this->connection = new EpPDO(
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
     * Recupera as entradas programadas e outros detalhes apartir do ID no banco de dados, em um array com:
     * <ul>
     * <li>['iduser' => id do usuário autor]</li>
     * <li>['rotulo' => rótulo das entradas programadas]</li>
     * <li>['json' => dados da entradas programadas]</li>
     * <li>['idEstrutura' => id na tabela Estrutura de Dados]</li>
     * </ul>
     * @param integer $idEp id na tabela Entradas Programadas
     * @return array|boolean um array com as informações ou false caso ocorra alguma falha no banco de dados
     */
    public function getJSON($idEp) {
        try {
            $stmt = $this->connection->getJsonStmt($idEp);
            $resultPDO = $stmt->execute();
            if ($resultPDO && $stmt->rowCount() == 1) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return array("iduser" => $result['Usuario_usu_id'],"rotulo" => $result['descricao'], "json" => $result['json'], "idEstrutura" => $result['Estrutura_De_Dado_ed_id']);
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Atualiza a Entrada Programada, e retorna array com informações atualizadas
     * <ul>
     * <li>['rotulo' => texto do rotulo filtrado]</li>
     * <li>['data' => data de revisão]</li>
     * <li>['hora' => hora de revisão]</li>
     * </ul>
     * @param string $rotulo rótulo do Entrada Programada
     * @param integer $id_ep id na tabela Entrada Programada
     * @param integer $total total de entradas Programadas
     * @param string $json dados da Entrada Programada
     * @return array|boolean um array com as informações ou false caso ocorra alguma falha no banco de dados
     */
    public function updateEP($rotulo, $id_ep, $total, $json) {
        try {
            $stmt = $this->connection->updateStmt($rotulo, $id_ep, $total, $json);
            if ($stmt->execute()) {
                $stmt = $this->connection->descriptionStmt($id_ep);
                if ($stmt->execute()) {
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    return array("rotulo" => $result['rotulo'], "data" => $result['data'], "hora" => $result['hora']);
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    /**
     * Salva uma nova entrada programada
     * @param string $rotulo rótulo do Entrada Programada
     * @param integer $idEstrutura id na tabela Entrada Programada
     * @param integer $totalEp total de entradas Programadas
     * @param string $json dados da Entrada Programada
     * @return integer|boolean retorna o id na nova entrada programada ou false caso ocorra alguma falha no banco de dados
     */
    public function registerNewEP($rotulo, $idEstrutura, $totalEp, $json) {
        try {
            $this->connection->beginTransaction();
            $stmt = $this->connection->insertStmt($idEstrutura, $rotulo, $totalEp, $json);
            if ($stmt->execute()) {
                $id = $this->connection->lastInsertId();
                $this->connection->commit();
                return $id;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            $this->connection->rollBack();
        }
        return false;
    }

    /**
     * Remove Entrada Programada
     * @param integer $idEp id na tabela Entrada Programada
     * @return boolean retorna se a operação foi realizada com sucesso no banco de dados
     */
    public function deleteEp($idEp) {
        try {
            $stmt = $this->connection->deleteStmt($idEp);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Lista as Entradas programadas de outros usuários, em arrays com:
     * <ul>
     * <li>['id' => id da entrada programada]</li>
     * <li>['rotulo' => rótulo da entrada programada]</li>
     * <li>['data' => data de revisão da entrada programada]</li>
     * <li>['hora' => hora de revisão da entrada programada]</li>
     * <li>['total' => total de entradas programadas]</li>
     * <li>['fname' => primeiro nome do autor]</li>
     * <li>['lname' => último nome do autor]</li>
     * <li>['nickname' => apelido do autor]</li>
     * <li>['email' => email do autor]</li>
     * </ul>
     * @param integer $idEstrutura id na tabela de Estruturas de Dados
     * @return array|boolean retorna conjunto de arrays com as informações ou false em caso de falha no banco de dados
     */
    public function listOthersEp($idEstrutura){
        try {
            $stmt = $this->connection->listaOthersEpStmt($idEstrutura);
            if ($stmt->execute()) {
                $lista = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    /**
     * Lista as Entradas programadas do usuário, em arrays com:
     * <ul>
     * <li>['id' => id da entrada programada]</li>
     * <li>['rotulo' => rótulo da entrada programada]</li>
     * <li>['data' => data de revisão da entrada programada]</li>
     * <li>['hora' => hora de revisão da entrada programada]</li>
     * <li>['total' => total de entradas programadas]</li>
     * </ul>
     * @param integer $idEstrutura id na tabela de Estruturas de Dados
     * @return array|boolean retorna conjunto de arrays com as informações ou false em caso de falha no banco de dados
     */
    public function listEp($idEstrutura) {
        try {
            $stmt = $this->connection->listaStmt($idEstrutura);
            if ($stmt->execute()) {
                $lista = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

}
