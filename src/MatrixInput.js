import React from "react";
import _ from "lodash";
import mo from "./mo.png";
import mi from "./mi.png";
import "./MatrixInput.css";

import Collapsible from "react-collapsible";

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
      finalButtonDisabled: true,
      submitButtonDisabled: false,
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

  async setEdgesString(levelCount, i, edgeString) {
    const clone = this.state.edgeValues;

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

    this.setState({ levels: LevelrsArray, edgeValues: newEdgeArrays });
  }

  Level = (levelCount) => {
    let x;
    let y;

    return (
      <div>
        <p class="level">{`Level ${levelCount+1}-${levelCount} incidence matrix: `}</p>
        <div>
          <label>
            X:
            <input
              type="number"
              name="x"
              placeholder={`Vertices in level ${levelCount+1}`}
              style={{ margin: "2px" }}
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
              placeholder={`Vertices in level ${levelCount}`}

              style={{ margin: "2px" }}
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
                    placeholder={`${i},${j}`} 
                    type="text"
                    value={col}
                    style={{ margin: "2px" }}
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
          <p style={{ margin: "2px" }}>
            Edges Values Separted by a comma(the fields will show up after you
            set the dimensions):{" "}
          </p>
          {this.state.reload[parseInt(levelCount)].map((rows, i) => (
            <div>
              {" "}
              <div style={{ display: "flex" }}>
                <input
                  placeholder={`Vertex ${i}, Level ${levelCount+1}`}
                  style={{ margin: "2px" }}
                  type="text"
                  onChange={(e) =>
                    this.setEdgesString(levelCount, i, e.currentTarget.value)
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
    this.setState({ finalButtonDisabled: false });
    this.setState({ submitButtonDisabled: true });
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
  };

  render() {
    return (
      <div>
        <Collapsible trigger="----Click on me for Instructions!----">
          <hr></hr>
          <br />
          <div className="instructions">
            <label>The root level has one vertex for now &#128528;</label>
            <div className="ins-list">
              <ol>
                <li>
                  Set how many levels you want, start numbering from 1 and
                  include the root with it. ( if we have the root and another
                  level, we set the levels to 2. etc... )
                </li>
                <li>
                  After that set the dimensions of the incidence matrix for each
                  level before filling any of the actual matrices. (Note: click set before you move on to the next level)
                </li>
                <li>
                  Start filling the incidence matrix and the edge value fields
                </li>
                <li>
                  You can fill the edge value fields by providing a
                  comma-seperated string, the program will input it from left to
                  right for each vertex.
                </li>
                <li>
                  Click the submit-graph button after you finish filling
                  everything
                </li>
              </ol>
            </div>
            <h5 style={{ display: "inline", margin: "20px" }}> Input: </h5>
            <img style={{ width: "400px", verticalAlign: "middle" }} src={mi} />
            <h5 style={{ display: "inline", margin: "20px" }}> Output: </h5>
            <img style={{ width: "200px", verticalAlign: "middle" }} src={mo} />
            <p>If you have any problems with the input, refresh the site</p>

            <p>
              Email{" "}
              <a
                style={{ color: "white" }}
                href="mailto: bshaheen@hamilton.edu"
              >
                me
              </a>{" "}
              if you encounter any bugs!
            </p>
          </div>
        </Collapsible>

        <br />
        <br />
        <br />

        <div className="levels">
          <label>
            Levels:
            <input
              style={{ margin: "2px" }}
              type="number"
              name="x"
              onChange={this.levelsOnChange}
            ></input>
            <button
              onClick={this.createLevels}
              disabled={this.state.submitButtonDisabled}
            style={{margin: "5px" }}

            >
              Submit
            </button>
          </label>
          {this.state.levels ? this.state.levels : <text>No Levels Yet</text>}
          <hr></hr>

          <button
            onClick={this.passToParent}
            disabled={this.state.finalButtonDisabled}
            style={{margin: "5px" }}
          >
            Submit To Graph
          </button>
        </div>
      </div>
    );
  }
}

export default MatrixInput;
