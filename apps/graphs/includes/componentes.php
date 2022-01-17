<div class="subsidebar">
  <div class="title">
    <p>Componentes</p>
  </div>
  <form onsubmit="event.preventDefault()" id="componentes">
    <button onclick="Machine.addPartida()" id="partida">Partida</button>
    <button onclick="Machine.addEscrita()" id="escrita">Escrita</button>
    <button onclick="Machine.addLeitura()" id="leitura">Leitura</button>
    <button onclick="Machine.addAceita()" id="aceita">Aceita</button>
    <button onclick="Machine.addRejeita()" id="rejeita">Rejeita</button>
  </form>
  <form id="tooltipeditcomponent">
    <div class="subtitle">
      <p>Clique duas vezes em um componente para editá-lo</p>
    </div>
  </form>
  <form id="tooltipedittransicao">
    <div class="subtitle">
      <p>Clique em uma transicao para edita-lá</p>
    </div>
  </form>
</div>