"use client";

import styles from "./sandbox.module.css";
import "./global.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ThemeButton, HomeButton } from "../themebutton";

function LoadingScreen() {
  const [loaded, setLoaded] = useState(false);
  const timeout = 10;
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setThemeInit();
    const checkServer = async () => {
      try {
        // Check api state
        const response = await fetch("http://localhost:18080/check");

        // Proceed
        if (response.status == 200) {
          setLoaded(true);
          setTimer(0);
        }
      } catch (error) {
        setLoaded(false);
        console.error("Error checking server:", error);
      }
    };

    checkServer();

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
      checkServer();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const setThemeInit = () => {
    let curr = Cookies.get("theme");
    const body = document.getElementById("body");
    body.dataset.theme = curr === "dark" ? "dark" : "light";
  };

  return (
    <div className={styles.body} id="body">
      <HomeButton styles={styles} />
      <ThemeButton styles={styles} />
      {loaded ? (
        <Content />
      ) : (
        <LoadingMessage timer={timer} timeout={timeout} />
      )}
    </div>
  );
}

function LoadingMessage({ timer, timeout }) {
  return (
    <>
      <span className={styles.loading}>Connecting... {timer}s</span>
      {timer > timeout ? (
        <span className={styles.timeout}>
          Api not responding. Is it up and running?
        </span>
      ) : (
        <></>
      )}
    </>
  );
}

export default function Sandbox() {
  return <LoadingScreen />;
}

function Content() {
  const [timer, setTimer] = useState(0);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const checkExistingSet = async () => {
      try {
        // Check api state
        const response = await fetch("http://localhost:18080/read");

        // Proceed
        if (response.status == 200) {
          const data = await response.json(); // Await here to get the parsed JSON data
          setInfo(data);
          setTimer(0);
        } else {
          setInfo(null);
        }
      } catch (error) {
        setInfo(null);
        console.error("Error checking server:", error);
      }
    };

    checkExistingSet();

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
      checkExistingSet();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {info != null ? (
        <SetFound info={info} setInfo={setInfo} />
      ) : (
        <NoSetFound info={info} setInfo={setInfo} />
      )}
    </>
  );
}

function NoSetFound({ info, setInfo }) {
  const [creationSize, setCreationSize] = useState(10);

  const createSparseSet = async () => {
    if (creationSize > 0 && creationSize <= 100) {
      try {
        const responseCreate = await fetch(
          `http://localhost:18080/create/${creationSize}`
        );

        if (responseCreate.status === 201) {
          console.log("Sparse set created successfully");

          // Fetch created set
          const responseRead = await fetch("http://localhost:18080/read");

          if (responseRead.status === 200) {
            const data = await responseRead.json(); // Await here to get the parsed JSON data
            setInfo(data);
          } else {
            console.error("Failed to fetch data after creating sparse set");
          }
        } else {
          console.error("Failed to create sparse set");
        }
      } catch (error) {
        console.error("Error creating sparse set:", error);
      }
    } else {
      alert("Invalid size!");
    }
  };

  const limitInputLength = (e) => {
    let newValue = e.target.value.slice(0, 3);
    if (e.target.value > 100) {
      e.target.value = 100;
      newValue = 100;
    }
    setCreationSize(newValue);
  };

  return (
    <div className={styles.creationContainer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "var(--small)",
        }}
      >
        <span className={styles.loading}>
          My sparse set will hold numbers up to &nbsp;
        </span>
        <input
          onChange={limitInputLength}
          value={creationSize}
          className={styles.creationInput}
          required
          type="number"
          min={1}
          max={100}
          minLength={1}
          maxLength={3}
          placeholder="10"
          id="size"
        />
      </div>
      <button className={styles.fetchButton} onClick={createSparseSet}>
        Create
      </button>
    </div>
  );
}

