<?php

/**
 * Description of ControladorUsuario
 */
use config\Database;

/**
 * Representa um usuário e todas as suas operações, também pode ser utilizada como Entidade
 */
class ControladorUsuario {

    private $connection;
    protected $iduser = -1;
    private $nickname = null;
    private $firstname = null;
    private $lastname = null;
    private $imagepath = null;
    private $email = null;
    private $datacadastro = null;
    private $facebookId = null;
    private $facebookEmail = null;
    private $googleId = null;
    private $googleEmail = null;

    /**
     * Retorna a conexão criada
     * @return PDO
     */
    public function getConnection() {
        return $this->connection;
    }

    public function __construct() {

        try {
            $this->connection = new PDO(
                    'mysql:host=localhost;dbname=' . Database::$mysql_dbname, Database::$mysql_user, Database::$mysql_password
            );
        } catch (PDOException $e) {
            echo '<code>' . $e->getMessage() . '</code>';
            die();
        }
    }

    public function getEmail() {
        return $this->email;
    }

    public function getFacebookEmail() {
        return $this->facebookEmail;
    }

    public function getFacebookId() {
        return $this->facebookId;
    }

    public function getGoogleEmail() {
        return $this->googleEmail;
    }

    public function getGoogleId() {
        return $this->googleId;
    }

    public function getUserId() {
        return $this->iduser;
    }

    public function getTitleName() {
        return $this->getTitleNameBy($this->firstname, $this->lastname, $this->nickname, $this->email);
    }

    public function getMinimalTitleName() {
        return $this->getMinimalTitleNameBy($this->firstname, $this->lastname, $this->nickname, $this->email);
    }

    public function ehProfessor() {
        return !$this->ehAluno();
    }

    public function getAluno() {
        return new Aluno($this->email);
    }

    public function getProfessor() {
        return new Professor($this->email);
    }

    public function getDataFormatadaCadastro() {
        return date("d/m/Y", strtotime($this->datacadastro));
    }

    public function getDataCadastro() {
        return $this->datacadastro;
    }

    public function getNickname() {
        return $this->nickname;
    }

    public function getFirstname() {
        return $this->firstname;
    }

    public function getLastname() {
        return $this->lastname;
    }

    public function getImage() {
        return $this->imagepath;
    }
    
    protected function rollback(){
        if($this->connection->inTransaction()){
            $this->connection->rollBack();
        }
    }
    
    /**
     * Retorna uma string com o nome completo de apresentação para outros usuários
     * @param string $firstname primeiro nome do usuário
     * @param string $lastname último nome do usuário
     * @param string $nickname apelido do usuário
     * @param string $email email do usuário
     * @return string o nome de apresentação do usuário
     */
    public function getTitleNameBy($firstname, $lastname, $nickname, $email) {

        if ($nickname != null && $nickname != '') {
            if ($firstname != null && $firstname != '' && $lastname != null && $lastname != '') {
                $title = $firstname . " '" . $nickname . "' " . $lastname;
            } else {
                $title = $nickname;
            }
        } else if ($firstname != null && $firstname != '') {
            $title = $firstname;
            if ($lastname != null && $lastname != '') {
                $title .= " " . $lastname;
            }
        } else if ($lastname != null && $lastname != '') {
            $title = "Sr(a). " . $lastname;
        } else {
            $title = $email;
        }
        return $title;
    }

    /**
     * Retorna uma string com o nome simples de apresentação para outros usuários
     * @param string $firstname primeiro nome do usuário
     * @param string $lastname último nome do usuário
     * @param string $nickname apelido do usuário
     * @param string $email email do usuário
     * @return string o nome de apresentação do usuário
     */
    public function getMinimalTitleNameBy($firstname, $lastname, $nickname, $email) {

        if ($nickname != null && $nickname != '') {
            $title = $nickname;
        } else if ($firstname != null && $firstname != '') {
            $title = $firstname;
        } else if ($lastname != null && $lastname != '') {
            $title = "Sr(a). " . $lastname;
        } else {
            $title = $email;
        }
        return $title;
    }


