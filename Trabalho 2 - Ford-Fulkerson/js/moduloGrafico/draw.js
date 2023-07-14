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

