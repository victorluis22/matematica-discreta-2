// Classe que representa um nó/vertice no grafo
class No {
  constructor(id) {
    this.id = id;
    this.visitado = false;
    this.pai = null;
  }
}

// Classe que representa uma aresta no grafo
class Aresta {
  constructor(origem, destino, capacidade) {
    this.origem = origem;
    this.destino = destino;
    this.capacidade = capacidade;
    this.fluxo = 0;
  }
}

// Classe que representa o grafo
class Grafo {
  constructor() {
    this.nos = {};
    this.arestas = [];

    //Variaveis para determinar onde o nó vai ser desenhado
    this.posicaoDesenhoX = 100;
    this.posicaoDesenhoY;
    this.yBaixo = 200;
    this.yAlto = 100;
    this.contador = -1;
  }

  addNo(id) {
    if (!this.nos[id]) {
      this.nos[id] = new No(id);

      //Estrutra para gerar o grid padrão/ visualizacao do grafo

      switch (this.contador) {
        case -1:
          this.posicaoDesenhoY = 150;

          break;

        case 0:
          this.posicaoDesenhoY = this.yAlto;
          this.posicaoDesenhoX += 100;

          break;
        case 1:
          this.posicaoDesenhoY = this.yBaixo;

          break;

        case 2:
          this.posicaoDesenhoY = this.yBaixo;
          this.posicaoDesenhoX += 100;

          break;
        case 3:
          this.posicaoDesenhoY = this.yAlto;

          break;
        case 4:
          this.posicaoDesenhoY = this.yAlto;
          this.posicaoDesenhoX += 100;

          break;
        case 5: // resetando varivel neste caso
          this.posicaoDesenhoY = this.yBaixo;
          this.contador = 1;
          break;
      }
      this.contador++;

      cy.add({
        group: "nodes",
        data: { id: id },
        position: { x: this.posicaoDesenhoX, y: this.posicaoDesenhoY },
      });
    }
  }
  // Adiciona aresta e a desenha com a biblioteca grafica
  addAresta(origem, destino, capacidade) {
    const aresta = new Aresta(origem, destino, capacidade);
    this.arestas.push(aresta);

    cy.add({
      group: "edges",
      data: {
        id: "0" + (this.arestas.length - 1),
        source: origem,
        target: destino,
        weight: capacidade,
      },
    });
  }

  // Encontra um caminho aumentante usando busca em largura (buscaemLargura)
  buscaemLargura(origem, destino) {
    // Reinicializa o estado dos nós
    for (const idNo in this.nos) {
      this.nos[idNo].visitado = false;
      this.nos[idNo].pai = null;
    }
    //começando pelo primeiro nó...
    const fila = [];
    const noInicial = this.nos[origem];
    noInicial.visitado = true;
    fila.push(noInicial);

    //Para os demais
    while (fila.length > 0) {
      const noAtual = fila.shift();
      for (const aresta of this.arestas) {
        if (
          aresta.capacidade - aresta.fluxo > 0 &&
          !this.nos[aresta.destino].visitado
        ) {
          this.nos[aresta.destino].visitado = true;
          this.nos[aresta.destino].pai = aresta;
          fila.push(this.nos[aresta.destino]);

          if (aresta.destino === destino) {
            // Caminho aumentante encontrado
            return true;
          }
        }
      }
    }

    // Não há mais caminhos aumentantes
    return false;
  }
//Muda a cor das arestas. Vermelho para fluxo alto, amarelo intermediario e verde pouco 
  drawfluxoArestra() {
    //Roda cada aresta e calcula o fluxo, mudando a cor depois
    cy.edges().forEach((edge) => {
      var id = parseInt(edge.id());
      var aresta = this.arestas[id];
      var flow = aresta.capacidade - aresta.fluxo;
      var textoFlow = aresta.fluxo + "/" + aresta.capacidade;
      var color;
      if (flow <= 41) {
        color = "#ca3c32";
      } else if (flow > 41 && flow < 83) {
        color = "#fbb930";
      } else {
        color = "#347346";
      }

      edge.style({
        width: 3, // Altera a largura da aresta
        "line-color": color, // Altera a cor da linha da aresta
        "target-arrow-color": color, // Altera a cor da seta de destino da aresta
        label: textoFlow,
      });
    });
  }
  // Executa o algoritmo de Ford-Fulkerson para encontrar o fluxo máximo no grafo
  fordFulkerson(origem, destino) {
    let fluxoMaximo = 0;

    while (this.buscaemLargura(origem, destino)) {
      let fluxoCaminho = Infinity;
      let noAtual = this.nos[destino];

      // Encontra o fluxo máximo no caminho aumentante
      while (noAtual.id !== origem) {
        const aresta = noAtual.pai;
        fluxoCaminho = Math.min(fluxoCaminho, aresta.capacidade - aresta.fluxo);
        noAtual = this.nos[aresta.origem];
      }

      // Atualiza o fluxo nas arestas do caminho aumentante
      noAtual = this.nos[destino];
      while (noAtual.id !== origem) {
        const aresta = noAtual.pai;
        aresta.fluxo += fluxoCaminho;
        noAtual = this.nos[aresta.origem];
      }

      // Adiciona o fluxo máximo do caminho aumentante ao fluxo total
      fluxoMaximo += fluxoCaminho;
      console.log(fluxoMaximo);
      this.drawfluxoArestra();
    }
    return fluxoMaximo;
  }
}

function renderGrafo() {
  // Reseta os elementos do cytoscape
  cy.elements().remove();
  const grafo = new Grafo();
  const numerodeNos = parseInt(document.getElementById("numeroNo").value);

  // Adiciona os nós ao grafo dinamicamente
  for (let i = 0; i <= numerodeNos; i++) {
    grafo.addNo(i);
  }

  // Adiciona as arestas ao grafo
  const numdeArestas = numerodeNos;
  var i = 1;
  //arestas da ponta
  grafo.addAresta(0, 1, 100);
  grafo.addAresta(0, 2, 50);

  //Interação para gerar todas arestas restante do grafo
  while (i < numerodeNos) {
    grafo.addAresta(i, i + 1, 50);
    if (i % 4 == 0) {
      grafo.addAresta(i - 3, i, 50);
      grafo.addAresta(i - 3, i - 1, 50);

      console.log(i - 3);
      console.log(i - 1);
    }
    if (i == 3) {
      // desenhar linha de baixo
      for (let j = 3; j < numdeArestas - 4; j += 4) {
        grafo.addAresta(j, j + 3, 50);
      }
    }
    i++;
  }

  const origem = 0;
  const destino = numerodeNos;

  //Focalizando grafo 
  cy.zoom(0.8);
  cy.center();
  
  const fluxoMaximo = grafo.fordFulkerson(origem, destino);

  document.getElementById("maxFluxo").innerHTML = fluxoMaximo;
  console.log("Fluxo máximo encontrado:", fluxoMaximo);
}

// Renderiza um gráfico com 20 nós no começo do programa
renderGrafo();

function renderExemploGrafo() {
  const numeroExemplo = document.getElementById("selectGrafo").value;
  switch (numeroExemplo) {
    case "1":
      alert(1);
      break;
    case "2":
      alert(2);
      break;
    case "3":
      alert(3);
      break;
    default:
      break;
  }
}
