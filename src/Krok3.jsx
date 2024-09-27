import React, { useState, useEffect } from "react";

function Krok3({ setCol1, setRow1, setKrok, setMatrix, matrix }) {
  const [finalResult, setFinalResult] = useState(0);
  const [optimizedMatrix, setOptimizedMatrix] = useState([]);
  const [resultMatrix, setResultMatrix] = useState([]);
  const [steps, setSteps] = useState([]);
  const [objectiveValue, setObjectiveValue] = useState(0);
  const [supl1, setsupl1] = useState(0);
  const [supl2, setsupl2] = useState(0);

  useEffect(() => {
    if (matrix && matrix.length > 1 && matrix[0].length > 1) {
      const { solvedMatrix, history, cost } = solveTransportProblem(matrix);
      setResultMatrix(solvedMatrix);
      setSteps(history);
      setObjectiveValue(cost);
    }
  }, [matrix]);

  const solveTransportProblem = (inputMatrix) => {
    let balancedMatrix = balanceMatrix(inputMatrix);
    const numRows = balancedMatrix.length;
    const numCols = balancedMatrix[0].length;

    let supplies = [...balancedMatrix].slice(1).map((row) => row[0]);
    let demands = [...balancedMatrix[0]].slice(1);

    let result = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => 0)
    );

    let history = [];
    let totalCost = 0;

    let i = 1;
    let j = 1;

    while (i < numRows && j < numCols) {
      let min = Math.min(supplies[i - 1], demands[j - 1]);
      result[i][j] = min;

      history.push({
        matrix: JSON.parse(JSON.stringify(result)),
        supplies: [...supplies],
        demands: [...demands],
        action: `Заповнили комірку [${i}, ${j}] значенням ${min}`,
      });

      totalCost += min * balancedMatrix[i][j];
      supplies[i - 1] -= min;
      demands[j - 1] -= min;

      if (supplies[i - 1] === 0) {
        i++;
      } else {
        j++;
      }
    }

    return {
      solvedMatrix: result,
      history,
      cost: totalCost,
    };
  };

  const balanceMatrix = (matrix) => {
    let supplies = [...matrix].slice(1).map((row) => Number(row[0]));
    let demands = [...matrix[0]].slice(1).map((value) => Number(value));

    let totalSupply = supplies.reduce((sum, value) => sum + value, 0);
    let totalDemand = demands.reduce((sum, value) => sum + value, 0);
    setsupl1(totalSupply);
    setsupl2(totalDemand);

    if (totalSupply === totalDemand) {
      return matrix;
    }

    let balancedMatrix = JSON.parse(JSON.stringify(matrix));

    if (totalSupply > totalDemand) {
      let dummyColumn = Array.from({ length: matrix.length }, () => 0);
      dummyColumn[0] = totalSupply - totalDemand;
      balancedMatrix[0].push(dummyColumn[0]);
      for (let i = 1; i < matrix.length; i++) {
        balancedMatrix[i].push(0);
      }
    } else {
      let dummyRow = Array.from({ length: matrix[0].length }, () => 0);
      dummyRow[0] = totalDemand - totalSupply;
      dummyRow.push(0);
      balancedMatrix.push(dummyRow);
    }

    return balancedMatrix;
  };

  const handleButtonClick2 = () => {
    setCol1(0);
    setRow1(0);
    setMatrix(null);
    setKrok(1);
  };

  const calculatePotentials = (matrix, resultMatrix) => {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    let u = Array(numRows).fill(null);
    let v = Array(numCols).fill(null);
    u[1] = 0;

    let iterations = 0;
    while (u.includes(null) || v.includes(null)) {
      for (let i = 1; i < numRows; i++) {
        for (let j = 1; j < numCols; j++) {
          if (resultMatrix[i][j] !== 0) {
            // базисная ячейка
            if (u[i] !== null && v[j] === null) {
              v[j] = matrix[i][j] - u[i];
            } else if (u[i] === null && v[j] !== null) {
              u[i] = matrix[i][j] - v[j];
            }
          }
        }
      }
      iterations++;
      if (iterations > numRows + numCols) break;
    }

    return { u, v };
  };

  const findCycleAndAdjust = (resultMatrix, startI, startJ) => {
    const numRows = resultMatrix.length;
    const numCols = resultMatrix[0].length;

    let visited = Array.from({ length: numRows }, () =>
      Array(numCols).fill(false)
    );
    let path = [];

    const dfs = (i, j, dir) => {
      if (visited[i][j]) return false;

      visited[i][j] = true;
      path.push([i, j]);

      const directions = [
        { x: -1, y: 0, dir: "up" },
        { x: 1, y: 0, dir: "down" },
        { x: 0, y: -1, dir: "left" },
        { x: 0, y: 1, dir: "right" },
      ];

      for (const { x, y, dir: newDir } of directions) {
        const newI = i + x;
        const newJ = j + y;
        if (
          newI > 0 &&
          newI < numRows &&
          newJ > 0 &&
          newJ < numCols &&
          resultMatrix[newI][newJ] !== 0 &&
          dir !== newDir
        ) {
          if (dfs(newI, newJ, newDir)) return true;
        }
      }

      path.pop();
      return false;
    };

    dfs(startI, startJ, null);

    if (path.length < 4) return resultMatrix;

    let minValue = Math.min(
      ...path
        .filter((_, idx) => idx % 2 === 1)
        .map(([i, j]) => resultMatrix[i][j])
    );

    for (let k = 0; k < path.length; k++) {
      const [i, j] = path[k];
      resultMatrix[i][j] += k % 2 === 0 ? minValue : -minValue;
    }

    return resultMatrix;
  };

  const optimizeWithPotentials = (matrix, resultMatrix) => {
    const { u, v } = calculatePotentials(matrix, resultMatrix);

    const numRows = matrix.length;
    const numCols = matrix[0].length;

    let delta = Array.from({ length: numRows }, () => Array(numCols).fill(0));

    let optimal = true;
    let minDelta = Infinity;
    let minPos = [null, null];

    for (let i = 1; i < numRows; i++) {
      for (let j = 1; j < numCols; j++) {
        if (resultMatrix[i][j] === 0) {
          delta[i][j] = matrix[i][j] - (u[i] + v[j]);
          if (delta[i][j] < 0) {
            optimal = false;
            if (delta[i][j] < minDelta) {
              minDelta = delta[i][j];
              minPos = [i, j];
            }
          }
        }
      }
    }

    if (optimal) {
      return {
        optimizedMatrix: resultMatrix,
        cost: calculateObjectiveValue(matrix, resultMatrix),
      };
    } else {
      const [startI, startJ] = minPos;
      const adjustedMatrix = findCycleAndAdjust(resultMatrix, startI, startJ);
      return optimizeWithPotentials(matrix, adjustedMatrix);
    }
  };

  const calculateOptimalDistribution = () => {
    const matrix2 = balanceMatrix(matrix);
    const demand = matrix2[0].slice(1);
    const supply = matrix2.slice(1).map((row) => row[0]);

    console.log(demand);
    console.log(supply);

    const numSources = supply.length;
    const numConsumers = demand.length;

    let bestMatrix = [];
    let minCost = Infinity;

    for (let value = 5; value <= 50; value += 5) {
      const distribution = Array(numSources)
        .fill(null)
        .map(() => Array(numConsumers).fill(0));

      let currentSupply = [...supply];
      let currentDemand = [...demand];

      for (let i = 0; i < numSources; i++) {
        for (let j = 0; j < numConsumers; j++) {
          let amount = Math.min(currentSupply[i], currentDemand[j], value);
          distribution[i][j] = amount;
          currentSupply[i] -= amount;
          currentDemand[j] -= amount;
          if (currentSupply[i] === 0) break;
        }
      }

      const isValidDistribution =
        currentSupply.every((v) => v === 0) &&
        currentDemand.every((v) => v === 0);

      if (!isValidDistribution) {
        continue;
      }

      const currentCost = distribution.reduce((acc, row, i) => {
        return (
          acc +
          row.reduce((rowAcc, cell, j) => {
            if (matrix2[i + 1] && matrix2[i + 1][j + 1] !== undefined) {
              return rowAcc + cell * matrix2[i + 1][j + 1];
            }
            return rowAcc;
          }, 0)
        );
      }, 0);

      console.log(distribution);
      if (currentCost < minCost) {
        minCost = currentCost;
        bestMatrix = distribution;
      }
    }

    setOptimizedMatrix(bestMatrix);
    let info1 = 0;
    console.log(bestMatrix);
    for (let i = 0; i < numSources; i++) {
      for (let j = 0; j < numConsumers; j++) {
        if (matrix2[i + 1] && matrix2[i + 1][j + 1] !== undefined) {
          info1 += matrix2[i + 1][j + 1] * bestMatrix[i][j];
          console.log(info1);
        }
      }
    }
    setFinalResult(info1);
  };

  return (
    <div>
      <h2 className="Krok1H2">Результат вирішення транспортної задачі:</h2>

      <h3 className="Krok3H3_2">Ваша початкова матриця:</h3>
      {supl1 !== supl2 ? (
        <section>
          <h3 className="Krok3H3_3">
            <span className="allDem">{supl1}</span> |{" "}
            <span className="allSupl">{supl2}</span>
          </h3>
          <h3 className="Krok3H3_3">
            Отже, у вас відкритий тип транспортної задачі.
          </h3>
        </section>
      ) : (
        <section>
          <h3 className="Krok3H3_3">
            <span className="allDem">{supl1}</span> |{" "}
            <span className="allSupl">{supl2}</span>
          </h3>
          <h3 className="Krok3H3_3">
            Отже, у вас закритий тип транспортної задачі.
          </h3>
        </section>
      )}
      <table border="1" className="ThisLine2">
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  className="fixTable2"
                  key={colIndex}
                  style={{
                    backgroundColor:
                      rowIndex === 0
                        ? "lightgreen"
                        : colIndex === 0
                        ? "lightcoral"
                        : "white",
                  }}
                >
                  {rowIndex === 0 && colIndex === 0 ? (
                    <div></div>
                  ) : (
                    <div> {cell}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="Krok3H3_4">Історія розрахунків:</h3>
      <ul className="ThisList">
        {steps.map((step, index) => (
          <li className="ThisLine" key={index}>
            <strong>Крок {index + 1}:</strong> {step.action}
            <br />
            <table border="1" className="FixingMarginTable">
              <tbody>
                {step.matrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className="fixTable2"
                        style={{
                          backgroundColor:
                            rowIndex === 0
                              ? "lightgreen"
                              : colIndex === 0
                              ? "lightcoral"
                              : "white",
                        }}
                      >
                        {rowIndex === 0 && colIndex === 0 ? (
                          <div></div>
                        ) : rowIndex === 0 ? (
                          <div>{step.demands[colIndex - 1]}</div>
                        ) : colIndex === 0 ? (
                          <div>{step.supplies[rowIndex - 1]}</div>
                        ) : (
                          <div>{cell}</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </li>
        ))}
      </ul>

      <h3 className="Krok3H3_2">Кінцева матрица:</h3>
      {resultMatrix.length > 1 && resultMatrix[0].length > 1 && (
        <table className="ThisLine2" border="1">
          <tbody>
            {resultMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="fixTable2"
                    style={{
                      backgroundColor:
                        rowIndex === 0
                          ? "lightgreen"
                          : colIndex === 0
                          ? "lightcoral"
                          : "white",
                    }}
                  >
                    {rowIndex === 0 && colIndex === 0 ? (
                      <div className="FixNoneSquare"></div>
                    ) : (
                      <div> {cell}</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 className="Krok3H3">Значення цільової функції: {objectiveValue}</h3>
      <div className="fixBut">
        <button onClick={calculateOptimalDistribution} className="GetBut2">
          Отримати оптимізовану версію
        </button>
      </div>

      {finalResult !== 0 && (
        <div>
          <table className="ThisLine2" border="1">
            <thead></thead>
            <tbody>
              {optimizedMatrix.map((row, i) => (
                <tr key={i}>
                  <td
                    style={{
                      backgroundColor: "white",
                    }}
                    className="fixTable2"
                  >
                    Споживач {i + 1}
                  </td>
                  {row.map((cell, j) => (
                    <td
                      className="fixTable2"
                      key={j}
                      style={{
                        backgroundColor: "white",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="Krok3H3">
            Значення цільової функції (після оптимізації): {finalResult}
          </div>
          <div className="fixBut">
            <button onClick={handleButtonClick2} className="GetBut2">
              Побудувати нову матрицю
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Krok3;
