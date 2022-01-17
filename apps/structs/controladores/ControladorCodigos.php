<?php

namespace controladores;

use PDO;
use config\Database;

/**
 * Controlador representa todas operações relaciona a pseudocódigos
 */
class ControladorCodigos {

    private $connection;

    public function __construct() {
        try {
            $this->connection = new CodePDO(
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
     * Insere um novo código fonte
     * @param integer $idEstruturaDeDados id na tabela Estrutura de Dados
     * @param string $title rótulo do código fonte
     * @param string $language linguagem do código fonte
     * @param string $listaAdd json com os dados das linhas do código fonte de inserção
     * @param string $listaRem json com os dados das linhas do código fonte de remoção
     * @param string $listaSearch json com os dados das linhas do código fonte de busca
     * @return integer|boolean retorna o id do código que acabou de ser inserido, ou false caso ocorra alguma falha no banco de dados
     */
    public function registerNewCode($idEstruturaDeDados, $title, $language, $listaAdd, $listaRem, $listaSearch) {
        try {
            $this->connection->beginTransaction();
            $stmt = $this->connection->insertStmt($idEstruturaDeDados, $title, $language, $listaAdd, $listaRem, $listaSearch);
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
     * Atualiza um código fonte
     * @param type $idCode id na tabela codigo fonte
     * @param string $title rótulo do código fonte
     * @param string $language linguagem do código fonte
     * @param string $listaAdd json com os dados das linhas do código fonte de inserção
     * @param string $listaRem json com os dados das linhas do código fonte de remoção
     * @param string $listaSearch json com os dados das linhas do código fonte de busca
     * @return boolean
     */
    public function updateCode($idCode, $title, $language, $listaAdd, $listaRem, $listaSearch) {
        try {
            $stmt = $this->connection->updateStmt($idCode, $title, $language, $listaAdd, $listaRem, $listaSearch);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Remove o código fonte do banco de dados
     * @param integer $idCode id na tabela codigos
     * @return boolean retorna se a operação foi realizada com sucesso
     */
    public function deleteCode($idCode) {
        try {
            $stmt = $this->connection->deleteStmt($idCode);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o código fonte por meio do seu id em um array com
     * <ul>
     * <li>["add" => json com informações sobre as linha de código fonte de inserção]</li>
     * <li>["rem" => json com informações sobre as linha de código fonte de remoção]</li>
     * <li>["search" => json com informações sobre as linha de código fonte de busca]</li>
     * </ul>
     * @param integer $idCode id na tabela código
     * @return array as informações em um array, ou false em caso ocorra alguma falha no banco de dados 
     */
    public function getCodes($idCode) {
        try {
            $stmt = $this->connection->codeStmt($idCode);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return array("add" => $result['addCode'], "rem" => $result['remCode'], "search" => $result['searchCode']);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera detalhes sorbe o código fonte em um array com:
     * <ul>
     *  <li>['idEstrutura' => id na tabela Estrutura de Dados]</li>
     *  <li>['title' => rótulo do código fonte]</li>
     *  <li>['language' => linguagem do código fonte]</li>
     * </ul>
     * @param integer $idCode id na tabela código
     * @return array|boolean as informações em um array ou false caso ocorra alguma falha no banco de dados
     */
    public function getCodeDetail($idCode) {
        try {
            $stmt = $this->connection->codeDetailStmt($idCode);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return array("idEstrutura" => $result['idEstrutura'], "title" => $result['title'], "language" => $result['language']);
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
        }
        return false;
    }
    
    /**
     * Lista Informações sobre estruturas de dados em um array, onde cada posição tem:
     * <ul>
     * <li>['id' => id da estrutura de dados]</li>
     * <li>['nome' => nome da estrutura de dados]</li>
     * </ul>
     * @return conjunto de array com as informações ou false em caso de falha no banco de dados
     */
    public function listEstruturasDeDados(){
        try {
            $stmt = $this->connection->listEstruturasStmt();
            if ($stmt->execute()) {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    /**
     * Recupera informações sobre todos os códigos fontes de todos usuários em array, onde cada posição tem:
     * <ul>
     * <li>['fname' => Primeiro nome do autor]</li>
     * <li>['lname' => Último nome do autor]</li>
     * <li>['nickname' => Apelido do autor]</li>
     * <li>['email' => Email do autor]</li>
     * <li>['iduser' => id do autor na tabela usuário]</li>
     * <li>['titulo' => rótulo do código fonte]</li>
     * <li>['linguagem' => linguagem do código fonte]</li>
     * <li>['datetime' => dia revisão do código fonte]</li>
     * <li>['idCode' => id do código fonte]</li>
     * </ul>
     * @param integer $idEstrutura id na tabela estrutura de dados
     * @return array|boolean retorna um array com as informações ou false em caso ocorra alguma falha no banco de dados
     */
    public function listCodes($idEstrutura) {
        try {
            $stmt = $this->connection->listStmt($idEstrutura);
            if ($stmt->execute()) {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Lista os códigos do usuário
     * @param integer $idEstrutura id na tabela estruturas de dado
     * @return array|false retorna um array com objetos que possui informações sobre os códigos
     */
    public function listOwnCodes($idEstrutura) {
        try {
            $stmt = $this->connection->listOwnStmt($idEstrutura);
            if ($stmt->execute()) {
                $lista = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new \entidades\Codigo($row);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

}
