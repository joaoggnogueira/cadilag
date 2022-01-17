<?php

/**
 * Description of EstruturaDeDados
 *
 * @author joaog
 */

namespace entidades;

class EntradaProgramada{

    private $id;
    private $rotulo;
    private $data;
    private $hora;
    private $total;
    private $row;

    public function __construct($row) {
        $this->id = $row['id'];
        $this->rotulo = $row['rotulo'];
        $this->data = $row['data'];
        $this->hora = $row['hora'];
        $this->total = $row['total'];
        $this->row = $row;
    }

    public function getId() {
        return $this->id;
    }

    public function getRotulo() {
        return str_replace("'", "", str_replace("\"", "", $this->rotulo));
    }

    public function getData() {
        return $this->data;
    }

    public function getHora() {
        return $this->hora;
    }

    public function getTotal() {
        return $this->total;
    }

    public function getRow() {
        return $this->row;
    }

    public function toJson() {
        return $this->row;
    }

}