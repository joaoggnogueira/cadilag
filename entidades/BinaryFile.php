<?php

/**
 * Description of Arquivo
 *
 * @author joaog
 */
class BinaryFile{

    private $id;
    private $name;
    private $type;
    private $size;
    private $content;

    public function __construct($id,$name,$size,$type,$content) {
        $this->id = $id;
        $this->name = $name;
        $this->size = $size;
        $this->type = $type;
        $this->content = $content;
    }
    
    function getId() {
        return $this->id;
    }

    function getName() {
        return $this->name;
    }

    function getType() {
        return $this->type;
    }

    function getSize() {
        return $this->size;
    }

    function getContent() {
        return $this->content;
    }
    
}
