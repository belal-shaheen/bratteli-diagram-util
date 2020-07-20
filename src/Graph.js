class Graph {
  constructor(maxLevel = null) {
    this._maxLevel = maxLevel;
    this._nodes = {};
    this._adjList = {};
  }

  getNode(key) {
    return this._nodes[key];
  }

  getNodes() {
    const nodes = [];
    for (let key of Object.keys(this._nodes)) {
      nodes.push({
        id: this._nodes[key]._key.key,
        label: this._nodes[key]._key.key,
        title: this._nodes[key]._key.key,
      });
    }

    return nodes;
  }

  getEdges() {
    const edges = [];
    const values_3_edges = [-0.3, 0, 0.3];
    const values_4_edges = [-0.3, -0.1, 0.1, 0.3];
    const values_5_edges = [-0.6, -0.4, -0.2, 0, 0.2];
    for (let key of Object.keys(this._adjList)) {
      for (let edge of this._adjList[key]) {
        let array_to_use;
        if (this._adjList[key].length === 3) array_to_use = values_3_edges;
        else if (this._adjList[key].length === 4) array_to_use = values_4_edges;
        else if (this._adjList[key].length === 5) array_to_use = values_5_edges;
        else array_to_use = values_3_edges;
        edges.push({
          from: key,
          to: edge._toNode._key.key,
          label: `${edge._value}`,
          title: `${edge._value}`,
          id: `${key}.${edge._value}.${edge._toNode._key.key}`,
          smooth: {
            enabled: true,
            type: 'curvedCCW',
            roundness: array_to_use[parseInt(edge._value)],
          },
          width: 4,
          shadow: { enabled: true },
          selectionWidth: 2,
          font: {
            size: 20,
          },
        });
      }
    }

    return edges;
  }

  addNodes(nodes) {
    for (let node of nodes) {
      this._nodes[node._key.key] = node;
      this._adjList[node._key.key] = [];
    }
  }

  addEdge(node1, node2, value) {
    this._adjList[node1._key.key].push(new Edge(node2, value));
    // this._adjList[node2._key.key].push(new Edge(node1, value));
  }

  canAdvanceAndReachRoot(path) {
    const rootKey = new NodeKey(0, 0);

    // Order the path.
    path.sort((a, b) => a._level - b._level);

    let result = [];
    // Trying to advance in each position and check if the root node can be reached
    for (let position of path) {
      if (position._level === 0) {
        continue;
      }

      // Trying to advance for the position
      let positionResult = this.advance(rootKey, position, [], [], result);
      if (!positionResult && !positionResult.length) {
        // Can't advance anymore => return false
        return [];
      }
    }

    return result; // The path can be advanced.
  }

  advance(rootKey, currentKey, keyChain, edgesChain, result) {
    // If the root node is reached then can be advanced => return true.
    if (currentKey._level === rootKey._level) {
      if (currentKey._id !== rootKey._id) {
        return false;
      }

      result.push([keyChain, edgesChain]);

      return true;
    }

    // Order the edges by value and process them one by one.
    let edges = [];
    for (let edge of this._adjList[currentKey.key]) {
      if (edge._toNode._key._level === currentKey._level - 1) {
        edges.push(edge);
      }
    }
    edges.sort((a, b) => a._value - b._value);

    for (let edge of edges) {
      if (edge.processed) {
        edge.unProcess();
        continue;
      }

      let keyChainPath = [...keyChain, currentKey.key, edge._toNode._key.key];
      let edgeChainPath = [
        ...edgesChain,
        `${currentKey.key}.${edge._value}.${edge._toNode._key.key}`,
      ];
      this.advance(
        rootKey,
        edge._toNode._key,
        keyChainPath,
        edgeChainPath,
        result
      );
    }

    return true;
  }
}

class Node {
  constructor(level, id, lastLevel = false) {
    this._key = new NodeKey(level, id);
    this._lastLevel = lastLevel;
  }
}

class Edge {
  constructor(node, value, processed = false) {
    this._toNode = node;
    this._value = value;
    this._processed = processed;
  }

  process() {
    this._processed = true;
  }

  unProcess() {
    this._processed = false;
  }

  toString() {
    return `${this._toNode.key} ${this._value}`;
  }
}

class NodeKey {
  constructor(level, id) {
    this._level = level;
    this._id = id;
  }

  get key() {
    return `${this._level}-${this._id}`;
  }
}

class GraphHelpers {
  getPathFromRoot(graph, targeLevel, targetId) {
    let level = 0;

    var path = [];
    let edge;

    while (level <= targeLevel) {
      for (let e of graph._adjList[`${level}-0`]) {
        if (e._value === 0 && e._toNode._key._level === level - 1) {
          edge = e;
          break;
        }
      }

      if (edge != null) {
        edge.process();
      }

      path.push(new NodeKey(level++, 0));
    }

    return path;
  }
}

export { Graph, Node, Edge, NodeKey, GraphHelpers };
