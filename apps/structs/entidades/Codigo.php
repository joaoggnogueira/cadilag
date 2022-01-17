<?php

/**
 * Description of EstruturaDeDados
 *
 * @author joaog
 */

namespace entidades;
use DateTime;

class Codigo{

    private $id;
    private $idEstrutura;
    private $rotulo;
    private $linguagem;
    private $data;
    private $hora;

    public function __construct($row) {
        $datetime = DateTime::createFromFormat('Y-m-d H:i:s',$row['datetime']);
        $this->id = $row['id'];
        $this->rotulo = $row['rotulo'];
        $this->data = $datetime->format('d/m/Y');
        $this->hora = $datetime->format('H:i');
        $this->linguagem = $row['linguagem'];
    }

    function getId() {
        return $this->id;
    }

    function getRotulo() {
        return str_replace("'", "", str_replace("\"", "", $this->rotulo));
    }

    function getLinguagem() {
        return $this->linguagem;
    }

    function getData() {
        return $this->data;
    }

    function getHora() {
        return $this->hora;
    }

}