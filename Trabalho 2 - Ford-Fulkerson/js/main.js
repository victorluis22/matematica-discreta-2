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
        case 5: // resetando
        this.posicaoDesenhoY = this.yBaixo
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

  addAresta(origem, destino, capacidade) {
    const aresta = new Aresta(origem, destino, capacidade);
    this.arestas.push(aresta);

    cy.add({
      group: "edges",
      data: {
        id: "e + " + origem + "" + destino,
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

    const fila = [];
    const noInicial = this.nos[origem];
    noInicial.visitado = true;
    fila.push(noInicial);

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
    }

    return fluxoMaximo;
  }
}

// Exemplo de uso
const grafo = new Grafo();

// Adiciona os nós ao grafo
const numerodeNos = 8;
for (let i = 0; i <= numerodeNos; i++) {
  grafo.addNo(i);
  
}

// Adiciona as arestas ao grafo
const numdeArestas= numerodeNos
grafo.addAresta(0, 1, 100);
grafo.addAresta(0, 2, 50);


grafo.addAresta(1, 2, 50);
grafo.addAresta(1, 3, 50);
grafo.addAresta(1, 4, 50);
grafo.addAresta(2, 3, 100);
grafo.addAresta(3, 4, 125);

const origem = 0;
const destino = 4;

const fluxoMaximo = grafo.fordFulkerson(origem, destino);

console.log("Fluxo máximo encontrado:", fluxoMaximo);
