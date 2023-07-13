var cy = cytoscape({

    container: document.getElementById('cy'), // container to render in
  

  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#3771c8',
          'label': 'data(id)'
        }
      },
  
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': 'black',
          'target-arrow-color': 'black',
          'target-arrow-shape': 'triangle',
         'label': 'data(weight)'
    
        }
      }
    ],
    layout: {
        name: 'grid',
        rows: 1
      },
    
 
  });

/*
cy.add({
    group: 'edges',
    data: { id: 'e0', source: '0', target: '1' } 

});

cy.add({
    group: 'edges',
    data: { id: 'e1', source: '0', target: '2' } 

});*/

