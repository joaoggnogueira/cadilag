<?PHP

session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array(
        "resultado" => false,
        "sessionexpired" => true
    ));
    exit();
}

/**
 * Trata a requisição para criar uma nova atividade
 * Acessível somente para professores
 * @param url do tipo input file, com as informações do arquivo
 * @param id id da atividade
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../entidades/Arquivo.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];
$file = $_FILES['url'];

$controlador = new ControladorUsuario();

if (file_exists($file["tmp_name"])) {
    $filesize = filesize($file["tmp_name"]);
    $maxSizeMaterial = (1024 * 1024) * 2; //2mb 
    if ($filesize < $maxSizeMaterial) {
        if ($controlador->setUser($email)) {
            $idatividade = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));
            if ($_SESSION['ehAluno']) {
                include '../../controladores/Aluno.php';
                $aluno = $controlador->getAluno();
                if ($aluno->checkAcessToUpload($idatividade)) {
                    $arquivo = $aluno->novoArquivo($file, $idatividade);
                } else {
                    $log = new log($controlador->getConnection(), $controlador->getUserId());
                    $log->log("NOVO ARQUIVO PARA A ATIVIDADE: Aluno não possui acesso a atividade", array("id_atividade" => $idatividade), log::TYPE_ANORMAL);
                }
            } else {
                include '../../controladores/Professor.php';
                $professor = $controlador->getProfessor();
                $arquivo = $professor->novoArquivo($file, $idatividade);
            }
            if ($arquivo) {
                ob_start();
                include '../../includes/arquivolayout.php';
                $view = ob_get_clean();
                ob_end_flush();
                $response = array(
                    "resultado" => true,
                    "resposta" => "Sucesso",
                    "html" => $view,
                    "debug" => array("arquivo_id" => $arquivo->getId()),
                    "log" => log::TYPE_NORMAL
                );
            } else {
                ob_start();
                var_dump($arquivo);
                $view = ob_get_clean();
                ob_end_flush();
                $response = array(
                    "resultado" => false,
                    "resposta" => "Falha no Banco",
                    "arquivo" => $view,
                    "debug" => array("view" => $view, "atividade_id" => $idatividade, "filetype" => $file["type"]),
                    "log" => log::TYPE_ERROR
                );
            }
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Usuário não encontrado",
                "debug" => array(),
                "log" => log::TYPE_ANORMAL
            );
        }
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => " Arquivo deve ser menor que 2MB",
            "debug" => array("filesize" => $filesize),
            "log" => log::TYPE_ANORMAL
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
$log->log("NOVO ARQUIVO PARA A ATIVIDADE: " . $response['resposta'], $response['debug'], $response['log']);
