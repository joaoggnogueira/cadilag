<?php

/**
 * Description of Curso
 *
 * @author joaog
 */
class Curso {
    
    private $id;
    private $nome;
    private $sigla;
    private $disciplinas;
    private $idInst;

    public function fetchTree($disciplinas,$turmas){
    
        foreach($disciplinas as $key => $disciplina) {
            if($this->id===$disciplina['cur_id']) {
                $disciplina = new Disciplina($disciplina);
                $disciplina->fetchTree($turmas);
                $this->disciplinas[] = $disciplina;
            }
        }
    }
    
    public function __construct($curso){
        
        $this->id = $curso['cur_id'];
        $this->nome = $curso['cur_nome'];
        $this->sigla = $curso['cur_sigla'];
        $this->idInst = $curso['inst_id'];
        $this->disciplinas = array();
    }
    
    function getIdInst() {
        return $this->idInst;
    }

    public function getId() {
        return $this->id;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getSigla() {
        return $this->sigla;
    }

    public function getDisciplinas() {
        return $this->disciplinas;
    }


}
