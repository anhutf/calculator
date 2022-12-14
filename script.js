const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "x"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];
const idBtn = [
  "clear",
  "invert",
  "percent",
  "divide",
  "seven",
  "eight",
  "nine",
  "multiply",
  "four",
  "five",
  "six",
  "subtract",
  "one",
  "two",
  "three",
  "add",
  "zero",
  "decimal",
  "equals",
];

const Button = ({ value, id }) => {
  const { calc, setCalc } = React.useContext(CalcContext);

  // User click comma
  const decimalClick = () => {
    setCalc({
      ...calc,
      num: calc.num.includes(".") ? calc.num : calc.num + value,
      process: calc.num.includes(".") ? calc.process : calc.process + value,
    });
  };

  // User click C
  const resetClick = () => {
    setCalc({ sign: "", num: "0", res: "0", process: "0" });
  };

  // User click number
  const handleClickButton = () => {
    const numberString = value.toString();

    let numberValue;
    if (numberString === "0" && calc.num === "0") {
      numberValue = "0";
    } else if (numberString !== "0" && calc.num === "0") {
      numberValue = numberString;
    } else {
      numberValue = calc.num + numberString;
    }
    setCalc({
      ...calc,
      num: numberValue,
      process:
        calc.process === "0" ? numberString : calc.process + numberString,
    });
  };

  // User click operation
  const signClick = () => {
    // Check sign
    if (
      (calc.sign === "x" || calc.sign === "/") &&
      value === "-" &&
      !Number(calc.num)
    ) {
      value = calc.sign + value;
    }

    let newRes;
    let newProcess;
    if (!Number(calc.res) && !Number(calc.num)) {
      return;
    } else if (!Number(calc.res) && Number(calc.num)) {
      newRes = calc.num;
      newProcess = calc.process + value;
    } else if (Number(calc.res) && !Number(calc.num)) {
      newRes = calc.res;
      newProcess = calc.res + value;
    } else {
      newRes = result[calc.sign](Number(calc.res), Number(calc.num));
      newProcess =
        result[calc.sign](Number(calc.res), Number(calc.num)) + value;
    }

    setCalc({
      sign: value,
      num: "0",
      res: newRes,
      process: newProcess,
    });
  };

  // User click equals
  const result = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    x: (a, b) => a * b,
    "x-": (a, b) => a * -b,
    "/": (a, b) => a / b,
    "/-": (a, b) => a / -b,
  };

  const equalsClick = () => {
    if (Number(calc.res) && Number(calc.num)) {
      const math = (a, b, sign) => {
        return result[sign](a, b);
      };

      setCalc({
        res: math(Number(calc.res), Number(calc.num), calc.sign),
        sign: "",
        num: "0",
        process: calc.process,
      });
    }
  };

  // User click persen
  const percentClick = () => {
    setCalc({
      num: String(calc.num / 100),
      res: calc.num === "0" ? calc.res / 100 : calc.res,
      sign: calc.sign,
      process:
        calc.num === "0"
          ? calc.res / 100
          : calc.res === "0"
          ? String(calc.num / 100)
          : calc.res + calc.sign + String(calc.num / 100),
    });
  };

  // User click invert
  const invertClick = () => {
    setCalc({
      num: Number(calc.num) ? calc.num * -1 : calc.num,
      res: calc.num === "0" && !calc.sign ? calc.res * -1 : calc.res,
      sign: calc.sign,
      process:
        calc.num === "0" && !calc.sign
          ? calc.res * -1
          : calc.res === "0"
          ? String(calc.num * -1)
          : calc.res + calc.sign + String(calc.num * -1),
    });
  };

  const handleClick = () => {
    const results = {
      ".": decimalClick,
      C: resetClick,
      "/": signClick,
      x: signClick,
      "-": signClick,
      "+": signClick,
      "=": equalsClick,
      "%": percentClick,
      "+-": invertClick,
    };
    if (results[value]) {
      return results[value]();
    } else {
      return handleClickButton();
    }
  };
  return (
    <button className="button" id={id} onClick={handleClick}>
      {value}
    </button>
  );
};

const ButtonBox = ({ children }) => {
  return <div className="button-box">{children}</div>;
};

const Screen = () => {
  const { calc } = React.useContext(CalcContext);
  return (
    <div className="screen">
      <div className="main-screen" id="display">
        {Number(calc.num) ? calc.num : calc.res}
      </div>
      <div className="sub-screen">{calc.process}</div>
    </div>
  );
};

//context
const CalcContext = React.createContext();

const Calculator = () => {
  const [calc, setCalc] = React.useState({
    sign: "",
    num: "0",
    res: "0",
    process: "0",
  });
  const providerValue = { calc, setCalc };

  return (
    <div className="wrapper">
      <CalcContext.Provider value={providerValue}>
        <Screen />
        <ButtonBox>
          {btnValues.flat().map((btn, id) => {
            return <Button id={idBtn[id]} value={btn} key={id} />;
          })}
        </ButtonBox>
      </CalcContext.Provider>
    </div>
  );
};

ReactDOM.render(<Calculator />, document.getElementById("root"));
