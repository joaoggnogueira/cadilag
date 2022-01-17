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
    $id = (int) filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if (!$_SESSION['ehAluno']) {
        include '../../controladores/Professor.php';
        $professor = $controlador->getProfessor();
        if (($caminho = $professor->deletarMaterial($id))) {
            $response = array(
                "resultado" => true, 
                "resposta" => "Sucesso ao deletar",
                "log" => log::TYPE_NORMAL,
                "debug" => array("id_material" => $id)
            );
        } else {
            $response = array(
                "resultado" => false, 
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_ERROR,
                "debug" => array("id_material" => $id)
            );
        }
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Usuário não é um Professor",
            "log" => log::TYPE_ANORMAL,
            "debug" => array()
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Usuário não encontrado",
        "log" => log::TYPE_ANORMAL,
        "debug" => array("email" => $email)
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("REMOVENDO MATERIAL DIDATICO: " . $response['resposta'], $response['debug'], $response['log']);
