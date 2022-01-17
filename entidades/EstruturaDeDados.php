<?php

/**
 * Description of EstruturaDeDados
 *
 * @author joaog
 */
class EstruturaDeDados {
    
    private $id;
    private $nome;
    
    public function __construct($row) {
            
        $this->id = $row['ed_id'];
        $this->nome = $row['ed_nome'];
        
    }
    
    public function getId() {
        return $this->id;
    }

    public function getNome() {
        return utf8_encode($this->nome);
    }
    
}
