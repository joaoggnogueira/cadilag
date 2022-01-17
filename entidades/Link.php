<?php

/**
 * Description of Link
 *
 * @author joaog
 */
class Link {
    
    private $url;
    private $titulo;
    private $external_title;
    private $external_icon;
    private $id;
    
    public function __construct($row) {
        $this->url = $row['path'];
        $this->titulo = $row['nome'];
        $this->external_icon = $row['external_image'];
        $this->external_title = $row['external_title'];
        $this->titulo = $row['nome'];
        $this->id = $row['link_id'];
    }
    
    public function getExternalTitle() {
        return $this->external_title;
    }
    
    public function getExternalIcon() {
        return $this->external_icon;
    }
    
    public function getUrl() {
        return $this->url;
    }

    public function getTitulo() {
        return $this->titulo;
    }
    
    public function getId() {
        return $this->id;
    }

}
