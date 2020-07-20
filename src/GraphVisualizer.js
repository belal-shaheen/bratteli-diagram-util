import React from 'react';
import Graph from 'react-graph-vis';
import { GraphHelpers } from './Graph';
import './GraphVisualizer.css';
import { Button, ButtonGroup, TextField } from '@material-ui/core';

class GraphVisualizer extends React.Component {
  constructor(props) {
    super(props);
    const helpers = new GraphHelpers();
    this.maxLevel = this.props.count;
    this.graph = this.props.graph;
    this.path = helpers.getPathFromRoot(this.graph, this.maxLevel, 0);
    this.result = this.graph
      .canAdvanceAndReachRoot(this.path)
      .filter((array) => {
        return array[0][0].includes(this.maxLevel.toString());
      });

    
    this.position = 0;
    let c_edges = this.graph.getEdges();

    this.state = {
      currentLevel: 1,
      prevLevel: 0,
      message: '',
      graph: {
        nodes: this.graph.getNodes(),
        edges: c_edges,
      },
      options: {
        layout: {
          hierarchical: {
            direction: 'DU',
            sortMethod: 'directed',
            nodeSpacing: 300, // 300 for the smaller graph
          },
        },
        edges: {
          arrows: { to: { enabled: false } },
          color: {
            color: '#D2E5FF',
            highlight: 'blue',
          },
          chosen: {
            label: function (values, id, selected, hovering) {
              values.color = 'red';
              values.strokeWidth = 3;
              values.strokeColor = 'orange';
            },
          },
        },
        height: window.innerHeight,
        nodes: {
          borderWidth: 4,
          borderWidthSelected: 2,
          brokenImage: undefined,
          chosen: true,
          color: {
            border: '#2B7CE9',
            background: '#fff',
            highlight: {
              border: 'red',
              background: 'red',
            },
            hover: {
              border: '#2B7CE9',
              background: '#D2E5FF',
            },
          },
          fixed: {
            x: false,
            y: false,
          },
        },
      },
    };

    this.state.nodesMessage = 'You can start mapping!';
    this.state.edgesMessage = '';
    this.state.hideNodes = false;
  }

  handleClickForward = () => {
    if (this.position == this.result.length - 1) {
      return;
    }

    this.position++;

    const selected = {
      nodes: this.result[this.position][0],
      edges: this.result[this.position][1],
    };

    this.network.selectEdges(selected.edges);

    this.setState({
      nodesMessage: selected.nodes.join('=>'),
      edgesMessage: selected.edges.map((e) => e.split('.')[1]).join('=>'),
    });
  };

  handleClickBackward = () => {
    if (this.position === 0) return;

    if (this.position >= this.result.length) {
      return;
    }

    this.position--;

    const selected = {
      nodes: this.result[this.position][0],
      edges: this.result[this.position][1],
    };


    this.network.selectEdges(selected.edges);


    this.setState({
      nodesMessage: selected.nodes.join('=>'),
      edgesMessage: selected.edges.map((e) => e.split('.')[1]).join('=>'),
    });
  };

  initZeroPath = () => {
    const selected = {
      nodes: this.result[0][0],
      edges: this.result[0][1],
    };

    this.network.selectEdges(selected.edges);

    this.setState({
      nodesMessage: selected.nodes.join('=>'),
      edgesMessage: selected.edges.map((e) => e.split('.')[1]).join('=>'),
    });
  };

  onNodesOfCurrentLevelChange = (e) => {
    this.setState({
      currentLevel: e.target.value,
    });
  };

  onNodesOfCurrentLevelClick = (e) => {
    const prevLevel = this.state.prevLevel;
    const currentLevel = this.state.currentLevel;

    this.setState({
      prevLevel: currentLevel,
      currentLevel: 0,
    });
  };

  render() {
    return (
      <>
        <nav>
          <h1 id="logo">Vershik Map</h1>
        </nav>
        <ButtonGroup
          className="button-group"
          color="primary"
          aria-label="outlined primary button group"
        >
          <Button className="action" onClick={this.createNewDiagram}>
            New Diagram (WIP)
          </Button>
          <Button className="action" onClick={this.handleClickBackward}>
            Previous
          </Button>
          <Button className="action" onClick={this.handleClickForward}>
            Next
          </Button>
        </ButtonGroup>

        <TextField
          label="Process:"
          multiline
          rowsMax={6}
          style={{
            position: 'absolute',
            left: '2%',
            bottom: '18%',
            zIndex: 2,
            width: '600px',
          }}
          value={this.state.nodesMessage + '\n' + this.state.edgesMessage}
        />

        <Graph
          graph={this.state.graph}
          options={this.state.options}
          getNetwork={(network) => {
            this.network = network;
            this.initZeroPath();
          }}
        />
      </>
    );
  }
}

export default GraphVisualizer;
