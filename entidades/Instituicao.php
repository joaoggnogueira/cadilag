<?php

/**
 * Description of Instituicao
 *
 * @author joaog
 */
class Instituicao {
    
    private $id;
    private $nome;
    private $uf;
    private $cursos;
    
    public function fetchTree($cursos,$disciplinas,$turmas){
        $cont = 0;
        
        foreach($cursos as $key => $curso) {
         
            if($this->id==$curso['inst_id']) {
                $curso = new Curso($curso);
                $curso->fetchTree($disciplinas, $turmas);
                $this->cursos[] = $curso;
            }
        }
    }
    
    public function __construct($instituicao) {
        $this->id = $instituicao['inst_id'];
        $this->nome = utf8_encode($instituicao['inst_nome']);
        $this->uf = $instituicao['inst_uf'];
        $this->cursos = array();
    }
    
    public function getId() {
        return $this->id;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getUf() {
        return $this->uf;
    }

    public function getCursos() {
        return $this->cursos;
    }
}
