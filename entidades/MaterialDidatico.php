<?php

/**
 * Description of MateriaisDidaticos
 *
 * @author joaog
 */
class MaterialDidatico {

    private $id;
    private $titulo;
    private $detalhes;
    private $data;
    private $hora;
    private $idturma;
    private $name;
    private $size;
    private $type;

    public function __construct($row) {
        $this->id = $row['idMaterialDidatico'];
        $this->titulo = $row['rotulo'];
        $this->detalhes = $row['detalhes'];
        $this->idturma = $row['Turma_idTurma'];
        $this->data = $row['data'];
        $this->hora = $row['hora'];
        $this->name = (isset($row['name']) ? $row['name'] : null);
        $this->size = (isset($row['size']) ? $row['size'] : null);
        $this->type = (isset($row['type']) ? $row['type'] : null);
    }

    function getName() {
        return $this->name;
    }

    function getType() {
        return $this->type;
    }

    public function getId() {
        return $this->id;
    }

    public function getTitulo() {
        return $this->titulo;
    }

    public function getDetalhes() {
        return $this->detalhes;
    }

    public function getData() {
        return $this->data;
    }

    public function getHora() {
        return $this->hora;
    }

    public function getDataFormatada() {
        return date("d/m/Y", strtotime($this->data));
    }

    public function getHoraMinimizada() {
        return substr($this->hora, 0, 5);
    }

    public function getIdturma() {
        return $this->idturma;
    }
    
    public function getSize() {
        $bytes = $this->size;
        if ($bytes >= 1073741824) {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        } elseif ($bytes > 1) {
            $bytes = $bytes . ' bytes';
        } elseif ($bytes == 1) {
            $bytes = $bytes . ' byte';
        } else {
            $bytes = '0 bytes';
        }

        return $bytes;
    }

}
