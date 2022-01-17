<?PHP 
    $prefix = "./";
    if(!file_exists("./login.php")){
        if(file_exists("../login.php")){
            $prefix = "../";
        } else {
            $prefix = "../../";
        }
    }
?>

<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <title>Cadilag</title>
        <meta charset="UTF-8">
        <style>
            @font-face {
                font-family: secondaryFont;
                src: url(<?= $prefix ?>fonts/Raleway-Medium.ttf);
            }
            body{
                background: #333;
            }
            .message{
                color: white;
                font-size: 50px;
                font-family: secondaryFont;
                text-align: center;
                width: 100%;
                position: fixed;
                top: calc(50% - 25px);
            }
            .submessage{
                color: white;
                font-size: 25px;
                font-family: secondaryFont;
                text-align: center;
                width: 100%;
                position: fixed;
                top: calc(50% + 25px);
            }
            .submessage a{
                color: #0078e7;
            }
        </style>
        <style media="(max-width: 510px)">
            .message{
                top: calc(50% - 100px);
            }
            .submessage{
                top: calc(50% + 50px);
            }
        </style>
    </head>
    <body>
        <div class="message">SESSÃO EXPIRADA</div>
        <div class="submessage">Realize o <u><a href="<?= $prefix ?>login.php">login</a></u> novamente!</div>
    </body>
</html>