import { useState } from "react";
import "./App.css";
import Krok1 from "./Krok1";
import Krok2 from "./Krok2";
import Krok3 from "./Krok3";
import Krok4 from "./Krok4";
import Krok5 from "./Krok5";

function App() {
  const [krok, setKrok] = useState(1);
  const [row, setRow] = useState(0);
  const [cols, setCols] = useState(0);
  const [matrix, setMatrix] = useState(null);

  return (
    <div className="wrap">
      <header>
        <h1>Веб-додаток для розв’язання відкритої транспортної задачі</h1>
      </header>
      {krok === 1 && (
        <Krok1 setCol1={setCols} setRow1={setRow} setKrok={setKrok}></Krok1>
      )}
      {krok === 2 && (
        <Krok2
          col1={cols}
          row1={row}
          setKrok={setKrok}
          setMatrix={setMatrix}
        ></Krok2>
      )}
      {krok === 3 && (
        <Krok3
          setCol1={setCols}
          setRow1={setRow}
          setKrok={setKrok}
          setMatrix={setMatrix}
          matrix={matrix}
        ></Krok3>
      )}
      {krok === 4 && (
        <Krok4
          setCol1={setCols}
          setRow1={setRow}
          setKrok={setKrok}
          setMatrix={setMatrix}
          matrix={matrix}
        ></Krok4>
      )}
      {krok === 5 && (
        <Krok5
          setCol1={setCols}
          setRow1={setRow}
          setKrok={setKrok}
          setMatrix={setMatrix}
          matrix={matrix}
        ></Krok5>
      )}
      <footer>
        <h1>
          Веб-додаток у вигляді курсової роботи був розроблений студентом
          КН21-2,{" "}
          <span style={{ textDecoration: "underline" }}>Костюченко Єгором</span>
          <br />
          Роботу перевірили:{" "}
          <span style={{ textDecoration: "underline" }}>
            Юлія Стукалова
          </span> та{" "}
          <span style={{ textDecoration: "underline" }}>Денис Голуб</span>
        </h1>
      </footer>
    </div>
  );
}

export default App;
