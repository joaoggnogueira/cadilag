<?php

namespace controladores;

use PDO;

class PDOCadilag extends PDO {

    public $idUser;

    /**
     * Verifica se o usuário existe no banco de dados
     * @param string $email email do usuário
     * @return integer|boolean retorna o ID do usuário, ou False caso o usuário não for encontrado
     */
    public function checkAcess($email) {
        try {
            $stmt = parent::prepare('SELECT usu_id as id FROM usuario WHERE email = :email');
            $stmt->bindValue(':email', $email, PDO::PARAM_STR);

            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->idUser = (int) $fecth['id'];
                return $this->idUser;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

}
