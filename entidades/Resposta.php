<?php

/**
 * Description of Resposta
 *
 * @author joaog
 */
class Resposta {

    private $texto;
    private $data;
    private $hora;
    private $id;
    private $votosPositivos;
    private $votosNegativos;
    private $voto;
    private $userImage;
    private $userEmail;
    private $userNome;
    private $userSobrenome;
    private $userApelido;
    private $topicoAssunto;
    private $topicoId;
    private $userId;

    public function __construct($row) {
        $this->texto = $row['resp_texto'];
        $this->data = $row['data'];
        $this->hora = $row['hora'];
        $this->id = (int) $row['resp_id'];
        if (isset($row['email'])) {
            if (isset($row['Path_imguser'])) {
                $this->userImage = $row['Path_imguser'];
            }
            $this->userEmail = $row['email'];
            $this->userSobrenome = $row['usu_lname'];
            $this->userNome = $row['usu_fname'];
            $this->userApelido = $row['usu_nickname'];
        }
        if (isset($row['top_assunto'])) {
            $this->topicoAssunto = $row['top_assunto'];
        }
        $this->votosPositivos = 0;
        $this->votosNegativos = 0;
        $this->topicoId = $row['top_id'];
        $this->userId = $row['usu_id'];
        $this->voto = null;
    }

    public function getTopicoAssunto() {
        return $this->topicoAssunto;
    }

    public function getTopicoId() {
        return $this->topicoId;
    }

    public function getVotosPositivos() {
        return $this->votosPositivos;
    }

    public function getVotosNegativos() {
        return $this->votosNegativos;
    }

    public function getVoto() {
        return $this->voto;
    }

    public function setVoto($voto) {
        $this->voto = $voto;
    }

    public function setVotosPositivos($votosPositivos) {
        $this->votosPositivos = $votosPositivos;
    }

    public function setVotosNegativos($votosNegativos) {
        $this->votosNegativos = $votosNegativos;
    }

    public function getTexto() {
        return $this->texto;
    }

    public function getData() {
        return $this->data;
    }

    public function getDataFormatada() {
        return date("d/m/Y", strtotime($this->data));
    }

    public function getHora() {
        return $this->hora;
    }

    public function getId() {
        return $this->id;
    }

    public function getUserImage() {
        if ($this->userImage === '' || $this->userImage === null) {
            return 'images/userdefault.png';
        } else {
            return $this->userImage;
        }
    }

    public function getUserEmail() {
        return $this->userEmail;
    }

    public function getUserNome() {
        return $this->userNome;
    }

    public function getUserSobrenome() {
        return $this->userSobrenome;
    }

    public function getUserApelido() {
        return $this->userApelido;
    }

    public function getUserId() {
        return $this->userId;
    }

}
