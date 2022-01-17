<?php

require "./vendor/phpspellcheck/include.php";

$mySpell = new SpellAsYouType();
$mySpell->InstallationPath = "./vendor/phpspellcheck/";
$mySpell->Fields = "ALL";
$mySpell->Language = "Portugues";
$mySpell->UserInterfaceLanguage = "pt";
echo $mySpell->Activate();
