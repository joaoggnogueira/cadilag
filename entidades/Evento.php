<?php


/**
 * Description of Evento
 *
 * @author joaog
 */
class Evento {
    
    private $titulo;
    private $data;
    private $id;
    private $idTurma;
    
    public function __construct($row) {
        $this->titulo = $row['titulo'];
        $this->data = $row['data'];
        $this->id = $row['id'];
        $this->idTurma = $row['idTurma'];
    }
    
    function getTitulo() {
        return $this->titulo;
    }

    function getData() {
        return $this->data;
    }
    
    public function getDataFormatada() {
        return date("d/m/Y", strtotime($this->getData()));
    }

    function getId() {
        return $this->id;
    }

    function getIdTurma() {
        return $this->idTurma;
    }

}
