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
  }

  addNo(id) {
    if (!this.nos[id]) {
      this.nos[id] = new No(id);

      cy.add({
        group: "nodes",
        data: { id: id },
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
      console.log(noAtual);
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
    }

    return fluxoMaximo;
  }
}

// Exemplo de uso
const grafo = new Grafo();

// Adiciona os nós ao grafo
grafo.addNo(0);
grafo.addNo(1);
grafo.addNo(2);
grafo.addNo(3);

// Adiciona as arestas ao grafo
grafo.addAresta(0, 1, 2);
grafo.addAresta(0, 2, 4);
grafo.addAresta(1, 2, 3);
grafo.addAresta(1, 3, 1);
grafo.addAresta(2, 3, 5);

cy.layout({
  name: "grid",
}).run();

const origem = 0;
const destino = 3;

const fluxoMaximo = grafo.fordFulkerson(origem, destino);

console.log("Fluxo máximo encontrado:", fluxoMaximo);
