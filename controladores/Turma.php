<?php

/**
 * Description of turma
 * Representa uma Turma e suas operações por parte do professor, também pode ser utilizada como Entidade
 * @author joaog
 */
class Turma {

    private $ano;
    private $semestre;
    private $idprofessor;
    private $idturma;
    private $iddisciplina;
    private $status;
    private $idfile;
    private $filename;
    private $connection;

    public function __construct($row) {
        $this->ano = $row['tur_ano'];
        $this->semestre = $row['tur_semestre'];
        $this->idprofessor = $row['prof_id'];
        $this->idturma = $row['idTurma'];
        $this->iddisciplina = $row['disc_id'];
        $this->status = $row['status'];
        $this->idfile = $row['id_file_plano_de_ensino'];

        if (isset($row['filename'])) {
            $this->filename = $row['filename'];
        }

        $controlador = new ControladorUsuario();
        $this->connection = $controlador->getConnection();
    }

    public function getFilename() {
        return $this->filename;
    }

    public function getIdFile() {
        return $this->idfile;
    }

    public function getStatus() {
        return $this->status;
    }

    public function getAno() {
        return $this->ano;
    }

    public function getSemestre() {
        return $this->semestre;
    }

    public function getIdprofessor() {
        return $this->idprofessor;
    }

    public function getIdturma() {
        return $this->idturma;
    }

    public function getIddisciplina() {
        return $this->iddisciplina;
    }

    /**
     * Somente par reduzir a quantidade de código, realiza uma operação relacionada com a turma
     * @param string $sql A SQL String
     * @return boolean retorna se a operação foi realizada com sucesso com o resultado do fetch
     */
    private function resultSQL($sql) {
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }
    
