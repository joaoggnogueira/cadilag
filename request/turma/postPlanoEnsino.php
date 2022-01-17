<?PHP

session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array(
        "resultado" => false,
        "sessionexpired" => true
    ));
    exit();
}
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/Professor.php';
include '../../controladores/Turma.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];
$controlador = new ControladorUsuario();
$file = $_FILES['ensino_file'];
if (file_exists($file["tmp_name"])) {
    
    $filesize = filesize($file["tmp_name"]);
    $maxSizeMaterial = (1024*1024)*2; //2mb 
    
    if ($filesize < $maxSizeMaterial) {

        if ($controlador->setUser($email)) {

            if (!$_SESSION['ehAluno']) {
                $controlador = $controlador->getProfessor();

                $index = (int) (filter_input(INPUT_POST, 'index', FILTER_VALIDATE_INT));
                $turma = $controlador->getTurmaByIndex($index);
                if ($turma) {
                    if (($turma->novoPlanoEnsino($file))) {
                        $response = array(
                            "resultado" => true, 
                            "resposta" => "Sucesso ao publicar o arquivo"
                        );
                    } else {
                        $response = array(
                            "resultado" => false, 
                            "resposta" => "Falha no Banco"
                        );
                    }
                } else {
                    $response = array(
                        "resultado" => false, 
                        "resposta" => "Turma não encontrada"
                    );
                }
            } else {
                $response = array(
                    "resultado" => false, 
                    "resposta" => "Usuário não é um professor"
                );
            }
        } else {
            $response = array(
                "resultado" => false, 
                "resposta" => "Usuário não encontrado"
            );
        }
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Arquivo deve ser menor que 5MB"
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Falha ao enviar arquivo"
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("NOVO PLANO DE ENSINO: " . $response['resposta']);