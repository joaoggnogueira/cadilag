function arvore_bplus(ordem) {
    this.ordem = ordem;
    this.MAX_FILHOS = 2 * this.ordem;
    this.MAX_CHAVES = (2 * this.ordem) - 1;
    this.raiz = null;

    var criaNo = function (ordem) {
        this.tipono = true;//se for verdadeiro é externo se for falso é interno,admitimos que seja externo
        this.chaves = [this.MAX_CHAVES];
        this.filhos = [this.MAX_FILHOS];
        this.numchaves = 0;
        this.proximo = null;
        this.pai = null;
        this.ordem = ordem;
        this.MAX_FILHOS = 2 * this.ordem;
        this.MAX_CHAVES = (2 * this.ordem) - 1;
    };

    this.insercao = function (valor) {

        if (this.raiz === null) {
            this.raiz = new criaNo(this.ordem);
            this.raiz.chaves[0] = valor;
            this.raiz.numchaves++;
        } else {
            this.insere2(this.raiz, valor, null, this.raiz);

        }
    };

    this.insere2 = function (no, valor, pai, raiz) {

        if (no.tipono == true) {
            //SE NÃO VAI ESTOURAR O VALOR MINIMO DE NÓS

            if (no.numchaves < this.MAX_CHAVES) {
                var i;
                for (i = 0; ((i < no.numchaves) && (valor > no.chaves[i])); i++) {
                }

                if (i < no.numchaves) {
                    no.chaves[i + 1] = no.chaves[i];
                    no.filhos[i + 1] = no.filhos[i];
                }
                //console.log(no.chaves[i]);
                no.chaves[i] = valor;
                no.filhos[i] = null;
                no.numchaves++;

            }
            //vai dar split
            else {
                this.splitDown(no, valor, pai, raiz);
            }
        } else {
            console.log("///");
            //percorre até encontrar um no folha
            var j = 0;
            for (; j < no.numchaves; j++) {
                console.log(no.chaves[j]);
                if (valor < no.chaves[j]) {
                    this.insere2(no.filhos[j], valor, no);
                    return;
                }
            }
            //console.log(no.chaves[j]);
            //console.log(no.filhos[j]);
            this.insere2(no.filhos[j], valor, no);

        }

    };

    this.splitDown = function (no, valor, pai, raiz) {
        //console.log("****");
        var novoNO = new criaNo(this.ordem);
        //split no primero no
        if (pai == null) {
            // console.log("||||||");
            var novaRaiz = new criaNo(this.ordem);
            var valorAux = valor;
            var filhoAux;
            var k;


            for (k = 0; k < no.numchaves; k++) {
                //acha a posição do valor no vetor e coloca esse valor
                if (valor < no.chaves[k]) {
                    valorAux = no.chaves[k];
                    filhoAux = no.filhos[k];
                    no.chaves[k] = valor;
                    no.filhos[k] = null;
                    k++;
                    break;
                }

            }



            var vaux2;
            var filhoaux2;
            //coloca os valores restantes na suas devidas posições
            for (; k < no.numchaves; k++) {
                vaux2 = no.chaves[k];
                filhoaux2 = no.filhos[k];
                no.chaves[k] = valorAux;

                no.filhos[k] = filhoAux;
                valorAux = vaux2;
                filhoAux = filhoaux2;
            }



            //PREENCHENDO O NOVO NÓ
            var valor_intermediario = no.chaves[this.ordem - 1];

            // console.log(valor_intermediario);

            var index = this.ordem;
            var maximo = index;
            //colocando as chaves nos novos nós
            for (; index < no.numchaves; index++) {
                // console.log(no.chaves[index]);
                novoNO.chaves[index - maximo] = no.chaves[index];
                //console.log(no.chaves[index]);
                //console.log(novoNO.chaves[index-maximo]);
                no.chaves[index] = null;
                novoNO.numchaves++;
                no.numchaves--;
            }

            novoNO.tipono = true;
            no.proximo = novoNO;

            novoNO.pai = pai;
            no.pai = pai;



            novaRaiz.chaves[novaRaiz.numchaves] = valor_intermediario;
            novaRaiz.numchaves++;
            novaRaiz.filhos[0] = no;
            novaRaiz.filhos[1] = novoNO;

            if (valorAux == valor) {
                novoNO.chaves[novoNO.numchaves] = valor;
                novoNO.numchaves++;
            }
            //console.log(novoNO);
            //console.log(no);
            //atualizando a raiz

            //console.log(this.raiz);

            this.raiz = novaRaiz;
            this.raiz.tipono = false;
        }
        //split em um no folha normal  
        else {
            //console.log(no);
            var valorAux = valor;
            var filhoAux;
            var k;


            for (k = 0; k < no.numchaves; k++) {
                //acha a posição do valor no vetor e coloca esse valor
                if (valor < no.chaves[k]) {
                    valorAux = no.chaves[k];
                    filhoAux = no.filhos[k];
                    no.chaves[k] = valor;
                    no.filhos[k] = null;
                    k++;
                    break;
                }
            }
            var vaux2;
            var filhoaux2;
            //coloca os valores restantes na suas devidas posições
            for (; k < no.numchaves; k++) {
                vaux2 = no.chaves[k];
                filhoaux2 = no.filhos[k];
                no.chaves[k] = valorAux;
                no.filhos[k] = filhoAux;
                valorAux = vaux2;
                filhoAux = filhoaux2;
            }
            //PREENCHENDO O NOVO NÓ
            var valor_intermediario = no.chaves[this.ordem - 1];

            var index = this.ordem;
            var maximo = index;
            //colocando as chaves nos novos nós
            for (; index < no.numchaves; index++) {
                novoNO.chaves[index - maximo] = no.chaves[index];
                no.chaves[index] = null;
                novoNO.numchaves++;
                no.numchaves--;
            }

            //Caso fosse inserir o valor no final do array

            //console.log(valorAux);
            if (valorAux == valor) {
                novoNO.chaves[novoNO.numchaves] = valor;
                novoNO.numchaves++;
            }

            novoNO.tipono = true;
            novoNO.proximo = no.proximo;
            no.proximo = novoNO;
            novoNO.pai = pai;

            //verifica se tem split nos acima
            this.splitUp(novoNO, valor_intermediario, pai);
        }
    };

//SPLIT EM NÓS INTERNOS
    this.splitUp = function (no, valor, pai) {

        //Não causa spli, apenas insere
        if (pai.numchaves < this.MAX_CHAVES) {
            console.log(valor);
            var i;
            var valorAux = valor;
            var filhoAux;
            for (k = 0; k < pai.numchaves; k++) {
                //acha a posição do valor no vetor e coloca esse valor
                if (valor < pai.chaves[k]) {
                    valorAux = pai.chaves[k];
                    filhoAux = pai.filhos[k + 1];
                    pai.chaves[k] = valor;
                    pai.filhos[k + 1] = no;
                    k++;
                    break;
                }
            }
            var vaux2;
            var filhoaux2;
            //coloca os valores restantes na suas devidas posições
            for (; k < pai.numchaves; k++) {
                vaux2 = pai.chaves[k];
                filhoaux2 = pai.filhos[k + 1];
                pai.chaves[k] = valorAux;
                pai.filhos[k + 1] = filhoAux;
                valorAux = vaux2;
                filhoAux = filhoaux2;
            }

            if (valorAux == valor) {
                pai.chaves[pai.numchaves] = valor;
                pai.filhos[pai.numchaves] = no;
                pai.numchaves++;
            }

        }
        //CAUSARÁ SPLIT TEM QUE ENVIAR PARA CIMA
        else {

            var novoNO = new criaNo(this.ordem);
            //split no primero no
            if (pai.pai == null) {
                var novaRaiz = new criaNo(this.ordem);
                var valorAux = valor;
                var filhoAux;
                var k;


                for (k = 0; k < pai.numchaves; k++) {
                    //acha a posição do valor no vetor e coloca esse valor
                    if (valor < pai.chaves[k]) {
                        if (k = 0) {
                            valorAux = pai.chaves[k];
                            filhoAux = pai.filhos[k];
                            pai.chaves[k] = valor;
                            pai.filhos[k] = no;
                            k++;
                            break;
                        } else {
                            valorAux = pai.chaves[k];
                            filhoAux = pai.filhos[k + 1];
                            pai.chaves[k] = valor;
                            pai.filhos[k + 1] = no;
                            k++;
                            break;
                        }
                    }
                }
                var vaux2;
                var filhoaux2;
                //coloca os valores restantes na suas devidas posições
                for (; k < pai.numchaves; k++) {
                    vaux2 = pai.chaves[k];
                    filhoaux2 = pai.filhos[k + 1];
                    pai.chaves[k] = valorAux;
                    pai.filhos[k + 1] = filhoAux;
                    valorAux = vaux2;
                    filhoAux = filhoaux2;
                }
                //PREENCHENDO O NOVO NÓ
                var valor_intermediario = pai.chaves[this.ordem - 1];

                var index = this.ordem;
                var maximo = index;
                //colocando as chaves nos novos nós
                for (; index < pai.numchaves; index++) {
                    novoNO.chaves[index - maximo] = pai.chaves[index];
                    pai.chaves[index] = no;
                    novoNO.numchaves++;
                    pai.numchaves--;
                }

                if (valorAux == valor) {
                    novoNO.chaves[novoNO.numchaves] = valor;
                    novoNO.filhos[novoNO.numchaves] = no;
                    novoNO.numchaves++;
                }

                novoNO.tipono = false;
                pai.proximo = novoNO;

                novoNO.pai = this.raiz;
                pai.pai = this.raiz;

                novaRaiz.chaves[novaRaiz1.numchaves] = valor_intermediario;
                novaRaiz.numchaves++;
                novaRaiz.filhos[0] = pai;
                novaRaiz.filhos[1] = novoNO;

                //atualizando a raiz
                this.raiz = novaRaiz;
                this.raiz.tipono = false;
            }
            //split em um no folha normal  
            else {
                var valorAux = valor;
                var filhoAux;
                var k;


                for (k = 0; k < pai.numchaves; k++) {
                    //acha a posição do valor no vetor e coloca esse valor
                    if (valor < pai.chaves[k]) {
                        if (k = 0) {
                            valorAux = pai.chaves[k];
                            filhoAux = pai.filhos[k];
                            pai.chaves[k] = valor;
                            pai.filhos[k] = no;
                            k++;
                            break;
                        } else {
                            valorAux = pai.chaves[k];
                            filhoAux = pai.filhos[k + 1];
                            pai.chaves[k] = valor;
                            pai.filhos[k + 1] = no;
                            k++;
                            break;
                        }
                    }
                }
                var vaux2;
                var filhoaux2;
                //coloca os valores restantes na suas devidas posições
                for (; k < pai.numchaves; k++) {
                    vaux2 = pai.chaves[k];
                    filhoaux2 = pai.filhos[k + 1];
                    pai.chaves[k] = valorAux;
                    pai.filhos[k + 1] = filhoAux;
                    valorAux = vaux2;
                    filhoAux = filhoaux2;
                }

                //PREENCHENDO O NOVO NÓ
                var valor_intermediario = pai.chaves[this.ordem - 1];

                var index = this.ordem;
                var maximo = index;
                //colocando as chaves nos novos nós
                for (; index < pai.numchaves; index++) {
                    novoNO.chaves[index - maximo] = pai.chaves[index];
                    pai.chaves[index] = null;
                    novoNO.numchaves++;
                    pai.numchaves--;
                }

                if (valorAux == valor) {
                    novoNO.chaves[novoNO.numchaves] = valor;
                    novoNO.filhos[novoNO.numchaves] = no;
                    novoNO.numchaves++;
                }

                novoNO.tipono = false;
                pai.proximo = novoNO;
                novoNO.pai = pai.pai;

                //verifica se tem split nos acima
                splitUp(novoNO, valor_intermediario, pai.pai);
            }

        }


    };


}
;