    /**
     * Inicializa usuário com o login do Facebook
     * @param integer $idFb id do usuário retornado pela api do Facebook
     * @param string $emailFb email do usuário pela api do Facebook
     * @return boolean retorna se possui algum usuário vinculado a está conta do Facebook
     */
    public function checkLoginFacebook($idFb, $emailFb) {
        try {
            $stmt = $this->connection->prepare('SELECT email FROM usuario WHERE facebook_id_user = :idFb AND facebook_email = :emailFb');
            $stmt->bindValue(':emailFb', $emailFb, PDO::PARAM_STR);
            $stmt->bindValue(':idFb', $idFb, PDO::PARAM_STR);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $dado = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->setUser($dado['email']);
                return true;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Desvincula a conta atual com a sua conta do Facebook, caso tiver
     * @param integer $id id do usuário pelo facebook
     * @param string $email email do usuário pelo facebook
     * @return boolean retorna se foi possível realizar a operação
     */
    public function unbindFacebook($id, $email) {
        try {
            $stmt = $this->connection->prepare(""
                    . "UPDATE usuario "
                    . "SET facebook_id_user = NULL ,facebook_email = NULL "
                    . "WHERE "
                    . "facebook_id_user = :idFb AND "
                    . "facebook_email = :emailFb AND "
                    . "usu_id = :id");
            $stmt->bindParam(':idFb', $id, PDO::PARAM_STR);
            $stmt->bindParam(':emailFb', $email, PDO::PARAM_STR);
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Vincula a conta atual com uma conta do Facebook
     * @param integer $id id do usuário pelo facebook
     * @param string $email email do usuário pelo facebook
     * @return boolean retorna se foi possível realizar a operação
     */
    public function bindFacebook($id, $email) {
        try {
            $stmt = $this->connection->prepare("UPDATE usuario SET facebook_id_user =:idFb ,facebook_email = :emailFb WHERE usu_id = :id");
            $stmt->bindParam(':idFb', $id, PDO::PARAM_STR);
            $stmt->bindParam(':emailFb', $email, PDO::PARAM_STR);
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Inicializa usuário com o login da conta Google
     * @param integer $idGg id do usuário retornado pela api da conta Google
     * @param string $emailGg email do usuário pela api da conta Google
     * @return boolean retorna se possui algum usuário vinculado a está conta doa conta Google
     */
    public function checkLoginGoogle($idGg, $emailGg) {
        try {
            $stmt = $this->connection->prepare('SELECT email FROM usuario WHERE google_id_user = :idGg AND google_email = :emailGg');
            $stmt->bindValue(':emailGg', $emailGg, PDO::PARAM_STR);
            $stmt->bindValue(':idGg', $idGg, PDO::PARAM_STR);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $dado = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->setUser($dado['email']);
                return true;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Desvincula a conta atual com a conta do Google, caso tiver
     * @param integer $id id do usuário pela conta do Google
     * @param string $email email do usuária conta do Google
     * @return boolean retorna se foi possível realizar a operação
     */
    public function unbindGoogle($id, $email) {
        try {
            $stmt = $this->connection->prepare(""
                    . "UPDATE usuario "
                    . "SET google_id_user = NULL ,google_email = NULL "
                    . "WHERE "
                    . "google_id_user = :idGg AND "
                    . "google_email = :emailGg AND "
                    . "usu_id = :id");
            $stmt->bindParam(':idGg', $id, PDO::PARAM_STR);
            $stmt->bindParam(':emailGg', $email, PDO::PARAM_STR);
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Vincula a conta atual com uma conta do Google
     * @param integer $id id do usuário pela conta do Google
     * @param string $email email do usuário pela conta do Google
     * @return boolean retorna se foi possível realizar a operação
     */
    public function bindGoogle($id, $email) {
        try {
            $stmt = $this->connection->prepare("UPDATE usuario SET google_id_user =:idGg ,google_email = :emailGg WHERE usu_id = :id");
            $stmt->bindParam(':idGg', $id, PDO::PARAM_STR);
            $stmt->bindParam(':emailGg', $email, PDO::PARAM_STR);
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Cadastra um novo usuário, nunca deve ser utilizado publicamente (private scope)
     * @param string $email email informado pelo usuário
     * @param string $senha senha (não criptografada) informada pelo usuário
     * @param string $nickname apelido informado pelo usuário
     * @param string $firstname primeiro nome informado pelo usuário
     * @param string $lastname último nome informado pelo usuário
     * @param array $facebook com [email=>"Email da Conta do facebook"] e [idFb=>"Com ID da conta do Facebook"]
     * @param array $google com [email=>"Email da Conta do google"] e [idFb=>"Com ID da conta do Google"]
     * @return boolean retorna se a operação do banco de dados, foi realizado com sucesso
     */
    private function cadastrarUsuario($email, $senha, $nickname, $firstname, $lastname, $facebook, $google) {
        try {
            $stmt = $this->connection->prepare(
                    "INSERT INTO usuario(email,senha,usu_fname,usu_lname,usu_nickname, dia_cadastro,facebook_email,facebook_id_user,google_email,google_id_user) "
                    . "VALUES (:email,MD5(:senha),:fname,:lname,:nick, current_date(),:emailFb,:idFb,:emailGg,:idGg)");
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':senha', $senha, PDO::PARAM_STR);
            $stmt->bindParam(':nick', $nickname, PDO::PARAM_STR);
            $stmt->bindParam(':lname', $lastname, PDO::PARAM_STR);
            $stmt->bindParam(':fname', $firstname, PDO::PARAM_STR);
            if ($facebook) {
                $stmt->bindParam(':emailFb', $facebook['email'], PDO::PARAM_STR);
                $stmt->bindParam(':idFb', $facebook['idFb'], PDO::PARAM_STR);
            } else {
                $stmt->bindValue(':emailFb', NULL, PDO::PARAM_INT);
                $stmt->bindValue(':idFb', NULL, PDO::PARAM_INT);
            }
            if ($google) {
                $stmt->bindParam(':emailGg', $google['email'], PDO::PARAM_STR);
                $stmt->bindParam(':idGg', $google['idGg'], PDO::PARAM_STR);
            } else {
                $stmt->bindValue(':emailGg', NULL, PDO::PARAM_INT);
                $stmt->bindValue(':idGg', NULL, PDO::PARAM_INT);
            }
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Cadastra um novo usuário Aluno
     * @param string $email email informado pelo usuário
     * @param string $senha senha (não criptografada) informada pelo usuário
     * @param string $nickname apelido informado pelo usuário
     * @param string $firstname primeiro nome informado pelo usuário
     * @param string $lastname último nome informado pelo usuário
     * @param array $facebook com [email=>"Email da Conta do facebook"] e [idFb=>"Com ID da conta do Facebook"]
     * @param array $google com [email=>"Email da Conta do google"] e [idFb=>"Com ID da conta do Google"]
     * @return boolean retorna se a operação do banco de dados, foi realizado com sucesso
     */
    public function cadastrarAluno($email, $senha, $nickname, $firstname, $lastname, $facebook, $google) {
        try {
            $this->connection->beginTransaction();

            if ($this->cadastrarUsuario($email, $senha, $nickname, $firstname, $lastname, $facebook, $google)) {
                $id = $this->connection->lastInsertId();
                $stmt = $this->connection->prepare("INSERT INTO aluno(alu_id) VALUES (:id)");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $this->iduser = $id;
                return $stmt->execute() && $this->connection->commit();
            }
        } catch (PDOException $e) {
            $this->rollback();
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Cadastra um novo usuário Professor
     * @param string $email email informado pelo usuário
     * @param string $senha senha (não criptografada) informada pelo usuário
     * @param string $nickname apelido informado pelo usuário
     * @param string $firstname primeiro nome informado pelo usuário
     * @param string $lastname último nome informado pelo usuário
     * @param array $facebook com [email=>"Email da Conta do facebook"] e [idFb=>"Com ID da conta do Facebook"]
     * @param array $google com [email=>"Email da Conta do google"] e [idFb=>"Com ID da conta do Google"]
     * @return boolean retorna se a operação do banco de dados, foi realizado com sucesso
     */
    public function cadastrarProfessor($email, $senha, $nickname, $firstname, $lastname, $facebook, $google) {
        try {
            $this->connection->beginTransaction();
            if ($this->cadastrarUsuario($email, $senha, $nickname, $firstname, $lastname, $facebook, $google)) {
                $id = $this->connection->lastInsertId();
                $stmt = $this->connection->prepare("INSERT INTO professor(prof_id) VALUES (:id)");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $this->iduser = $id;
                if($stmt->execute()) {
                    return $this->connection->commit();
                } else {
                    $this->rollback();
                }
            }
        } catch (PDOException $e) {
            $this->rollback();
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Altera a senha do usuário
     * @param string $new a nova senha (não criptografada)
     * @return boolean retorna se a operação do banco de dados, foi realizado com sucesso
     */
    public function changePassword($new) {

        try {
            $stmt = $this->connection->prepare("UPDATE usuario SET senha = MD5(:new) WHERE usu_id = :id");
            $stmt->bindParam(':new', $new, PDO::PARAM_STR);
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Verifica se possui algum usuário cadastrado com o e-mail
     * @param string $email E-mail do usuário
     * @return boolean retorna se a operação do banco de dados foi realizado com sucesso
     */
    public function checkEmail($email) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM usuario WHERE email=:email');
            $stmt->bindParam(':email', $email, PDO::PARAM_INT);
            return $stmt->execute() && $stmt->rowCount() != 0;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera detalhes sobre o Arquivo de Atividade por meio do seu $id do arquivo no banco de dado.<br/>
     * <b>Observação</b>: Retorna se o usuário tem permissão para visualizar o arquivo, <br/>
     * ou nulo caso ele não tenha acesso a atividade, ou o arquivo for de outro usuário <br/>
     * que não for o professor da disciplina<br/>
     * @param integer $id id na tabela 'arquivo'
     * @return Arquivo|false O objeto com as informações do arquivo de atividade, ou false caso ocorra alguma falha no banco de dados
     */
    public function getArquivo($id) {
        try {
            $stmt = $this->connection->prepare('SELECT a.*,f.name as filename,f.size,f.type FROM arquivo a INNER JOIN file f ON a.id_file = f.id WHERE a.arq_id=:id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $arquivo = new Arquivo($stmt->fetch(PDO::FETCH_ASSOC));

                $stmt2 = $this->connection->prepare('SELECT usu_fname,usu_lname,usu_nickname,email FROM usuario WHERE usu_id=:id');
                $idusuario = $arquivo->getIduser();
                $stmt2->bindParam(':id', $idusuario, PDO::PARAM_INT);
                $stmt2->execute();
                $aluno = $stmt2->fetch(PDO::FETCH_ASSOC);

                $arquivo->setTitleAluno($this->getTitleNameBy($aluno['usu_fname'], $aluno['usu_lname'], $aluno['usu_nickname'], $aluno['email']));
                return $arquivo;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Inicializa atributos do controlador com as informações obtidas no banco de dados
     * @param array $result fetch realizado pelo controlador
     */
    public function initUser($result) {
        $this->email = $result['email'];
        $this->iduser = $result['usu_id'];
        $this->firstname = $result['usu_fname'];
        $this->lastname = $result['usu_lname'];
        $this->nickname = $result['usu_nickname'];
        $this->datacadastro = $result['dia_cadastro'];
        $this->imagepath = $result['Path_imguser'];

        $this->facebookId = $result['facebook_id_user'];
        $this->facebookEmail = $result['facebook_email'];

        $this->googleId = $result['google_id_user'];
        $this->googleEmail = $result['google_email'];
    }

    /**
     * Inicializa o usuário com as informações da conta, obtida através do $email
     * @param string $email email cadastrado previamente pelo usuário
     * @return boolean Se o usuário foi encontrado
     */
    public function setUser($email) {
        try {
            $stmt = $this->connection->prepare('select * FROM usuario WHERE email=:email;');
            $stmt->bindValue(':email', $email, PDO::PARAM_STR);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->initUser($result);
                return true;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Verificca o email e a senha está correta 
     * @param string $email email informado pelo usuário
     * @param string $password senha (não criptografada) informado pelo usuário
     * @return boolean se o email e senha está correta
     */
    public function checkAcess($email, $password) {
        try {
            $stmt = $this->connection->prepare('SELECT MD5(:password)=(SELECT usuario.senha FROM usuario WHERE usuario.email=:email) as access');
            $stmt->bindValue(':email', $email, PDO::PARAM_STR);
            $stmt->bindValue(':password', $password, PDO::PARAM_STR);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $dado = $stmt->fetch(PDO::FETCH_ASSOC);
                return $dado['access'] == '1';
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Atualiza o perfil
     * @param string $nickname apelido informado pelo usuário
     * @param string $firstname primeiro nome informado pelo usuário
     * @param string $lastname último nome informado pelo usuário
     * @return boolean retorna se a operação foi realizada com sucesso no banco de dados
     */
    public function updateUser($nickname, $firstname, $lastname) {
        try {
            $stmt = $this->connection->prepare('UPDATE `usuario` SET `usu_fname` = :fname, `usu_lname` = :lname, `usu_nickname` = :nickname WHERE `usuario`.`usu_id` = :iduser ');
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmt->bindParam(':nickname', $nickname, PDO::PARAM_STR);
            $stmt->bindParam(':fname', $firstname, PDO::PARAM_STR);
            $stmt->bindParam(':lname', $lastname, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Atualiza o caminho relativo da imagem de perfil do usuário
     * @param string $path caminho relativo da imagem
     * @return boolean retorna se a operação foi realizada com sucesso no banco de dados
     */
    public function setImage($path) {

        try {
            $stmt = $this->connection->prepare('UPDATE `usuario` SET `Path_imguser` = :path WHERE `usuario`.`usu_id` = :iduser');
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmt->bindParam(':path', $path, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informação sobre a Resposta de Tópico
     * @param integer $id id na tabela 'resposta'
     * @return boolean|Resposta objeto com informações da Resposta
     */
    public function getResposta($id) {
        try {
            $stmt = $this->connection->prepare(
                    "SELECT * FROM resposta,topico,usuario "
                    . "WHERE resposta.resp_id=:id "
                    . "AND topico.top_id = resposta.top_id "
                    . "AND usuario.usu_id = resposta.usu_id ");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return new Resposta($result);
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
        }
        return false;
    }

    /**
     * Lista respostas do usuário á tópicos
     * @return array<Resposta> objeto com informações da Resposta
     */
    public function listarRespostasDoUsuario() {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM resposta,topico,usuario WHERE usuario.usu_id = topico.usu_id and topico.top_id = resposta.top_id and resposta.usu_id=:id ORDER BY topico.top_id, resposta.`data`, resposta.`hora`");
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $saida = array();
                $i = 0;
                $j = -1;
                $ant = null;
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    if ($ant == null || $result['top_id'] != $ant['top_id']) {
                        $ant = $result;
                        $j++;
                        $i = 0;
                        $saida[$j] = array();
                    }
                    $saida[$j][$i] = new Resposta($result);
                    $saida[$j][$i]->setVotosPositivos($this->getTotalVotosPositivos($saida[$j][$i]->getId()));
                    $saida[$j][$i]->setVotosNegativos($this->getTotalVotosNegativos($saida[$j][$i]->getId()));
                    $saida[$j][$i]->setVoto($this->getVoto($saida[$j][$i]->getId()));
                    $i++;
                }

                return $saida;
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
        }
        return null;
    }

    /**
     * Lista respostas de todos usuários a um tópico
     * @param integer $id id do tópico
     * @return array<Resposta> objeto com informações da Resposta
     */
    public function listarRespotasAoTopico($id) {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM resposta,usuario WHERE top_id=:id AND resposta.usu_id=usuario.usu_id ORDER BY resposta.`data`, resposta.`hora`");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $saida = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $resposta = new Resposta($result);
                    $resposta->setVotosPositivos($this->getTotalVotosPositivos($resposta->getId()));
                    $resposta->setVotosNegativos($this->getTotalVotosNegativos($resposta->getId()));
                    $resposta->setVoto($this->getVoto($resposta->getId()));
                    $saida[] = $resposta;
                }
                return $saida;
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
        }
        return null;
    }

    /**
     * Remove a resposta através do seu $id, se o usuário for o autor da resposta
     * @param integer $id id na tabela 'resposta'
     * @return boolean retorna se operação foi realizada com sucesso no banco de dados
     */
    public function removerResposta($id) {
        try {
            $this->connection->beginTransaction();
            $stmt = $this->connection->prepare('DELETE FROM voto WHERE Resposta_resp_id = :id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            if(!$stmt->execute()){
                $this->connection->rollBack();
                return false;
            }
            
            $stmt = $this->connection->prepare('DELETE FROM resposta WHERE resp_id=:id AND usu_id = :iduser');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            if(!$stmt->execute()){
                $this->connection->rollBack();
                 return false;
            }
            
            return $this->connection->commit();
        } catch (PDOException $e) {
            if($this->connection->inTransaction()){
                $this->connection->rollBack();
            }
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Insere uma nova resposta ao tópico
     * @param integer $id id do tópico na tabela
     * @param string $texto texto com a resposta
     * @return boolean|Resposta retorna se operação foi realizada com sucesso no banco de dados com o Objeto com informações da Resposta
     */
    public function novaRespostaAoTopico($id, $texto) {
        try {
            $this->connection->beginTransaction();
            $stmt = $this->connection->prepare('INSERT INTO resposta (`resp_texto`, `top_id`, `usu_id`,`data`,`hora`) VALUES (:texto,:idtop,:id,current_date(), current_time());');
            $stmt->bindParam(':idtop', $id, PDO::PARAM_INT);
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
            $stmt->bindParam(':texto', $texto, PDO::PARAM_STR);
            if ($stmt->execute()) {
                $lastid = $this->connection->lastInsertId();
                $this->connection->commit();
                return $this->getResposta($lastid);
            } else {
                $this->rollback();
            }
        } catch (PDOException $e) {
            $this->rollback();
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Retorna detalhes sobre o tópico através do seu $id
     * @param integer $id na tabela tópico
     * @return boolean|Topico Objeto com os detalhes do Tópico, ou false caso o Tópico não foi encontrado
     */
    public function getTopico($id) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM topico,usuario WHERE top_id=:id AND topico.usu_id=usuario.usu_id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                return new Topico($stmt->fetch(PDO::FETCH_ASSOC));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Cria um novo tópico
     * @param string $assunto titulo do tópico informado pelo usuário
     * @param string $texto texto do típico informado pelo usuário
     * @param boolean $particular informa se o tópico é visível somente para turma
     * @param boolean $anonimo informa se o autor será informado a outros usuários
     * @param boolean $report informa se é um tópico apontando falhas no sistema
     * @param integer|null $idturma turma no qual será vinculado a tópico
     * @return boolean|inteiro retorna se operação foi realizada com sucesso no banco de dados com o id do Tópico criado
     */
    public function novoTopico($assunto, $texto, $particular, $anonimo, $report, $idturma) {
        try {
            $this->connection->beginTransaction();
            $stmt = $this->connection->prepare(
                    'INSERT INTO topico(usu_id,top_assunto,topico_texto, data, hora,Turma_idTurma,visible_only_by_class,anonimo,report) VALUES '
                    . '(:iduser,:topassunto,:toptexto, current_date(), current_time(),:idturma,:particular,:anonimo,:report)');
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmt->bindParam(':topassunto', $assunto, PDO::PARAM_STR);
            $stmt->bindParam(':toptexto', $texto, PDO::PARAM_STR);
            $stmt->bindParam(':idturma', $idturma, $idturma != null ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $stmt->bindParam(':particular', $particular, PDO::PARAM_BOOL);
            $stmt->bindParam(':anonimo', $anonimo, PDO::PARAM_BOOL);
            $stmt->bindParam(':report', $report, PDO::PARAM_BOOL);
            if ($stmt->execute()) {
                $lastId = $this->connection->lastInsertId();
                $this->connection->commit();
                return $lastId;
            } else {
                $this->rollback();
            }
        } catch (PDOException $e) {
            $this->rollback();
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Atualiza informações sobre o tópico, se o usuário for o autor dele
     * @param integer $id do tópico a ser atualizado
     * @param string $titulo titulo do tópico informado pelo usuário
     * @param string $texto texto do típico informado pelo usuário
     * @param boolean $particular informa se o tópico é visível somente para turma
     * @param boolean $report informa se é um tópico apontando falhas no sistema
     * @param boolean $anonimo informa se o autor será informado a outros usuários
     * @param integer|null $idturma turma no qual será vinculado a tópico
     * @return boolean retorna se operação foi realizada com sucesso no banco de dados
     */
    public function updateTopico($id, $titulo, $texto, $particular, $report, $anonimo, $idturma) {
        try {
            $stmt = $this->connection->prepare('UPDATE topico SET `Turma_idTurma`=:idturma,`visible_only_by_class`=:particular,`report`=:report,`anonimo`=:anonimo,`top_assunto`=:title, `topico_texto`=:texto, `data`=current_date(), `hora`=current_time() WHERE `top_id`=:id AND `usu_id`=:iduser;');

            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':title', $titulo, PDO::PARAM_STR);
            $stmt->bindParam(':texto', $texto, PDO::PARAM_STR);
            $stmt->bindParam(':idturma', $idturma, $idturma != null ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $stmt->bindParam(':particular', $particular, PDO::PARAM_BOOL);
            $stmt->bindParam(':report', $report, PDO::PARAM_BOOL);
            $stmt->bindParam(':anonimo', $anonimo, PDO::PARAM_BOOL);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Remove tópico, e suas Resposta, e seus respectivos votos
     * @param integer $idtopico id do tópico
     * @return boolean retorna se operação foi realizada com sucesso no banco de dados
     */
    public function deleteTopico($idtopico) {
        try {
            
            $stmtSelect = $this->connection->prepare('SELECT resp_id FROM resposta WHERE top_id=:id');
            $stmtSelect->bindParam(':id', $idtopico, PDO::PARAM_INT);
            
            if($stmtSelect->execute()){
                $this->connection->beginTransaction();
                while($fetch = $stmtSelect->fetch(PDO::FETCH_ASSOC)) {
                    $idResp = (int)$fetch['resp_id'];
                    $stmtVoto = $this->connection->prepare('DELETE FROM voto WHERE Resposta_resp_id = :id');
                    $stmtVoto->bindParam(':id', $idResp, PDO::PARAM_INT);
                    if(!$stmtVoto->execute()){
                        echo "Error ao remover voto ".$idResp;
                        $this->connection->rollBack();
                        return false;
                    }
                }
                       
                $stmtResp = $this->connection->prepare('DELETE FROM resposta WHERE top_id = :id');
                $stmtResp->bindParam(':id', $idtopico, PDO::PARAM_INT);
                if(!$stmtResp->execute()){
                    echo "Error ao remover resposta ".$idResp;
                    $this->connection->rollBack();
                    return false;
                }
                    
                $stmtDelete = $this->connection->prepare('DELETE FROM topico WHERE `top_id`=:id AND `usu_id`=:iduser');
                $stmtDelete->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
                $stmtDelete->bindParam(':id', $idtopico, PDO::PARAM_INT);
                if(!$stmtDelete->execute()){
                    echo "Error ao remover tópico ".$idResp;
                    $this->connection->rollBack();
                     return false;
                } 
                return $this->connection->commit();
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            if($this->connection->inTransaction()){
                $this->connection->rollBack();
            }
        }
        return false;
    }

    /*
     * Recupera a informações de todas as turmas do sistema
     * @return Array<Turma> Array de Objeto com as informação da Turma
     */
    public function listarTodasTurmas() {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM turma");
            if ($stmt->execute()) {
                $saida = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $saida[] = new Turma($result);
                }
                return $saida;
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
        }
        return null;
    }

    /**
     * Retorna se o usuário é Aluno
     * @return boolean|null true ou false indicando que o usuário é ou não um Aluno, ou null caso ocorra algum erro no sistema
     */
    public function ehAluno() {
        try {
            $stmt = $this->connection->prepare('select alu_id from aluno where :iduser=aluno.alu_id;');
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            return $stmt->execute() && $stmt->rowCount() == 1;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return null;
    }

    /**
     * Recupera a total de respostas de qualquer usuário a especifico um tópico
     * @param integer $id_topico id do tópico
     * @return int o total ou false caso ocorra alguma falha no banco de dados
     */
    public function getTotalRespostaTopico($id_topico) {
        try {
            $stmt = $this->connection->prepare('SELECT count(resp_id) AS total FROM resposta WHERE top_id=:id');
            $stmt->bindParam(':id', $id_topico, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return (int) $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Atualiza o texto da resposta á um tópico qualquer
     * @param integer $id_resposta id na tabela resposta
     * @param string $text texto da resposta
     * @return boolean se operação foi realizada com sucesso
     */
    public function updateResposta($id_resposta, $text) {
        try {
            $stmt = $this->connection->prepare('UPDATE resposta SET `resp_texto`=:texto, `data`=current_date(), `hora`=current_time() WHERE `resp_id`=:id AND `usu_id`=:iduser');
            $stmt->bindParam(':id', $id_resposta, PDO::PARAM_INT);
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmt->bindParam(':texto', $text, PDO::PARAM_STR);
            if ($stmt->execute()) {
                return $this->getResposta($id_resposta);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Lista um certa quantidade de tópicos (ordenada por data) que não são visiveis somente para a turma
     * @param integer $ini posição onde começa os tópicos
     * @param integer $quantidade quantidade de tópicos selecionados a partir da posição ini
     * @return array<Topico> Objeto com as informações do Tópico
     */
    public function listarTopicosPublicos($ini, $quantidade) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM topico,usuario WHERE topico.usu_id = usuario.usu_id and visible_only_by_class=false ORDER BY data DESC,hora DESC LIMIT :ini,:fim ');
            $stmt->bindParam(':ini', $ini, PDO::PARAM_INT);
            $stmt->bindParam(':fim', $quantidade, PDO::PARAM_INT);
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
        return null;
    }

    /**
     * Lista um certa quantidade de tópicos (ordenada por data) que não são visiveis somente para a turma<br/>
     * e o titulo possui a palavra $chave
     * @param integer $ini posição onde começa os tópicos
     * @param integer $quantidade quantidade de tópicos selecionados a partir da posição ini
     * @param string $chave palavra chave a ser buscada no titulo dos tópicos
     * @return array<Topico> Array de Objeto com as informações dos Tópicos
     */
    public function buscarTopicosPublicos($ini, $quantidade, $chave) {
        try {
            $palavra_chave_stmt = "%$chave%";
            $stmt = $this->connection->prepare("SELECT * FROM topico,usuario WHERE usuario.usu_id = topico.usu_id and topico.top_assunto like :chave AND topico.visible_only_by_class=false  ORDER BY data DESC,hora DESC LIMIT :ini,:fim ");
            $stmt->bindParam(':ini', $ini, PDO::PARAM_INT);
            $stmt->bindParam(':fim', $quantidade, PDO::PARAM_INT);
            $stmt->bindParam(':chave', $palavra_chave_stmt, PDO::PARAM_STR);
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
        return null;
    }

    /**
     * Recupera o total de arquivos que o usuário possuem em todas atividades
     * @return string|boolean Um string com o numero/total de arquivos, ou false em caso de falha no banco 
     */
    public function getTotalArquivos() {
        try {
            $stmt = $this->connection->prepare('SELECT COUNT(*) AS total FROM arquivo WHERE arquivo.idusuario=:iduser');
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);

            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o total de quantas vezes o usuário respondeu á tópicos 
     * @return string o total
     */
    public function getTotalRespostaDoUsuario() {
        $total = 0;
        try {
            $stmt = $this->connection->prepare('SELECT count(resp_id) AS total FROM resposta WHERE usu_id=:id');
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                $total = (int) $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return $total;
    }

    /**
     * Recupera o total de tópicos que o usuário tem
     * @return int o total
     */
    public function getTotalTopicosDoUsuario() {
        try {
            $stmt = $this->connection->prepare('SELECT count(top_id) AS total FROM topico WHERE usu_id=:id');
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return (int) $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return 0;
    }

    /**
     * Recupera o total de tópicos que não são somente visiveis para a turma
     * @return int o total
     */
    public function getTotalTopicosPublicos() {
        try {
            $stmt = $this->connection->prepare('SELECT count(top_id) AS total FROM topico WHERE visible_only_by_class=false');
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return (int) $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return 0;
    }

    /**
     * Lista o totais de tópicos no qual o usuário é o autor
     * @param integer $ini posição no qual começa a ser listado o tópico
     * @param integer $quantidade total de tópicos a serem retotados
     * @return array<Topico> Array de Objetos com todas informações do tópico, ou null caso de falha no banco
     */
    public function listarTopicosDoUsuario($ini, $quantidade) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM topico WHERE topico.usu_id = :id ORDER BY data DESC,hora DESC LIMIT :ini,:fim ');
            $stmt->bindParam(':ini', $ini, PDO::PARAM_INT);
            $stmt->bindParam(':fim', $quantidade, PDO::PARAM_INT);
            $stmt->bindParam(':id', $this->iduser, PDO::PARAM_INT);
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
        return null;
    }

    /**
     * Lista informações sobre todas as estruturas de dados cadastradas no banco de dados
     * @return Array<EstruturaDeDados> ou null
     */
    public function listarEstruturas() {
        try {
            $stmt = $this->connection->prepare('select * from estrutura_de_dado');
            if ($stmt->execute()) {
                $lista = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new EstruturaDeDados($row);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return null;
    }

    /**
     * Verifica se o usuário é dono do arquivo, e remove o registro e o arquivo do banco de dados
     * @param integer $id_arquivo id do arquivo
     * @return boolean true se o arquivo foi removido com sucesso, ou falso caso contrário 
     */
    public function deletarArquivo($id_arquivo) {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM arquivo WHERE `arq_id`=:idarq AND `idusuario`=:iduser');
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmt->bindParam(':idarq', $id_arquivo, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fetch = $stmt->fetch(PDO::FETCH_ASSOC);
                $idfile = $fetch['id_file'];
                $this->connection->beginTransaction();
                $stmt = $this->connection->prepare('DELETE FROM arquivo WHERE `arq_id`=:idarq');
                $stmt->bindParam(':idarq', $id_arquivo, PDO::PARAM_INT);
                if ($stmt->execute()) {
                    $stmt = $this->connection->prepare('DELETE FROM file WHERE id=:idfile');
                    $stmt->bindParam(':idfile', $idfile, PDO::PARAM_INT);
                    if ($stmt->execute()) {
                        return $this->connection->commit();
                    } else {
                        $this->rollback();
                    }
                } else {
                    $this->rollback();
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            $this->rollback();
        }
        return false;
    }

    /**
     * Lista todos os arquivos do usuário
     * @return Array<Arquivo> Array de Objetos com a informações do Arquivo
     */
    public function listarArquivos() {

        try {
            $stmt = $this->connection->prepare('SELECT a.*,f.name as filename,f.size,f.type FROM arquivo a,file f WHERE idusuario=:iduser AND f.id = a.id_file');
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            if ($stmt->execute()) {

                $lista = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $lista[] = new Arquivo($row);
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o total de votos positivos á uma Resposta de Tópico
     * @param integer $idresposta id na tablela 'resposta'
     * @return string O total 
     */
    public function getTotalVotosPositivos($idresposta) {
        try {
            $stmt = $this->connection->prepare('SELECT count(*) as total FROM voto WHERE `Resposta_resp_id`=:idresp AND valor=true');
            $stmt->bindParam(':idresp', $idresposta, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o total de votos negativos á uma Resposta de Tópico
     * @param integer $idresposta id na tablela 'resposta'
     * @return string O total 
     */
    public function getTotalVotosNegativos($idresposta) {
        try {
            $stmt = $this->connection->prepare('SELECT count(*) as total FROM voto WHERE `Resposta_resp_id`=:idresp AND valor=false');
            $stmt->bindParam(':idresp', $idresposta, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return $fecth['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Adiciona um voto do usuário á uma resposta de Tópico<br/></br>
     * Observação: Se o usuário tiver dado voto (positivo ou negativo) anteriormente </br>
     * e tiver dado o mesmo voto (positivo ou negativo, respectivamente) agora, o voto será apagado.
     * @param integer $idresposta id na tabela resposta
     * @param boolean $valor voto (true para voto positivo, e false para voto negativo) 
     * @return boolean retorna se operação foi realizada com sucesso
     */
    public function setVoto($idresposta, $valor) {
        try {
            $stmtCheck = $this->connection->prepare('SELECT usu_id FROM resposta WHERE resp_id=:idresp AND usu_id!=:iduser ');
            $stmtCheck->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmtCheck->bindParam(':idresp', $idresposta, PDO::PARAM_INT);

            if ($stmtCheck->execute() && $stmtCheck->rowCount() == 1) {
                $stmtExists = $this->connection->prepare('SELECT * FROM voto v WHERE v.Resposta_resp_id=:idresp AND v.Usuario_usu_id=:iduser');
                $stmtExists->bindParam(':idresp', $idresposta, PDO::PARAM_INT);
                $stmtExists->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
                if ($stmtExists->execute()) {
                    if ($stmtExists->rowCount() == 1) {
                        $fecth = $stmtExists->fetch(PDO::FETCH_ASSOC);
                        if (($fecth['valor'] == '1') == $valor) {
                            $stmt = "DELETE from voto where Resposta_resp_id = :idresp AND Usuario_usu_id = :iduser";
                            $stmtFinal = $this->connection->prepare($stmt);
                        } else {
                            $stmt = "UPDATE voto SET valor = :valor WHERE Resposta_resp_id = :idresp AND Usuario_usu_id = :iduser";
                            $stmtFinal = $this->connection->prepare($stmt);
                            $stmtFinal->bindParam(':valor', $valor, PDO::PARAM_BOOL);
                        }
                    } else {
                        $stmt = "INSERT into voto(Resposta_resp_id,Usuario_usu_id,valor) values (:idresp,:iduser,:valor)";
                        $stmtFinal = $this->connection->prepare($stmt);
                        $stmtFinal->bindParam(':valor', $valor, PDO::PARAM_BOOL);
                    }
                    $stmtFinal->bindParam(':idresp', $idresposta, PDO::PARAM_INT);
                    $stmtFinal->bindParam(':iduser', $this->iduser, PDO::PARAM_INT);
                    return $stmtFinal->execute();
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera se o usuário votou positivo ou negativo para uma resposta
     * @param integer $idresposta id na tebela resposta
     * @return boolean o voto (true para voto positivo, e false para voto negativo), ou null em caso de falha no banco
     */
    public function getVoto($idresposta) {
        try {
            $stmt = $this->connection->prepare('SELECT valor FROM voto WHERE `Usuario_usu_id`=:iduser AND `Resposta_resp_id`=:idresp');
            $stmt->bindParam(':idresp', $idresposta, PDO::PARAM_INT);
            $stmt->bindParam(':iduser', $this->iduser, PDO::PARAM_BOOL);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $fecth = $stmt->fetch(PDO::FETCH_ASSOC);
                return $fecth['valor'] == '1';
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return null;
    }

    /**
     * Recupera informações da turma por meio do seu ID
     * @param integer $idturma
     * @return boolean|\Turma Objeto com a informação da Turma, ou false, em caso de falha no banco
     */
    public function getTurmaById($idturma) {
        try {
            $stmt = $this->getConnection()->prepare('SELECT * FROM turma WHERE `idTurma`=:idturma');
            $stmt->bindParam(':idturma', $idturma, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                return new Turma($stmt->fetch(PDO::FETCH_ASSOC));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Retorna a imagem (sempre atualizada) do perfil do usuário, ou a imagem padrão caso não encontre
     * @return string caminho relativo no servidor da imagem
     */
    public function getFilteredImage() {
        $imageurl = $this->getImage();
        if ($imageurl != null && $imageurl !== '') {
            return $imageurl . '?=' . rand();
        } else {
            return 'images/userdefault.png';
        }
    }

    /**
     * Retorna a imagem (na memória cache do navegador) do perfil do usuário, ou a imagem padrão caso não encontre
     * @return string caminho relativo no servidor da imagem
     */
    public function getFilteredImageWithoutRand() {
        $imageurl = $this->getImage();
        if ($imageurl != null && $imageurl !== '') {
            return $imageurl;
        } else {
            return 'images/userdefault.png';
        }
    }

    /**
     * Recupera informações sobre a Instituição pelo seu $id
     * @param integer $idinst id na tabela instituição
     * @return boolean|\Instituicao O objeto com a informação da Instituição ou false caso ocorra alguma falha no banco
     */
    public function getInstituicao($idinst) {
        try {
            $stmt = $this->getConnection()->prepare('SELECT * FROM instituicao WHERE inst_id=:id');
            $stmt->bindParam(':id', $idinst, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                return new Instituicao($stmt->fetch(PDO::FETCH_ASSOC));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre a Curso pelo seu $id
     * @param integer $idcurso id na tabela curso
     * @return boolean|\Curso O objeto com informações do Curso ou false em caso de falha no banco
     */
    public function getCurso($idcurso) {
        try {
            $stmt = $this->getConnection()->prepare('SELECT * FROM curso WHERE cur_id=:id');
            $stmt->bindParam(':id', $idcurso, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                return new Curso($stmt->fetch(PDO::FETCH_ASSOC));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre a Disciplina pelo seu $id
     * @param integer $iddisciplina id na tabela disciplina
     * @return boolean|\Disciplina O objeto com informações do Disciplina ou false em caso de falha no banco
     */
    public function getDisciplina($iddisciplina) {
        try {
            $stmt = $this->getConnection()->prepare('SELECT * FROM disciplina WHERE disc_id=:id');
            $stmt->bindParam(':id', $iddisciplina, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                return new Disciplina($stmt->fetch(PDO::FETCH_ASSOC));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações de Instituições e <b>Recursivamente recupera informações sobre cursos, disciplinas e turmas</b>
     * @return \Instituicao objeto com informações da Instituição ou false em caso de falha no banco
     */
    public function listarInstituicoes() {
        try {
            $instituicoesstmt = $this->getConnection()->prepare('Select * FROM instituicao');
            $cursosstmt = $this->getConnection()->prepare('Select * FROM curso');
            $disciplinasstmt = $this->getConnection()->prepare('Select * FROM disciplina');
            $turmasstmt = $this->getConnection()->prepare('Select * FROM turma');

            if ($instituicoesstmt->execute() && $cursosstmt->execute() && $disciplinasstmt->execute() && $turmasstmt->execute()) {
                $lista = array();
                $instituicoes = $instituicoesstmt->fetchAll(PDO::FETCH_ASSOC);
                $cursos = $cursosstmt->fetchAll(PDO::FETCH_ASSOC);
                $disciplinas = $disciplinasstmt->fetchAll(PDO::FETCH_ASSOC);
                $turmas = $turmasstmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($instituicoes as $instituicao) {
                    $inst = new Instituicao($instituicao);
                    $inst->fetchTree($cursos, $disciplinas, $turmas);
                    $lista[] = $inst;
                }
                return $lista;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera informações sobre o material didático pelo seu $id
     * @param integer $id_material
     * @return \MaterialDidatico Objeto com informações do Material ou false, em caso de falha no banco
     */
    public function getMaterialDidatico($id_material) {
        try {

            $stmt = $this->connection->prepare('SELECT * FROM materialdidatico m INNER JOIN file f ON f.id = m.id_file WHERE m.`idMaterialDidatico`=:id');
            $stmt->bindParam(':id', $id_material, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return new MaterialDidatico($result);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * Recupera o Arquivo do Material Didático pelo id do material
     * @param integer $idmaterial id na tabela material
     * @return \BinaryFile Objeto com a informações do Arquivo
     */
    public function getBlobContentMaterial($idmaterial) {
        try {
            $stmt = $this->connection->prepare(
                    'SELECT f.* FROM materialdidatico m '
                    . 'INNER JOIN file f ON m.id_file = f.id '
                    . 'WHERE m.`idMaterialDidatico` = :id');
            $stmt->bindValue(':id', $idmaterial, PDO::PARAM_INT);
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
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * Recupera o Arquivo de Atividade pelo id do arquivo
     * @param integer $idarquivo id na tabela arquivo
     * @return \BinaryFile Objeto com a informações do Arquivo de Atividade
     */
    public function getBlobContentArquivoAtividade($idarquivo) {
        try {
            $stmt = $this->connection->prepare(
                    'SELECT f.* FROM arquivo a '
                    . 'INNER JOIN file f ON a.id_file = f.id '
                    . 'WHERE a.arq_id=:id');
            $stmt->bindValue(':id', $idarquivo, PDO::PARAM_INT);
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
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
    
    public function getTotalNotificacoes(){
        try {
            $stmt = $this->connection->prepare(
                    'SELECT COUNT(n.id) as total FROM notificacao n '
                    . 'WHERE n.visto = 0 AND n.id_usuario = :iduser');
            $stmt->bindValue(':iduser', $this->iduser, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $fetch = $stmt->fetch(PDO::FETCH_ASSOC);
                return $fetch['total'];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }

    public function listNotificacoes(){
        try {
            $stmt = $this->connection->prepare(
                    'SELECT `id`,`visto`,`title`,`data` FROM notificacao n '
                    . 'WHERE n.id_usuario = :iduser ORDER BY `id` DESC');
            $stmt->bindValue(':iduser', $this->iduser, PDO::PARAM_INT);
            if ($stmt->execute()) {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    public function getNotificacao($id){
        try {
            $stmt = $this->connection->prepare(
                    'SELECT `id`,`html`,`visto`,`title`,`data` FROM notificacao n '
                    . 'WHERE n.id_usuario = :iduser AND `id` = :id');
            $stmt->bindValue(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            if ($stmt->execute() && $stmt->rowCount() == 1) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
    public function setNotificacaoLida($id){
         try {
            $stmt = $this->connection->prepare('UPDATE notificacao SET visto = 1 WHERE id_usuario = :iduser AND `id` = :id');
            $stmt->bindValue(':iduser', $this->iduser, PDO::PARAM_INT);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            if ($stmt->execute()) {
                return true;
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return false;
    }
    
}