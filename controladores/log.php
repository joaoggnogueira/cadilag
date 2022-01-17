<?php

/**
 * @author Joao
 * Registra ações realizadas no banco de dados e acessos ao sistema
 */
use config\Database;

class log {

    /**
     * @var PDO 
     */
    private $connection;
    private $idusuario;

    const TYPE_NORMAL = 1;
    const TYPE_ERROR = 2;
    const TYPE_ANORMAL = 3;

    /**
     * @param PDO $connection uma conexão já estabelecida com o Banco de Dados
     * @param integer $idusuario id do usuário que está realizando a requisição
     */
    public function __construct($connection, $idusuario) {
        if ($connection) {
            if ($connection instanceof PDO) {
                $this->connection = $connection;
                $this->idusuario = $idusuario;
            } else {
                echo "Connection is instance of PDO";
            }
        } else {
            echo "Connection is undefined to load the LOG Controller";
        }
    }

    /**
     * Recupera o IP do usuário, se possível<br/>
     * It's not completely fool proof, as the values of $_SERVER can be faked, <br/>
     * however it will still add an extra layer of security that does not rely on cookies.<br/>
     * @return string IP
     */
    private function getIp() {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP'])){
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        } else if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else if (isset($_SERVER['HTTP_X_FORWARDED'])) {
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        } else if (isset($_SERVER['HTTP_FORWARDED_FOR'])) {
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        } else if (isset($_SERVER['HTTP_FORWARDED'])) {
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        } else if (isset($_SERVER['REMOTE_ADDR'])) { 
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        } else {
            $ipaddress = 'UNKNOWN';
        }
        return $ipaddress;
    }

    /**
     * Registra a nova atividade no log do sistema
     * @param string $mensagem descrição curta da operação
     * @param array $data conjunto de informações adicionais
     * @param integer $tipo nivel (constante) de atenção da operação
     * @return boolean se foi possível realizar a operação
     */
    public function log($mensagem, $data = array(), $tipo = log::TYPE_NORMAL) {

        $IP = $this->getIp();
        $sql = 'INSERT INTO log(mensagem,ip,data_hora,id_usuario,data,id_tipo) '
                . 'VALUES (:mensagem,:ip,NOW(),:id_usuario,:data,:tipo)';
        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue(':mensagem', $mensagem, PDO::PARAM_STR);
        $stmt->bindValue(':ip', $IP, PDO::PARAM_STR);
        $stmt->bindValue(':id_usuario', $this->idusuario, PDO::PARAM_INT);
        $stmt->bindValue(':data', json_encode($data), PDO::PARAM_STR);
        $stmt->bindValue(':tipo', $tipo, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            echo "\n\n<br>";
            echo "$this->idusuario ";
            echo "$mensagem ";
            echo "$IP ";
            echo json_encode($data) . " ";
            echo $tipo . ' ';
            echo "Falha ao executar LOG";
            return false;
        }
    }

}
