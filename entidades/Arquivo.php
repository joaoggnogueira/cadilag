<?php

/**
 * Description of Arquivo
 *
 * @author joaog
 */
class Arquivo {

    private $id;
    private $iduser;
    private $idatividade;
    private $data;
    private $hora;
    private $filename;
    private $titlealuno;

    private $name;
    private $size;
    private $type;
    
    public function __construct($result) {

        $this->id = $result['arq_id'];
        $this->iduser = $result['idusuario'];
        $this->idatividade = $result['idatividade'];
        $this->data = $result['data'];
        $this->hora = $result['hora'];
        
        $this->filename = (isset($result['filename']) ? $result['filename'] : null);
        $this->name = (isset($result['name']) ? $result['name'] : null);
        $this->size = (isset($result['size']) ? $result['size'] : null);
        $this->type = (isset($result['type']) ? $result['type'] : null);
    }
    
    public function getFilename(){
        return $this->filename;
    }
    
    public function getName() {
        return $this->name;
    }

    public function getType() {
        return $this->type;
    }

    public function setTitleAluno($TitleAluno) {
        $this->titlealuno = $TitleAluno;
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

    public function getDescricao() {
        return $this->descricao;
    }

    public function getId() {
        return $this->id;
    }

    public function getIduser() {
        return $this->iduser;
    }

    public function getCaminho() {
        return $this->caminho;
    }

    public function getIdatividade() {
        return $this->idatividade;
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

    public function getTitleAluno() {
        return $this->titlealuno;
    }

    /**
     * Datea > Dateb
     * @param type $datea
     * @param type $dateb
     */
    public function isMajorDate($date) {

        $datasplit = explode("-", $date);

        $diaB = (int) $datasplit[2];
        $mesB = (int) $datasplit[1];
        $anoB = (int) $datasplit[0];

        $datasplit = explode("-", $this->data);

        $diaA = (int) $datasplit[2];
        $mesA = (int) $datasplit[1];
        $anoA = (int) $datasplit[0];


        if ($anoA > $anoB) {
            return true;
        } else if ($anoA == $anoB) {
            if ($mesA > $mesB) {
                return true;
            } else if ($mesA == $mesB) {
                if ($diaA > $diaB) {
                    return true;
                }
            }
        }
        return false;
    }

}
