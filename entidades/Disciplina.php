<?php

/**
 * Description of Disciplina
 *
 * @author joaog
 */
class Disciplina {
    
    private $nome;
    private $id;
    private $turmas;
    
    public function fetchTree($turmas){
        foreach($turmas as $key => $turma) {
            if($this->id===$turma['disc_id']) {
                $this->turmas[] = new Turma($turma);
            }
        }
    }
    
    public function __construct($disciplina) {
        $this->nome = $disciplina['disc_nome'];
        $this->id = $disciplina['disc_id'];
        $this->turmas = array();
    }
    
    public function getNome() {
        return $this->nome;
    }

    public function getId() {
        return $this->id;
    }

    public function getTurmas() {
        return $this->turmas;
    }


    
}
