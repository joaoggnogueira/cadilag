<?php

/**
 * Description of Atividade
 *
 * @author joaog
 */
class Atividade {
  
    private $id;
    private $titulo;
    private $texto;
    private $dataLimite;
    private $dataRevisao;
    private $horaRevisao;
    
    public function __construct($row) {
        $this->id = $row['atv_id'];
        $this->titulo = $row['atv_titulo'];
        $this->texto = $row['atv_texto'];
        $this->dataRevisao = $row['atv_data'];
        $this->horaRevisao = $row['atv_hora'];
        $this->dataLimite = $row['atv_data_limite'];
    }
    
    public function getId() {
        return $this->id;
    }

    public function getTitulo() {
        return $this->titulo;
    }

    public function getTexto() {
        return $this->texto;
    }

    public function getDataLimite() {
        return $this->dataLimite;
    }
    
    public function getDataLimiteFormatada() {
        return date("d/m/Y", strtotime($this->getDataLimite()));
    }


    public function getDataRevisao() {
        return $this->dataRevisao;
    }
    
    public function getDataRevisaoFormatada(){
        return date("d/m/Y", strtotime($this->getDataRevisao()));
    }

    public function getHoraRevisao() {
        return $this->horaRevisao;
    }


    
}
