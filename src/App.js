import React from "react";
import "./App.css";
import GraphVisualizer from "./GraphVisualizer";
import MatrixInput from "./MatrixInput";
import { Graph, Node, NodeKey } from "./Graph";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { graph: [], levelsCount: 0 };
  }

  setMatrixFromInput = async (m, count, edgeValues) => {
    m.unshift([[]]);
    console.log(edgeValues)
    const graph = new Graph(count);
    let index = 0;
    for (let matrix of m) {
      const nodesCountInLevel = matrix.length;
      for (let nodeCount = 0; nodeCount < nodesCountInLevel; ++nodeCount) {
        let node = new Node(index, nodeCount, count === index);
        graph.addNodes([node]);
      }


      if (index === 0) {
        ++index;

        continue;
      }

      for (let i = 0; i < matrix.length; i++) {
        let value = 0;
        let edgeArr = edgeValues[index-1][i].split(',');

        for (let j = 0; j < matrix[i].length; j++) {

          for (let mn = 0; mn < matrix[i][j]; mn++) {
            const new_val = parseInt(edgeArr[value]);
            graph.addEdge(
              graph.getNode(`${index}-${i}`),
              graph.getNode(`${index - 1}-${j}`),
              new_val ? new_val : 0
            );
            value++;

          }
        }
      }
      ++index;
    }

    this.setState({ levelsCount: count, graph: graph });
  };

  

  render() {
    return (
      <div>
        {this.state.graph.length == 0 ? (
          <MatrixInput
            matrix={this.state.array}
            setMatrixFromInput={this.setMatrixFromInput}
          />
        ) : null}
        {this.state.graph.length != 0 ? (
          <GraphVisualizer
            graph={this.state.graph}
            count={this.state.levelsCount}
          ></GraphVisualizer>
        ) : null}
      </div>
    );
  }
}

export default App;
