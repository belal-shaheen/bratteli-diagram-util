import React from "react";
import _ from "lodash";
import mo from "./mo.png";
import mi from "./mi.png";
import './MatrixInput.css';

import Collapsible from 'react-collapsible';


class MatrixInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dims: { x: 0, y: 0 },
      reload: [],
      levelsCount: 0,
      pushed: false,
      levels: [],
      edgeValues: [],
    };
  }

  setItem(levelCount, x, y, value) {
    const clone = this.state.reload;
    clone[levelCount][x][y] = value;

    this.setState({ reload: clone });
  }

  levelsOnChange = (e) => {
    let levels = e.currentTarget.value - 1;
    this.setState({ levelsCount: levels });
  };

  async createArray(x, y, levelCount) {
    return new Promise((resolve) => {
      let arr1 = [];
      for (let i = 0; i < x; i++) {
        arr1.push([]);
        for (let j = 0; j < y; j++) {
          arr1[i].push(null);
        }
      }

      let newLevels = {};
      if (this.state.reload[0] === undefined) {
        newLevels[levelCount] = arr1;
      } else {
        newLevels = _.cloneDeep(this.state.reload);
        newLevels[levelCount] = arr1;
      }

      resolve(newLevels);
    });
  }

  async setEdgesString(levelCount, i, edgeString){

    const clone = (this.state.edgeValues);

    clone[levelCount][i] = edgeString;
    await this.setState({ edgeValues: clone });

  }

  async changeReloadState(x, y, levelCount) {
    await this.setState({ reload: await this.createArray(x, y, levelCount) });
    let newEdgeArrays = [];
    let LevelrsArray = [];
    for (let i = 0; i < this.state.levelsCount; i++) {
      LevelrsArray.push(this.Level(i));

      newEdgeArrays.push([]);
    }

    this.setState({ levels: LevelrsArray , edgeValues: newEdgeArrays});
  }

  Level = (levelCount) => {
    let x;
    let y;

    return (
      <div>
        <div>
          <label>
            X:
            <input
              type="number"
              name="x"
              onChange={(e) => {
                const { name, value } = e.currentTarget;
                x = value;
              }}
            />
          </label>
          <label>
            Y:
            <input
              type="number"
              name="y"
              onChange={(e) => {
                const { name, value } = e.currentTarget;
                y = value;
              }}
            />
          </label>
          <button
            onClick={() => {
              this.changeReloadState(x, y, levelCount);
            }}
          >
            Set
          </button>
        </div>
        <div>
          {this.state.reload[parseInt(levelCount)].map((rows, i) => (
            <div style={{ display: "flex" }}>
              {rows.map((col, j) => (
                <div>
                  <input
                    type="text"
                    value={col}
                    onChange={(e) =>
                      this.setItem(
                        levelCount,
                        i,
                        j,
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          Edges
          {this.state.reload[parseInt(levelCount)].map((rows, i) => (
            <div> <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    onChange={(e) =>
                      this.setEdgesString(
                        levelCount,
                        i,
                        (e.currentTarget.value)
                      )
                    }
                  />
                </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  createLevels = () => {
    if (!this.state.pushed) {
      let temp = [];
      for (let i = 0; i < this.state.levelsCount; i++) {
        temp.push([]);
      }

      this.setState({ reload: temp }, () => {
        let LevelrsArray = [];
        for (let i = 0; i < this.state.levelsCount; i++) {
          LevelrsArray.push(this.Level(i));
        }
        this.setState({ levels: LevelrsArray });
      });
      this.state.pushed = true;
    }
  };

  passToParent = () => {
    const pass = this.props.setMatrixFromInput;
    pass(this.state.reload, this.state.levelsCount, this.state.edgeValues);
  }

  render() {
    return (
      <div>
        <Collapsible  trigger="Click on me for Instructions! ">
        <div>
        <label>The root level always has one node for now :)</label>
          <ol>
            <li>Set how many levels you want, start numbering from 1 and include the root with it. ( if we have the root and another level, we set the levels to 2. etc... )</li>
            <li>After that set the dimensions of the incidence matrix for each level before filling any of them</li>
            <li>Start filling the incidence matrix and the edge value fields</li>
            <li>You can fill the edge value fields by providing a comma-seperated string, the program will input it from left to right.</li>
          </ol>
          <h5 style={{display:"inline"}}>Input</h5>
          <img style={{width:"400px"}} src={mi}/>
          <h5 style={{display:"inline"}}>Output:</h5>
          <img style={{width:"200px"}} src={mo}/>
          <p>If you have any problems with the input, refresh the site</p>
        </div></Collapsible>
        <br/>
        <br/>
        <br/>
        
        <br/>
        <label>
          Levels:
          <input type="number" name="x" onChange={this.levelsOnChange}></input>
          <button onClick={this.createLevels}>Submit</button>
        </label>
        {this.state.levels ? this.state.levels : <text>No Levels Yet</text>}
        <button onClick={this.passToParent} >Submit To Graph</button>
      </div>
    );
  }
}

export default MatrixInput;
