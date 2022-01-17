<p class="handlerTab">EnumCor</p>
<div class="TabCode">
    <p>{</p>
    <p>&nbsp; PRETO,</p>
    <p>&nbsp; VERMELHO</p>
    <p>}</p>
</div>
<br/>
<p class="handlerTab">NoRN</p>
<div class="TabCode">
    <p>{</p>
    <p>&nbsp; info : inteiro;</p>
    <p>&nbsp; dir : NoRN;</p>
    <p>&nbsp; esq : NoRN;</p>
    <p>&nbsp; cor : EnumCor;</p>
    <p>}</p>
</div>
<br/>
<p>RAIZ : NoRN;</p>
<br/>
<p>#DEFINE CAMINHO.no CAMINHO[CAMINHO.size - 1]</p>
<p>#DEFINE CAMINHO.novo CAMINHO[CAMINHO.size - 1]</p>
<p>#DEFINE CAMINHO.pai CAMINHO[CAMINHO.size - 2]</p>
<p>#DEFINE CAMINHO.avo CAMINHO[CAMINHO.size - 3]</p>
<p>#DEFINE CAMINHO.bisavo CAMINHO[CAMINHO.size-4]</p>
<p>#DEFINE CAMINHO.tio tio(CAMINHO)</p>
<p>#DEFINE CAMINHO.irmao irmao(CAMINHO)</p>
