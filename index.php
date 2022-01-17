<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
session_start();
echo('redirecionando em 2 segundos...');

if(!isset($_SESSION['email']) || !isset($_SESSION['senha']))
{
    header("Location: ./login.php");
}
else
{
    header("Location: ./profile.php");
}