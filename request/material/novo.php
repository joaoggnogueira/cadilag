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
include '../../entidades/Atividade.php';
include '../../entidades/MaterialDidatico.php';
include '../../controladores/log.php';

$controlador = new ControladorUsuario();
$email = $_SESSION['email'];

$file = $_FILES['arquivo'];
if (file_exists($file["tmp_name"])) {

    $filesize = filesize($file["tmp_name"]);
    $maxSizeMaterial = (1024 * 1024) * 5; //5mb 

    if ($filesize < $maxSizeMaterial) {
        if ($controlador->setUser($email)) {
            if (!$_SESSION['ehAluno']) {
                $controlador = $controlador->getProfessor();

                $index = (int) (filter_input(INPUT_POST, 'index', FILTER_VALIDATE_INT));
                $titulo = filter_input(INPUT_POST, 'titulo', FILTER_SANITIZE_STRING);
                $detalhes = preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/i", '<$1$2>', strip_tags($_POST['detalhes'], '<u><b><i><big><small><center><h1><h2><h3><h4><h5><h6>'));
                $turma = $controlador->getTurmaByIndex($index);
                if ($turma) {
                    if (($material = $turma->novoMaterialDidatico($titulo, $detalhes, $file))) {
                        ob_start();
                        include '../../includes/materiallayout.php';
                        $view = ob_get_clean();
                        ob_end_flush();
                        $response = array(
                            "resultado" => true,
                            "resposta" => "Sucesso ao publicar material",
                            "html" => $view,
                            "debug" => array("id_material" => $material->getId()),
                            "log" => log::TYPE_NORMAL
                        );
                    } else {
                        $response = array(
                            "resultado" => false,
                            "resposta" => "Falha no Banco",
                            "debug" => array("turma" => $index, "titulo" => $titulo, "detalhes" => $deltahes),
                            "log" => log::TYPE_ERROR
                        );
                    }
                } else {
                    $response = array(
                        "resultado" => false,
                        "resposta" => "Turma não encontrada",
                        "debug" => array("turma" => $index),
                        "log" => log::TYPE_ANORMAL
                    );
                }
            } else {
                $response = array(
                    "resultado" => false,
                    "resposta" => "Usuário não é um professor",
                    "debug" => array(),
                    "log" => log::TYPE_ANORMAL
                );
            }
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Usuário não encontrado",
                "debug" => array("email" => $email),
                "log" => log::TYPE_ANORMAL
            );
        }
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Arquivo deve ser menor que 5MB",
            "debug" => array("filesize" => $filesize),
            "log" => log::TYPE_ERROR
        );
    }
} else {
    $response = array(
        "resultado" => false,
        "resposta" => "Falha ao enviar arquivo",
        "debug" => array("filetype" => $file['type']),
        "log" => log::TYPE_ANORMAL
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("NOVO MATERIAL DIDATICO: " . $response['resposta'], $response['debug'], $response['log']);
