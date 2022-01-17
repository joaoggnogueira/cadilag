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
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();

if ($controlador->setUser($email)) {
    $index = (int) filter_input(INPUT_POST, 'index', FILTER_VALIDATE_INT);

    if (!$_SESSION['ehAluno']) {
        include '../../controladores/Professor.php';
        include '../../controladores/Turma.php';
        $professor = $controlador->getProfessor();
        $turma = $professor->getTurmaByIndex($index);
        if ($turma->deletePlanoEnsino()) {
            $response = array(
                "resultado" => true, 
                "resposta" => "Sucesso ao remover"
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
            "resposta" => "Usuário não é um Professor"
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Usuário não encontrado"
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("REMOVENDO PLANO DE ENSINO: " . $response['resposta']);
