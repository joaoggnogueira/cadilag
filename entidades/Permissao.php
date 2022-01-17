<?php

class Permissao {
    
    private $pseudoadd;
    private $pseudorem;
    private $pseudosearch;
    
    public function __construct($row) {
        $this->pseudoadd = $row['pseudo_add'];
        $this->pseudorem = $row['pseudo_rem'];
        $this->pseudosearch = $row['pseudo_search'];        
    }   

    public function getPseudoadd() {
        return $this->pseudoadd;
    }

    public function getPseudorem() {
        return $this->pseudorem;
    }

    public function getPseudosearch() {
        return $this->pseudosearch;
    }


    
}
