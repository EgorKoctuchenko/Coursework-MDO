import { useState } from "react";
import "./App.css";

function Krok1(props) {
  const [zapasi, setZapasi] = useState(0);
  const [potreb, setPotreb] = useState(0);
  const [matrix, setMatrix] = useState(null);
  const [er, setEr] = useState(false);
  const [reade, setReade] = useState(false);

  const handleButtonClick = () => {
    if (zapasi < 10 && potreb < 10) {
      setEr(false);
      const rows = parseInt(zapasi, 10);
      const cols = parseInt(potreb, 10);

      if (rows > 0 && cols > 0) {
        const newMatrix = Array.from({ length: rows + 1 }, () =>
          Array.from({ length: cols + 1 }, () => "")
        );
        setReade(true);
        setMatrix(newMatrix);
      }
    }
    if (zapasi >= 10 || potreb >= 10) {
      setEr(true);
      setMatrix(null);
    }
  };
  const handleButtonClick2 = () => {
    props.setKrok((prevState) => prevState + 1);
    props.setRow1(potreb);
    props.setCol1(zapasi);
  };

  return (
    <main>
      <h2 className="Krok1H2">Крок 1.</h2>
      <h3 className="Krok1H3">
        На цьому етапі вам необхідно вказати кількість Запасів та Потреб. Будь
        ласка, заповніть нижче рядки.
      </h3>
      <article className="ToCenter">
        <div className="FieldToInput">
          <section>
            <h4 className="Krok1H4">Кількість запасів</h4>
            <input
              className="InputField"
              type="number"
              placeholder="Введіть кількість потреб"
              value={zapasi}
              onChange={(e) => setZapasi(e.target.value)}
              required
            />
          </section>
          <section>
            <h4 className="Krok1H4">Кількість Потреб</h4>
            <input
              className="InputField"
              type="number"
              value={potreb}
              onChange={(e) => setPotreb(e.target.value)}
              placeholder="Введіть кількість потреб"
              required
            />
          </section>
        </div>
        {er === true && (
          <p className="erP">
            Помилка! Вхідна таблиця не може бути мати більше 9 рядків чи
            стовпців!
          </p>
        )}
        <button onClick={handleButtonClick} className="GetBut">
          Отримати початкову таблицю
        </button>
        {matrix && <h3 className="Krok1H3">Готова матриця:</h3>}
        {matrix && (
          <div className="scrollable">
            <table border="1" className="fixMobile">
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
                        <div className="InputField2"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {potreb < 10 &&
          zapasi < 10 &&
          potreb !== 0 &&
          zapasi !== 0 &&
          er === false &&
          reade === true && (
            <button onClick={handleButtonClick2} className="GetBut2">
              Перейти до наступний кроку
            </button>
          )}
      </article>
    </main>
  );
}

export default Krok1;
