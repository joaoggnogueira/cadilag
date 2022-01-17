<div id="workspace" >

</div>

<div id="edithud">
    <ul>
        <li>
        <li><button class="cool-radiobutton radio-move" title="Editar Estados"></button></li>
        <li><button class="cool-radiobutton radio-connect" title="Editar Transições"></button></li>
        <li>
            <div class="option">
                <p><input type="radio" value="false" name="digrafo" id="grafo-option"/><label for="grafo-option">Não direcionado</label></p>
                <p><input type="radio" value="true" name="digrafo" id="digrafo-option" checked/><label for="digrafo-option">Direcionado</label></p>
            </div>
        </li>
        <li>
            <div class="option">
                <p><input type="radio" value="true" name="ponderado" id="ponderado-option"/><label for="ponderado-option">Ponderado</label></p>
                <p><input type="radio" value="false" name="ponderado" id="naoponderado-option" checked/><label for="naoponderado-option">Não-ponderado</label></p>
            </div>
        </li>
    </ul>
</div>
<?PHP if($acesso_livre): ?>
<div id="huboptions" style="display:none;">
    <a href="../../acesso_livre.php" class="option" title="Ir ao Menu Principal"><div class="option">Principal</div></a>
    <a href="../structs/index.php" class="option" title="Estruturas de Dados"><div class="option">Estruturas</div></a>
    <a href="../../login.php" class="option" id="sair" title="Encerrar Sessão"><div class="option">Log In</div></a>
</div>
<?PHP else: ?>
<div id="huboptions" style="display:none;">
    <a href="../../profile.php" class="option" title="Ir ao Menu Principal"><div class="option">Principal</div></a>
    <a href="../../editprofile.php" class="option" title="Editar o Perfil"><div class="option">Editar Perfil</div></a>
    <a href="../../arquivos.php" class="option" title="Ver Arquivos Salvos"><div class="option">Arquivos</div></a>
    <a href="../../class.php" class="option" title="Ir a turma"><div class="option">Turma</div></a>
    <a href="#" onclick="quit();"  class="option" id="sair" title="Encerrar Sessão"><div class="option">Log Off</div></a>
</div>
<?PHP endif; ?>