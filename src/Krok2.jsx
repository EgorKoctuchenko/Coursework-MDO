import { useEffect, useState } from "react";
import "./App.css";

function Krok2(props) {
  const [zapasi, setZapasi] = useState(props.col1);
  const [potreb, setPotreb] = useState(props.row1);
  const [matrix, setMatrix] = useState(null);
  const [er, setEr] = useState(false);
  const [allFilled, setAllFilled] = useState(false);
  useEffect(() => {
    if (zapasi < 10 && potreb < 10) {
      setEr(false);
      const rows = parseInt(zapasi, 10);
      const cols = parseInt(potreb, 10);

      if (rows > 0 && cols > 0) {
        const newMatrix = Array.from({ length: rows + 1 }, () =>
          Array.from({ length: cols + 1 }, () => "")
        );
        setMatrix(newMatrix);
      }
    }
    if (zapasi >= 10 || potreb >= 10) {
      setEr(true);
      setMatrix(null);
    }
  }, []);
  useEffect(() => {
    if (matrix) {
      const allCellsFilled = matrix.every((row, rowIndex) =>
        row.every((cell, colIndex) => {
          if (rowIndex === 0 && colIndex === 0) {
            return true;
          }
          return cell !== "";
        })
      );
      setAllFilled(allCellsFilled);
    }
  }, [matrix]);
  const handleButtonClick2 = () => {
    props.setKrok((prevState) => prevState + 1);

    props.setMatrix(matrix);
  };
  const handleButtonClick3 = () => {
    props.setKrok((prevState) => prevState - 1);

    props.setMatrix(null);
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedMatrix = matrix.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex ? value : cell
      )
    );
    setMatrix(updatedMatrix);
  };

  return (
    <main>
      <button onClick={handleButtonClick3} className="GetBut3">
        <svg
          fill="#000000"
          id="Capa_1"
          width="20px"
          height="20px"
          viewBox="0 0 400.004 400.004"
        >
          <g>
            <path
              d="M382.688,182.686H59.116l77.209-77.214c6.764-6.76,6.764-17.726,0-24.485c-6.764-6.764-17.73-6.764-24.484,0L5.073,187.757
		c-6.764,6.76-6.764,17.727,0,24.485l106.768,106.775c3.381,3.383,7.812,5.072,12.242,5.072c4.43,0,8.861-1.689,12.242-5.072
		c6.764-6.76,6.764-17.726,0-24.484l-77.209-77.218h323.572c9.562,0,17.316-7.753,17.316-17.315
		C400.004,190.438,392.251,182.686,382.688,182.686z"
            />
          </g>
        </svg>
        <span>Повернутися</span>
      </button>
      <h2 className="Krok1H2">Крок 2.</h2>
      <h3 className="Krok1H3">
        На цьому етапі вам необхідно вказати заповнити усі комірки. Важно
        помітити:
      </h3>
      <article className="ToCenter">
        <section className="AbovePic FixUp">
          <div className="Square1"></div>
          <h4 className="H4Nazva"> Цей колір означатиме "Запаси"</h4>
        </section>
        <section className="AbovePic">
          <div className="Square2"></div>
          <h4 className="H4Nazva"> Цей колір означатиме "Потреби"</h4>
        </section>
        <section className="AbovePic">
          <div className="Square3"></div>
          <h4 className="H4Nazva">
            {" "}
            Цей колір означатиме "Відстані між пунктами"
          </h4>
        </section>
        {er === true && (
          <p className="erP">
            Помилка! Вхідна таблиця не може бути мати більше 9 рядків чи
            стовпців!
          </p>
        )}
        {matrix && <h3 className="Krok1H3">Ваша матриця:</h3>}
        {matrix && (
          <div className="scrollable">
            <table border="1">
              <tbody>
                {matrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td
                        className="fixTable"
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
                          <div className="InputFieldNone"></div>
                        ) : (
                          <input
                            maxLength={3}
                            className="InputField2"
                            type="text"
                            value={cell}
                            onChange={(e) =>
                              handleCellChange(
                                rowIndex,
                                colIndex,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {allFilled && (
          <button onClick={handleButtonClick2} className="GetBut2">
            Перейти до наступний кроку
          </button>
        )}
      </article>
    </main>
  );
}

export default Krok2;
