<?php

if(!isset($mensagem)){
   $mensagem = "Página não encontrada"; 
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
                src: url(./fonts/Raleway-Medium.ttf);
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
        </style>
    </head>
    <body>
        <div class="message">
            <?= $mensagem ?>
        </div>
    </body>
</html>