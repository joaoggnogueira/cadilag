<?php

/**
 * Description of Topico
 *
 * @author joaog
 */
class Topico {

    private $titulo;
    private $texto;
    private $data;
    private $hora;
    private $iduser;
    private $particular;
    private $report;
    private $anonimo;
    private $turma;
    private $user_image;
    private $user_email;
    private $user_nome;
    private $user_sobrenome;
    private $user_apelido;
    private $id;

    public function __construct($result) {
        $this->titulo = $result['top_assunto'];
        $this->texto = $result['topico_texto'];
        $this->data = $result['data'];
        $this->hora = $result['hora'];
        $this->id = $result['top_id'];
        $this->iduser = (int) $result['usu_id'];
        $this->turma = ($result['Turma_idTurma'] !== null ? $result['Turma_idTurma'] : null);
        $this->particular = $result['visible_only_by_class'] === '1';
        $this->report = $result['report'] === '1';
        $this->anonimo = $result['anonimo'] === '1';
        if (isset($result['usu_nickname'])) {
            $this->user_apelido = $result['usu_nickname'];
            $this->user_nome = $result['usu_fname'];
            $this->user_sobrenome = $result['usu_lname'];
            
            $this->user_email = $result['email'];
            if (isset($result['Path_imguser'])) {
                $this->user_image = $result['Path_imguser'];
            }
        }
    }

    public function getReport() {
        return $this->report;
    }

    public function getAnonimo() {
        return $this->anonimo;
    }

    public function getParticular() {
        return $this->particular;
    }

    public function getTurma() {
        return $this->turma;
    }

    public function getShortTitulo() {
        return $this->getTituloCortado(20);
    }

    public function getMediumTitulo() {
        return $this->getTituloCortado(40);       
    }

    public function getTituloCortado($size) {
        if (strlen($this->titulo) > $size) {
            return substr($this->titulo, 0, $size) . " ... ";
        }
        return $this->titulo;        
    }
    
    public function getTitulo() {
        return $this->titulo;
    }

    public function getTexto() {
        return $this->texto;
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

    public function getHoraMinimizada() {
        return substr($this->hora, 0, 5);
    }

    public function getId() {
        return $this->id;
    }

    public function getUserImage() {
        $imageurl = $this->user_image;
        if ($imageurl != null && $imageurl !== '') {
            $imageurl = $imageurl;
        } else {
            $imageurl = 'images/userdefault.png';
        }
        return $imageurl;
    }

    public function getTitleNameUser() {
        if ($this->getAnonimo())
        {
            $title = "Anônimo";
        }
        else
        {
            if ($this->user_apelido != null && $this->user_apelido != '') {
                $title = $this->user_apelido;
            } else if ($this->user_nome != null && $this->user_nome != '') {
                $title = $this->user_nome;
            } else if ($this->user_sobrenome != null && $this->user_sobrenome != '') {
                $title = "Sr(a). " . $this->user_sobrenome;
            } else {
                $title = $this->user_email;
            }
        }
        return $title;
    }

    public function getUserEmail() {
        return $this->user_email;
    }

    public function getUserNome() {
        return $this->user_nome;
    }

    public function getUserSobrenome() {
        return $this->user_sobrenome;
    }

    public function getUserApelido() {
        return $this->user_apelido;
    }

    public function getIduser() {
        return $this->iduser;
    }

}