    /**
     * Lista todos os tópicos vinculados com a turma
     * @param integer $ini posição do primeiro tópico a ser recuperado
     * @param integer $quantidade Total de tópicos a serem recuperados
     * @return boolean|\Topico Um Array de Objetos com informações sobre os tópicos, ou false, em caso de falha no banco
     */
    public function listarTopicos($ini, $quantidade) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM topico WHERE `Turma_idTurma`=:id ORDER BY data DESC,hora DESC LIMIT :ini,:fim ');
            $stmt->bindParam(':ini', $ini, PDO::PARAM_INT);
            $stmt->bindParam(':fim', $quantidade, PDO::PARAM_INT);
            $stmt->bindParam(':id', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new Topico($result);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o total de arquivos enviados para uma atividade, dependendo se o usuário é Aluno ou Professor
     * @param integer $idatv id da atividade
     * @param boolean $isAluno informa se é uma aluno ou professor
     * @param integer $iduser id do usuário
     * @return integer retorna o total de arquivos, ou false em caso de falha no banco
     */
    public function getTotalArquivo($idatv, $isAluno, $iduser) {
        try {
            if (!$isAluno) {
                $stmt = $this->connection->prepare('SELECT count(arq_id) as total FROM arquivo WHERE idatividade=:idatv');
            } else {
                $stmt = $this->connection->prepare('SELECT count(arq_id) as total FROM arquivo WHERE idatividade=:idatv AND (idusuario=:idprof OR idusuario=:iduser)');
                $stmt->bindParam(':idprof', $this->idprofessor, PDO::PARAM_INT);
                $stmt->bindParam(':iduser', $iduser, PDO::PARAM_INT);
            }
            $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return (int) $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre os arquivos do professor para uma Atividade especifica
     * @param integer $idatv id na tabela arquivos
     * @return boolean|\Arquivo retorna Array de Objetos com informações sobre os arquivos de atividadees, ou false, em caso de falha no banco de dados
     */
    public function listarArquivosAbertosDaAtividade($idatv) {
        try {
            $stmt = $this->connection->prepare('SELECT arquivo.*,file.name as filename FROM file,arquivo,atividade,turma WHERE '
                    . 'arquivo.idatividade=:idatv AND '
                    . 'atividade.idTurma = turma.idTurma '
                    . 'AND file.id = arquivo.id_file '
                    . 'AND arquivo.idatividade = atividade.atv_id '
                    . 'AND atividade.`idTurma` = :idturma '
                    . 'AND turma.prof_id = arquivo.idusuario '
                    . 'ORDER BY arquivo.arq_id DESC');

            $idturma = (int) $this->idturma;

            $stmt->bindParam(':idturma', $idturma, PDO::PARAM_INT);
            $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new Arquivo($result);
                }
                return $lista;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }

        return false;
    }
    
    /**
     * Recupera informações sobre os arquivos que não são do professor para uma Atividade especifica, com a informações do aluno autor
     * @param integer $idatv id na tabela arquivos
     * @return boolean|\Arquivo retorna Array de Objetos com informações sobre os arquivos de atividadees, ou false, em caso de falha no banco de dados
     */
    public function listarArquivosDaAtividade($idatv) {
        try {
            $stmt = $this->connection->prepare('SELECT arquivo.*,file.name as filename FROM file,arquivo,atividade,turma WHERE '
                    . 'file.id = arquivo.id_file AND '
                    . 'arquivo.idatividade=:idatv AND '
                    . 'atividade.idTurma = turma.idTurma AND '
                    . 'arquivo.idatividade=atividade.atv_id '
                    . 'AND atividade.`idTurma`=:idturma '
                    . 'AND turma.prof_id!=arquivo.idusuario '
                    . 'ORDER BY arquivo.arq_id DESC');


            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $lista = array();

                $controlador = new ControladorUsuario();

                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $arquivo = new Arquivo($result);
                    $stmt2 = $this->connection->prepare('SELECT usu_fname,usu_lname,usu_nickname,email FROM usuario WHERE usu_id=:id ORDER BY arq_id DESC');
                    $stmt2->bindParam(':id', $result['idusuario'], PDO::PARAM_INT);
                    $stmt2->execute();
                    $aluno = $stmt2->fetch(PDO::FETCH_ASSOC);
                    $arquivo->setTitleAluno($controlador->getTitleNameBy($aluno['usu_fname'], $aluno['usu_lname'], $aluno['usu_nickname'], $aluno['email']));
                    $lista[] = $arquivo;
                }
                return $lista;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }

        return false;
    }

    /**
     * Recupera totais de alunos que fizeram e total de alunos na turma e retorna em um array com
     * <ul>
     *  <li>['fizeram' => total de alunos que responderam com pelo menos um arquivo para a atividade]</li>
     *  <li>['total' => total de alunos na disciplina]</li>
     * </ul>
     * @param integer $idatv id na tabela Atividade
     * @return array|boolean o array com as informações ou false em caso de falha no banco 
     */
    public function getTotaisAtividade($idatv) {
        try {
            $stmt = $this->connection->prepare('SELECT 
                (SELECT COUNT(DISTINCT alu.alu_id) FROM arquivo arq
                INNER JOIN aluno alu ON alu.alu_id = arq.idusuario
                INNER JOIN atividade atv ON atv.atv_id = arq.idatividade
                WHERE atv.`atv_id` = :idatv AND atv.`idTurma` = :idturma
                GROUP BY alu.alu_id) as fizeram
                ,
                (SELECT COUNT(alu.alu_id) FROM aluno alu
                WHERE alu.idTurma = :idturma) as total');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);
            if ($stmt->execute()) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre a atividade por meio do seu id
     * @param integer $idatv id na tabela atividade
     * @return boolean|\Atividade O objeto com as informações da atividade, ou false em caso de falha
     */
    public function getAtividade($idatv) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM atividade WHERE `idTurma`=:idturma AND atv_id=:idatv');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return new Atividade($result);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Define as permissão para visualização de pseudocódigo para uma turma
     * @param integer $idestrutura id na tabela estrutura
     * @param string $pseudo 'add'|'rem'|'search' o algoritmo
     * @param boolean $value define se autoriza ou não
     * @return boolean retorna se foi possível realziar a operação
     */
    public function setPermission($idestrutura, $pseudo, $value) {
        $result = false;
        try {

            $stmt = $this->connection->prepare('SELECT * FROM permissoes WHERE Turma_idTurma=:idturma AND ed_id=:ided');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':ided', $idestrutura, PDO::PARAM_INT);
            $a = $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                $stmt = $this->connection->prepare('INSERT INTO permissoes(ed_id,Turma_idTurma) VALUES (:ided,:idturma)');
                $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
                $stmt->bindParam(':ided', $idestrutura, PDO::PARAM_INT);
                $b = $stmt->execute();
                $stmt = $this->connection->prepare('SELECT * FROM permissoes WHERE Turma_idTurma=:idturma AND ed_id=:ided');
                $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
                $stmt->bindParam(':ided', $idestrutura, PDO::PARAM_INT);
                $c = $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $idpermissao = (int) $row['idpermissao'];
            } else {
                $b = $c = true;
            }

            $idpermissao = (int) $row['idpermissao'];
            switch ($pseudo) {
                case 'add':$sql = 'UPDATE permissoes SET pseudo_add=:value WHERE idpermissao=:idpermissao';
                    break;
                case 'rem':$sql = 'UPDATE permissoes SET pseudo_rem=:value WHERE idpermissao=:idpermissao';
                    break;
                case 'search':$sql = 'UPDATE permissoes SET pseudo_search=:value WHERE idpermissao=:idpermissao';
                    break;
            }
            $stmt = $this->connection->prepare($sql);
            $stmt->bindParam(':idpermissao', $idpermissao, PDO::PARAM_INT);
            $stmt->bindParam(':value', $value, PDO::PARAM_BOOL);
            $d = $stmt->execute();
        } catch (PDOException $e) {
            echo $e;
        }
        return $a && $b && $c & $d;
    }

    /**
     * Recupera as permissões para acessar os pseudocódigo, retornando um array com
     * <ul>
     * <li>['add' => Sendo a permissão para visualizar o código de inserção da estrutura]  </li>
     * <li>['rem' => Sendo a permissão para visualizar o código de remoção da estrutura]  </li>
     * <li>['search' => Sendo a permissão para visualizar o código de busca da estrutura]  </li>
     * </ul>
     * @param integer $idestrutura id na tabela Estrutura de Dados
     * @return array com as permissões, ou false em caso de falha no banco de dados
     */
    public function obterPermissoes($idestrutura) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM permissoes WHERE Turma_idTurma=:idturma AND ed_id=:ided');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':ided', $idestrutura, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    return array('add' => ($row['pseudo_add'] === '1'), 'rem' => ($row['pseudo_rem'] === '1'), "search" => ($row['pseudo_search'] === '1'));
                } else {
                    return array('add' => false, 'rem' => false, "search" => false);
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Remove um link de uma página vinculado a Turma
     * @param integer $idlink  id na tabela Link
     * @return boolean retorna se operação foi realizada com sucesso
     */
    public function removerLink($idlink) {
        try {
            $stmt = $this->connection->prepare('DELETE FROM link WHERE link_id=:idlink AND Turma_idTurma=:idturma');
            $stmt->bindParam(':idlink', $idlink, PDO::PARAM_INT);
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Divulga um link de uma página para a turma
     * @param string $titulo titulo do link para a página
     * @param string $url url do link para a página
     * @return Link|boolean retorna o objeto com as informações do link ou false em caso de falha no banco de dados
     */
    public function novoLink($titulo, $url) {
        try {
            $doc = new DOMDocument();
            $doc->strictErrorChecking = FALSE;
            $str = file_get_contents($url);
            libxml_use_internal_errors(true);
            $doc->loadHTML($str);
            libxml_use_internal_errors(false);

            if (strlen($str) > 0) {
                $title = array();
                $str = trim(preg_replace('/\s+/', ' ', $str)); // supports line breaks inside <title>
                preg_match("/\<title\>(.*)\<\/title\>/i", $str, $title); // ignore case
                if (!isset($title[1])) {
                    preg_match("/\<title[^>]+>(.*)\<\/title\>/i", $str, $title);
                }
            }
            $xml = simplexml_import_dom($doc);
            $arr = $xml->xpath('//link[@rel="shortcut icon"]');

            $external_title = (isset($title[1]) ? $title[1] : "");
            $external_icon = (isset($arr[0]) ? $arr[0]['href'] : "");

            $this->connection->beginTransaction();
            $stmt = $this->connection->prepare('INSERT INTO link(path,nome,Turma_idTurma,external_image,external_title) VALUES (:url,:titulo,:idturma,:icon,:title)');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':titulo', $titulo, PDO::PARAM_STR);
            $stmt->bindParam(':url', $url, PDO::PARAM_STR);
            $stmt->bindParam(':icon', $external_icon, PDO::PARAM_STR);
            $stmt->bindParam(':title', $external_title, PDO::PARAM_STR);
            if ($stmt->execute()) {
                $lastId = (int) $this->connection->lastInsertId();
                $this->connection->commit();
                return $this->getLink($lastId);
            }
        } catch (PDOException $e) {
            if ($this->connection->inTransaction()) {
                $this->connection->rollBack();
            }
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera Informações Sobre o Link de página vinculado a uma turma
     * @param integer $id_link id na tabela link
     * @return \Link|boolean Objeto com as informações do LINK, ou false, em caso de falha no banco de dados
     */
    public function getLink($id_link) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM link WHERE Turma_idTurma=:idturma AND link_id=:id');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':id', $id_link, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return new Link($result);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    /**
     * Recupera uma lista de objetos com informações de links de páginas, vincilados á Turma 
     * @return \Link|boolean Um array de objeto com informações do Link de Página ou false em caso de falha no banco de dados
     */
    public function listarLinks() {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM link WHERE Turma_idTurma=:idturma ORDER BY link_id DESC');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new Link($result);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Retorna o total de atividades abertas (ou seja, que ainda não passaram do seu prazo de entrega)
     * @return integer|boolean o total de atividades, ou false em caso de falha no banco de dados
     */
    public function getTotalAtividadesAbertas() {
        try {

            $stmt = $this->connection->prepare('SELECT count(atv_id) as total FROM atividade WHERE idTurma=:idturma AND atv_data_limite>=current_date()');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return (int) $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Retorna informações sobre as Atividades em Aberto (ou seja, que ainda não passaram do seu prazo de entrega) ordenada
     * @param string $order 'revisao'|'entrega' tipo de ordenação
     * @return Atividade|boolean retorna um array de objetos com informações das atividades ou false em caso de falha no banco de dados
     */
    public function listarAtividadesAbertas($order = 'revisao') {
        try {
            if ($order === 'revisao') {
                $stmt = $this->connection->prepare('SELECT * FROM atividade WHERE idTurma=:idturma AND atv_data_limite>=current_date() ORDER BY atividade.atv_data , atividade.atv_hora');
            } else if ($order === 'entrega') {
                $stmt = $this->connection->prepare('SELECT * FROM atividade WHERE idTurma=:idturma AND atv_data_limite>=current_date() ORDER BY atividade.atv_data_limite DESC');
            }
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new Atividade($result);
                }
                return array_reverse($lista);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    /**
     * Retorna informações sobre as Atividades Fechadas (ou seja, que ainda já passaram do seu prazo de entrega) ordenada
     * @param string $order 'revisao'|'entrega' tipo de ordenação
     * @return Atividade|boolean retorna um array de objetos com informações das atividades ou false em caso de falha no banco de dados
     */
    public function listarAtividadesFechadas($order) {
        try {
            if ($order === 'revisao') {
                $stmt = $this->connection->prepare('SELECT * FROM atividade WHERE idTurma=:idturma AND atv_data_limite<current_date() ORDER BY atividade.atv_data , atividade.atv_hora');
            } else if ($order === 'entrega') {
                $stmt = $this->connection->prepare('SELECT * FROM atividade WHERE idTurma=:idturma AND atv_data_limite<current_date() ORDER BY atividade.atv_data_limite');
            }
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new Atividade($result);
                }
                return array_reverse($lista);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Insere um novo evento da Turma
     * @param string $titulo titulo do evento (Ex: Prova, Apresentação, RER)
     * @param string $data dia no qual será realizada AAAA-MM-DD
     * @return Evento|boolean retorna o objeto do evento ou false em caso de falha no banco
     */
    public function novoEvento($titulo, $data) {
        try {
            $this->connection->beginTransaction();
            $stmt = $this->connection->prepare('INSERT INTO evento(titulo,data,idTurma) VALUES (:title,:data,:id)');
            $stmt->bindParam(':id', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':title', $titulo, PDO::PARAM_STR);
            $stmt->bindParam(':data', $data, PDO::PARAM_STR);
            if ($stmt->execute()) {
                $lastId = (int) $this->connection->lastInsertId();
                $this->connection->commit();
                return $this->getEvento($lastId);
            }
            return false;
        } catch (Exception $e) {
            if ($this->connection->inTransaction()) {
                $this->connection->rollBack();
            }
            echo $e->getMessage();
        }
    }

    /**
     * Recupera uma lista com informações de eventos da Turma 
     * @return boolean|\Evento Um array de Objetos com informações sobre os Eventos da Turma, ou false em caso de falha no banco de dados 
     */
    public function listEventos() {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM evento e WHERE e.idTurma = :idturma');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new Evento($result);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre o Evento a partir do seu ID
     * @param integer $id_evento id na tabela eventos
     * @return boolean|\Evento Um objeto com informações sobre o evento, ou false em caso de falha no banco de dados
     */
    public function getEvento($id_evento) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM evento e WHERE e.idTurma = :idturma AND e.id = :id');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':id', $id_evento, PDO::PARAM_INT);
            if ($stmt->execute()) {
                return new Evento($stmt->fetch(PDO::FETCH_ASSOC));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Remove o evento da Turma
     * @param integer $id_evento id na tabela Evento
     * @return boolean retorna se a operação foi realizada com sucesso
     */
    public function deleteEvento($id_evento) {
        try {
            $stmt = $this->connection->prepare('DELETE FROM evento WHERE idTurma = :idturma AND id = :id');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':id', $id_evento, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Insere uma atividade para a turma
     * @param string $titulo titulo da atividade
     * @param string $texto descrição da atividade
     * @param string $data data de entrega AAAA-MM-DD
     * @return integer|boolean retorna o id na tabela atividade ou false caso ocorra alguma falha no banco de dados
     */
    public function novaAtividade($titulo, $texto, $data) {
        try {
            $this->connection->beginTransaction();
            $stmt = $this->connection->prepare(
                    'insert into atividade(atv_data_limite,idTurma,atv_titulo,atv_texto, atv_data, atv_hora) '
                    . 'values(:data,:idturma,:titulo,:texto, current_date(), current_time())');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':texto', $texto, PDO::PARAM_STR);
            $stmt->bindParam(':titulo', $titulo, PDO::PARAM_STR);
            $stmt->bindParam(':data', $data, PDO::PARAM_STR);
            if ($stmt->execute()) {
                $lastId = (int) $this->connection->lastInsertId();
                $this->connection->commit();
                return $lastId;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    /**
     * Altera uma atividade para a turma
     * @param integer $idatv id na tabela atividade
     * @param string $titulo titulo da atividade
     * @param string $texto descrição da atividade
     * @param string $data data de entrega AAAA-MM-DD
     * @return boolean retorna se foi possível realizar a operação
     */
    public function updateAtividade($idatv, $titulo, $texto, $data) {
        try {
            $stmt = $this->connection->prepare(
                    'UPDATE atividade SET atv_hora=current_time(), '
                    . 'atv_data=current_date(), '
                    . '`atv_data_limite`=:data, '
                    . '`atv_titulo`=:titulo, '
                    . '`atv_texto`=:texto '
                    . 'WHERE `atv_id`=:idatv and `idTurma`=:idturma');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':idatv', $idatv, PDO::PARAM_INT);
            $stmt->bindParam(':texto', $texto, PDO::PARAM_STR);
            $stmt->bindParam(':titulo', $titulo, PDO::PARAM_STR);
            $stmt->bindParam(':data', $data, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (Exception $ex) {
            echo $ex->getMessage();
        }
        return false;
    }

    /**
     * Altera o status da turma (Mural da Turma)
     * @param string $status texto do status
     * @return boolean retorna se a operação foi realizada com sucesso
     */
    public function setStatus($status) {
        try {
            $stmt = $this->connection->prepare('UPDATE turma SET status=:text WHERE idTurma=:idturma;');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':text', $status, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre as Permissões de visualização do pseudocódigo de todas as estruturas de dados
     * @return boolean|\Permissao Um array de Objeto com informações das permissões ou false em caso de falha no banco
     */
    public function listarPermissoes() {
        try {

            $stmt = $this->connection->prepare('SELECT * FROM permissoes WHERE Turma_idTurma=:idturma');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[(int) $result['ed_id']] = new Permissao($result);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera lista de informações sobre os alunos de uma turma, cada posição possui
     * <ul>
     * <li>['id' => id do usuário]</li>
     * <li>['image' => imagem do usuário]</li>
     * <li>['data_cadastro' => dia de cadastro do usuário]</li>
     * <li>['email' => email do usuário]</li>
     * <li>['nome' => primeiro nome do usuário]</li>
     * <li>['sobrenome' => último nome do usuário]</li>
     * <li>['apelido' => apelido do usuário]</li>
     * </ul>
     * @return array|boolean recupera um conjunto de array com informações sobre os alunos ou false em caso de falha no banco
     */
    public function getAlunos() {
        try {
            $stmt = $this->connection->prepare('SELECT usuario.*,aluno.* FROM aluno,usuario WHERE usuario.usu_id=aluno.alu_id AND aluno.idTurma=:idturma');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            $stmt->execute();
            $lista = array();
            while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $imageurl = $result['Path_imguser'];
                
                if ($imageurl != null && $imageurl != '') {
                    $imageurl = $imageurl . '?=' . rand();
                } else {
                    $imageurl = 'images/userdefault.png';
                }
                $lista[] = array('id' => $result['usu_id'], 'image' => $imageurl, 'data_cadastro' => date("d/m/Y", strtotime($result['dia_cadastro'])), 'email' => $result['email'], 'nome' => $result['usu_fname'], 'sobrenome' => $result['usu_lname'], 'apelido' => $result['usu_nickname']);
            }
            return $lista;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre as solicitações, onde cada posição possui:
     * <ul>
     * <li>['image' => Imagem do Perfil do usuário]</li>
     * <li>['data_cadastro' => Dia de cadastro do usuário]</li>
     * <li>['email' => Email do usuário]</li>
     * <li>['nome' => Primeiro nome do usuário]</li>
     * <li>['sobrenome' => Último nome do usuário]</li>
     * <li>['apelido' => Apelido do usuário]</li>
     * <li>['id' => Id da solicitação]</li>
     * </ul>
     * @return array|false returna um conjunto de array com informações sobre solicitações ou false em caso de falha no banco
     */
    public function getSolicitacoes() {
        try {

            $stmt = $this->connection->prepare('SELECT usuario.* ,idsolicitacao FROM solicitacao,usuario WHERE usuario.usu_id=solicitacao.Aluno_alu_id AND solicitacao.Turma_idTurma=:idturma');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $imageurl = $result['Path_imguser'];

                    if ($imageurl != null && $imageurl != '') {
                        $imageurl = $imageurl . '?=' . rand();
                    } else {
                        $imageurl = 'images/userdefault.png';
                    }

                    $lista[] = array('image' => $imageurl, 'data_cadastro' => $result['dia_cadastro'], 'email' => $result['email'], 'nome' => $result['usu_fname'], 'sobrenome' => $result['usu_lname'], 'apelido' => $result['usu_nickname'], 'id' => $result['idsolicitacao']);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre a turma,que possui:
     * <ul>
     * <li>['disciplina_nome' => Nome da disciplina]</li>
     * <li>['curso_nome' => nome do curso]</li>
     * <li>['curso_sigla' => sigla do curso]</li>
     * <li>['instituicao_nome' => nome de instituição]</li>
     * <li>['instituicao_uf' => sigla do estado da instituição]</li>
     * <li>['professor_email' => email do professor]</li>
     * <li>['professor_nome' => nome do professor]</li>
     * <li>['professor_sobrenome' => sobrenome de professor]</li>
     * <li>['professor_apelido' => apelido de professor]</li>
     * <li>['total_alunos' => total de alunos]</li>
     * <li>['total_atividades' => total de atividades]</li>
     * <li>['total_solicitacoes' => total de solicitações]</li>
     * </ul>
     * @return array|false returna um array com informações sobre turma ou false em caso de falha no banco
     */
    public function getDescricaoTurma() {
        try {
            $result = $this->resultSQL('SELECT usuario.*,disciplina.*,curso.*,instituicao.* FROM usuario,turma,disciplina,curso,instituicao WHERE turma.idTurma=:idturma AND disciplina.disc_id=turma.disc_id AND curso.cur_id=disciplina.cur_id AND instituicao.inst_id=curso.inst_id AND turma.prof_id=usuario.usu_id;');
            $infos = array
                (
                'disciplina_nome' => utf8_encode($result['disc_nome']),
                'curso_nome' => utf8_encode($result['cur_nome']),
                'curso_sigla' => $result['cur_sigla'],
                'instituicao_nome' => utf8_encode($result['inst_nome']),
                'instituicao_uf' => $result['inst_uf'],
                'professor_email' => $result['email'],
                'professor_nome' => $result['usu_fname'],
                'professor_sobrenome' => $result['usu_fname'],
                'professor_apelido' => $result['usu_nickname']
            );
            $dadoAlunos = $this->resultSQL('SELECT count(aluno.alu_id) AS total_alunos FROM aluno WHERE aluno.idTurma=:idturma');
            $dadoAtividades = $this->resultSQL('SELECT count(atividade.atv_id) AS total_atividades FROM atividade WHERE atividade.idTurma=:idturma');
            $dadoSolicitacoes = $this->resultSQL('SELECT count(solicitacao.idsolicitacao) AS total_solicitacoes FROM solicitacao WHERE solicitacao.Turma_idTurma=:idturma');

            $infos['total_alunos'] = $dadoAlunos['total_alunos'];
            $infos['total_atividades'] = $dadoAtividades['total_atividades'];
            $infos['total_solicitacoes'] = (int) $dadoSolicitacoes['total_solicitacoes'];

            return $infos;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o total de tópicos vinculados com a turma
     * @return integer|boolean retorna o total ou false em caso de falha no banco
     */
    public function getTotalTopicos() {
        try {
            $stmt = $this->connection->prepare('SELECT count(top_id) AS total FROM topico WHERE `Turma_idTurma`=:idturma');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return (int) $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o Arquivo do Plano de Ensino
     * @return boolean|\BinaryFile o Objeto com as informações e o Arquivo do Plano de Ensino
     */
    public function getBlobPlanoEnsino() {
        try {
            $stmt = $this->connection->prepare(
                      'SELECT f.* FROM turma t '
                    . 'INNER JOIN file f ON f.id = t.id_file_plano_de_ensino '
                    . 'WHERE f.id=:id AND t.idTurma=:idTurma');
            $stmt->bindValue(':id', $this->idfile, PDO::PARAM_INT);
            $stmt->bindValue(':idTurma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $id = $name = $size = $type = $content = null;
                $stmt->bindColumn("name", $name, PDO::PARAM_STR);
                $stmt->bindColumn("size", $size, PDO::PARAM_STR);
                $stmt->bindColumn("type", $type, PDO::PARAM_STR);
                $stmt->bindColumn("content", $content, PDO::PARAM_LOB);
                $stmt->bindColumn("id", $id, PDO::PARAM_INT);
                $stmt->fetch(PDO::FETCH_BOUND);
                return new BinaryFile($id, $name, $size, $type, $content);
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Remove o Plano de Ensino
     * @return boolean reotnra se foi possível realizar a operação no banco de dados
     */
    public function deletePlanoEnsino() {
        try {
            $this->connection->beginTransaction();
            if ($this->idfile != null) {
                $stmt = $this->connection->prepare('DELETE FROM file WHERE id=:id');
                $stmt->bindParam(':id', $this->idfile, PDO::PARAM_INT);

                if (!$stmt->execute()) {
                    $this->connection->rollBack();
                    return false;
                }

                $stmt = $this->connection->prepare('UPDATE turma SET id_file_plano_de_ensino = NULL WHERE idTurma=:id');
                $stmt->bindParam(':id', $this->idturma, PDO::PARAM_INT);

                if ($stmt->execute()) {
                    return $this->connection->commit();
                } else {
                    $this->connection->rollBack();
                }
            }
        } catch (Exception $ex) {
            if ($this->connection->inTransaction()) {
                $this->connection->rollBack();
            }
            echo $ex->getMessage();
        }
        return false;
    }

    /**
     * Insere um novo Plano de Ensino para a turma
     * @param array $file array de arquivo retornado pelo form post input file
     * @return boolean retorna se a operação foi realizada com sucesso
     */
    public function novoPlanoEnsino($file) {
        try {
            $this->connection->beginTransaction();

            if ($this->idfile != null) {
                $stmt = $this->connection->prepare('DELETE FROM file WHERE id=:id');
                $stmt->bindParam(':id', $this->idfile, PDO::PARAM_INT);

                if (!$stmt->execute()) {
                    $this->connection->rollBack();
                    return false;
                }

                $stmt = $this->connection->prepare('UPDATE turma SET id_file_plano_de_ensino = NULL WHERE idTurma=:id');
                $stmt->bindParam(':id', $this->idturma, PDO::PARAM_INT);

                if (!$stmt->execute()) {
                    $this->connection->rollBack();
                    return false;
                }
            }
            $fileName = $file['name'];
            $tmpName = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileType = $file['type'];

            $content = file_get_contents($tmpName);
            $stmt = $this->connection->prepare('INSERT INTO file(name,size,type,content) VALUES (:name,:size,:type,:content)');
            $stmt->bindParam(':name', $fileName, PDO::PARAM_STR);
            $stmt->bindParam(':size', $fileSize, PDO::PARAM_STR);
            $stmt->bindParam(':type', $fileType, PDO::PARAM_STR);
            $stmt->bindParam(':content', $content, PDO::PARAM_LOB);
            if (!$stmt->execute()) {
                $this->connection->rollBack();
                return false;
            }
            $lastId = $this->connection->lastInsertId();
            $stmt = $this->connection->prepare('UPDATE turma SET id_file_plano_de_ensino = :idfile WHERE idTurma=:id');
            $stmt->bindParam(':id', $this->idturma, PDO::PARAM_INT);
            $stmt->bindParam(':idfile', $lastId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return $this->connection->commit();
            } else {
                $this->connection->rollBack();
            }
            
        } catch (Exception $ex) {
            if ($this->connection->inTransaction()) {
                $this->connection->rollBack();
            }
            echo $ex->getMessage();
        }
        return false;
    }

    /**
     * Insere um novo material didático
     * @param string $titulo titulo do material
     * @param string $detalhes informações sobre o material
     * @param array $file array de arquivo retornado pelo form post input file
     * @return MaterialDidatico|boolean retorna um Objeto com as informações do Material Didático ou false caso ocorra alguma falha no banco de dados
     */
    public function novoMaterialDidatico($titulo, $detalhes, $file) {
        try {
            $this->connection->beginTransaction();

            $fileName = $file['name'];
            $tmpName = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileType = $file['type'];

            $content = file_get_contents($tmpName);

            $stmt = $this->connection->prepare('INSERT INTO file(name,size,type,content) VALUES (:name,:size,:type,:content)');
            $stmt->bindParam(':name', $fileName, PDO::PARAM_STR);
            $stmt->bindParam(':size', $fileSize, PDO::PARAM_STR);
            $stmt->bindParam(':type', $fileType, PDO::PARAM_STR);
            $stmt->bindParam(':content', $content, PDO::PARAM_LOB);
            if ($stmt->execute()) {
                $lastfileid = (int) $this->connection->lastInsertId();
                $stmt = $this->connection->prepare('INSERT INTO materialdidatico(rotulo,detalhes,`data`,hora,`Turma_idTurma`,id_file) VALUES (:rotulo,:detalhes,current_date(),current_time(),:idturma,:fileid)');
                $stmt->bindParam(':detalhes', $detalhes, PDO::PARAM_STR);
                $stmt->bindParam(':rotulo', $titulo, PDO::PARAM_INT);
                $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
                $stmt->bindParam(':fileid', $lastfileid, PDO::PARAM_INT);
                if ($stmt->execute()) {
                    $id = (int) $this->connection->lastInsertId();
                    $this->connection->commit();
                    return $this->getMaterial($id);
                } else {
                    $this->connection->rollBack();
                }
            }
        } catch (Exception $ex) {
            if ($this->connection->inTransaction()) {
                $this->connection->rollBack();
            }
            echo $ex->getMessage();
        }
        return false;
    }

    /**
     * Recupera informação sobre Materiais Didáticos
     * @return boolean|\MaterialDidatico um array de objetos com informações sobre o material didático ou false caso ocorra alguma falha no banco de dados
     */
    public function listarMateriaisDidaticos() {
        try {

            $stmt = $this->connection->prepare('SELECT * FROM materialdidatico m INNER JOIN file f ON f.id = m.id_file WHERE m.Turma_idTurma=:idturma ORDER BY idMaterialDidatico DESC');
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $lista = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new MaterialDidatico($result);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informação sobre um Material Didático através de seu $id
     * @param integer $id_material id na tabela Material Didático
     * @return boolean|\MaterialDidatico O objeto com as informações do Material Didático ou false caso ocorra alguma falha no banco de dados
     */
    public function getMaterial($id_material) {
        try {

            $stmt = $this->connection->prepare('SELECT * FROM materialdidatico m INNER JOIN file f ON f.id = m.id_file WHERE m.`idMaterialDidatico`=:id AND m.`Turma_idTurma`=:idturma');
            $stmt->bindParam(':id', $id_material, PDO::PARAM_INT);
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            if ($stmt->execute()) {
                return new MaterialDidatico($stmt->fetch(PDO::FETCH_ASSOC));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Desvincula um aluno da Turma
     * @param integer $id_aluno id na tabela Aluno
     * @return boolean retorna se operação foi realizada com sucesso
     */
    public function desvincularAluno($id_aluno) {
        try {
            $stmt = $this->connection->prepare('UPDATE aluno SET `idTurma`=NULL WHERE alu_id=:id AND `idTurma`=:idturma');
            $stmt->bindParam(':id', $id_aluno, PDO::PARAM_INT);
            $stmt->bindParam(':idturma', $this->idturma, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

}