function SetFound({ info, setInfo }) {
  const [hoveredDense, setHoveredDense] = useState(null);
  const [hoveredSparse, setHoveredSparse] = useState(null);

  const [foundDense, setFoundDense] = useState(-1);
  const [foundSparse, setFoundSparse] = useState(-1);

  const handleDenseHover = (value) => {
    setHoveredSparse(value != -1 ? value : null);
  };

  const handleSparseHover = (value) => {
    setHoveredDense(value != -1 ? value : null);
  };

  const handleAnimationEnd = (event) => {
    event.target.classList.remove(styles.found);
    setFoundDense(-1);
    setFoundSparse(-1);
  };

  const displayDense = () => {
    return info["dense"].map((value, index) => (
      <div
        key={index}
        className={`${styles.setSquare} ${
          hoveredDense === index ? styles.hovered : ""
        } ${foundDense === index ? styles.found : ""}`}
        onMouseEnter={() => handleDenseHover(value)}
        onMouseLeave={() => handleDenseHover(null)}
        onAnimationEnd={handleAnimationEnd}
      >
        {value != -1 ? value : null}
      </div>
    ));
  };

  const displaySparse = () => {
    return info["sparse"].map((value, index) => (
      <div
        key={index}
        className={`${styles.setSquare} ${
          hoveredSparse === index ? styles.hovered : ""
        } ${foundSparse === index ? styles.found : ""}`}
        onMouseEnter={() => handleSparseHover(value)}
        onMouseLeave={() => handleSparseHover(null)}
        onAnimationEnd={handleAnimationEnd}
      >
        {value != -1 ? value : null}
      </div>
    ));
  };

  // Assuming `info` contains two arrays named `firstArray` and `secondArray`
  const dense = displayDense();
  const sparse = displaySparse();

  return (
    <div className={styles.setContainer}>
      <span className={styles.label}>Dense Array</span>
      <div className={styles.array} id="dense">
        {dense}
      </div>
      <span className={styles.label}>Sparse Array</span>
      <div className={styles.array} id="sparse">
        {sparse}
      </div>
      <Controls
        info={info}
        setInfo={setInfo}
        foundDense={foundDense}
        foundSparse={foundSparse}
        setFoundDense={setFoundDense}
        setFoundSparse={setFoundSparse}
      />
    </div>
  );
}

function Controls({
  info,
  setInfo,
  foundDense,
  foundSparse,
  setFoundDense,
  setFoundSparse,
}) {
  const [currentValue, setCurrentValue] = useState(0);

  const limitInputLength = (e) => {
    let newValue = e.target.value.slice(0, 3);
    if (e.target.value > info["maxValue"]) {
      e.target.value = info["maxValue"];
      newValue = info["maxValue"];
    }
    setCurrentValue(newValue);
  };

  const insert = async () => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:18080/insert/${currentValue}`
      );
      // Proceed
      if (response.status == 201) {
        const response = await fetch("http://localhost:18080/read");

        // Proceed
        if (response.status == 200) {
          const data = await response.json(); // Await here to get the parsed JSON data
          setInfo(data);
        } else {
          setInfo(null);
        }
      } else if (response.status == 400) {
        window.alert("Value already exists or is invalid!");
      }
    } catch (error) {
      console.error("Error inserting value:", error);
    }
  };

  const del = async () => {
    try {
      const response = await fetch(`http://localhost:18080/delete`);

      if (response.status == 200) {
        const response = await fetch("http://localhost:18080/read");

        if (response.status == 200) {
          const data = await response.json();
          setInfo(data);
        } else {
          setInfo(null);
        }
      }
    } catch (error) {
      console.error("Error deleting set:", error);
    }
  };

  const clear = async () => {
    try {
      const response = await fetch(`http://localhost:18080/clear`);

      if (response.status == 200) {
        const response = await fetch("http://localhost:18080/read");

        if (response.status == 200) {
          const data = await response.json();
          setInfo(data);
        } else {
          setInfo(null);
        }
      }
    } catch (error) {
      console.error("Error clearing set:", error);
    }
  };

  const remove = async () => {
    try {
      const response = await fetch(
        `http://localhost:18080/remove/${currentValue}`
      );

      if (response.status == 200) {
        const response = await fetch("http://localhost:18080/read");

        if (response.status == 200) {
          const data = await response.json();
          setInfo(data);
        } else {
          setInfo(null);
        }
      } else if (response.status == 404) {
        window.alert("Value doesn't exist!");
      }
    } catch (error) {
      console.error("Error removing value:", error);
    }
  };

  const find = async () => {
    try {
      const response = await fetch(
        `http://localhost:18080/find/${currentValue}`
      );

      if (response.status == 200) {
        const denseIndex = await response.json();
        setFoundDense(denseIndex);
        setFoundSparse(info["dense"][denseIndex]);
      } else if (response.status == 404) {
        setFoundDense(-1);
        setFoundSparse(-1);
        window.alert("Value was not found!");
      }
    } catch (error) {
      console.error("Error removing value:", error);
    }
  };

  return (
    <div className={styles.controls}>
      <form onSubmit={insert}>
        <input
          onChange={limitInputLength}
          value={currentValue}
          className={styles.creationInput}
          required
          type="number"
          min={0}
          max={100}
          minLength={1}
          maxLength={3}
          placeholder="0"
          id="size"
        />
      </form>
      <button className={styles.fetchButton} onClick={insert}>
        Insert
      </button>
      <button className={styles.fetchButton} onClick={find}>
        Find
      </button>
      <button className={styles.fetchButton} onClick={remove}>
        Remove
      </button>
      <button className={styles.fetchButton} onClick={clear}>
        Clear
      </button>
      <button
        className={styles.fetchButton}
        style={{ backgroundColor: "var(--hovered)" }}
        onClick={del}
      >
        Delete
      </button>
    </div>
  );
}
