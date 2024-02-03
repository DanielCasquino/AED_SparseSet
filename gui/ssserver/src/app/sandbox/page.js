'use client'

import styles from './styles.module.css'
import './global.css'
import { useState, useEffect } from 'react'


function LoadingScreen() {
  const [loaded, setLoaded] = useState(false);
  const timeout = 10;
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Check api state
        const response = await fetch('http://localhost:18080/check');

        // Proceed
        if (response.status == 200) {
          setLoaded(true);
          setTimer(0);
        }
      } catch (error) {
        setLoaded(false);
        console.error('Error checking server:', error);
      }
    };

    checkServer();

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
      checkServer();
    }, 1000);

    return () => clearInterval(intervalId);

  }, []);

  const changeTheme = () => {
    const body = document.getElementById('body');
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  }

  return (
    <div className={styles.body} id="body">
      <button className={styles.themeButton} onClick={changeTheme}></button>
      {loaded ? <Content /> : <LoadingMessage timer={timer} timeout={timeout} />}
    </div>
  );
}

function LoadingMessage({ timer, timeout }) {
  return (
    <>
      <span className={styles.loading}>Connecting... {timer}s</span>
      {timer > timeout ? <span className={styles.timeout}>Api not responding. Is it up and running?</span> : <></>}
    </>)
}

export default function Sandbox() {
  return (
    <LoadingScreen />
  )
}





function Content() {
  const [timer, setTimer] = useState(0);
  const [info, setInfo] = useState(null);

  useEffect(() => {

    const checkExistingSet = async () => {
      try {
        // Check api state
        const response = await fetch('http://localhost:18080/read');

        // Proceed
        if (response.status == 200) {
          const data = await response.json(); // Await here to get the parsed JSON data
          setInfo(data);
          setTimer(0);
        }
        else {
          setInfo(null);
        }
      } catch (error) {
        setInfo(null);
        console.error('Error checking server:', error);
      }
    };

    checkExistingSet();

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
      checkExistingSet();
    }, 1000);

    return () => clearInterval(intervalId);

  }, []);

  return (<>
    {info != null ? <SetFound info={info} setInfo={setInfo} /> : <NoSetFound setInfo={setInfo} />}
  </>
  )
}

function NoSetFound({ setInfo }) {

  const [creationSize, setCreationSize] = useState(10);

  const createSparseSet = async () => {
    if (creationSize > 0 && creationSize < 1000) {
      try {
        const responseCreate = await fetch(`http://localhost:18080/create/${creationSize}`);

        if (responseCreate.status === 201) {
          console.log('Sparse set created successfully');

          // Fetch created set
          const responseRead = await fetch('http://localhost:18080/read');

          if (responseRead.status === 200) {
            const data = await responseRead.json(); // Await here to get the parsed JSON data
            setInfo(data);
          } else {
            console.error('Failed to fetch data after creating sparse set');
          }
        } else {
          console.error('Failed to create sparse set');
        }
      } catch (error) {
        console.error('Error creating sparse set:', error);
      }
    }
    else {
      alert("Invalid size!");
    }
  };

  const limitInputLength = (e) => {
    const newValue = e.target.value.slice(0, 3);
    setCreationSize(newValue);
  };

  return (
    <div className={styles.creationContainer}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className={styles.loading}>My sparse set will hold numbers up to &nbsp;</span>
        <input
          onChange={limitInputLength}
          value={creationSize}
          className={styles.creationInput}
          required
          type='number'
          min={1}
          max={100}
          minLength={1}
          maxLength={3}
          placeholder='10'
          id='size'
        />
      </div>
      <button className={styles.fetchButton} onClick={createSparseSet}>Create</button>
    </div>
  )
}

function SetFound({ info, setInfo }) {
  const [hoveredDense, setHoveredDense] = useState(null);
  const [hoveredSparse, setHoveredSparse] = useState(null);

  const handleDenseHover = (value) => {
    setHoveredSparse(value != -1 ? value : null);
  };

  const handleSparseHover = (value) => {
    setHoveredDense(value != -1 ? value : null);
  };

  const displayDense = () => {
    return info["dense"].map((value, index) => (
      <div
        key={index}
        className={`${styles.setSquare} ${hoveredDense === index ? styles.hovered : ''}`}
        onMouseEnter={() => handleDenseHover(value)}
        onMouseLeave={() => handleDenseHover(null)}
      >
        {value != -1 ? value : null}
      </div>
    ));
  };

  const displaySparse = () => {
    return info["sparse"].map((value, index) => (
      <div
        key={index}
        className={`${styles.setSquare} ${hoveredSparse === index ? styles.hovered : ''}`}
        onMouseEnter={() => handleSparseHover(value)}
        onMouseLeave={() => handleSparseHover(null)}
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
      <label className={styles.label} htmlFor="dense">Dense</label>
      <div className={styles.array} id="dense">{dense}</div>
      <label className={styles.label} htmlFor="sparse">Sparse</label>
      <div className={styles.array} id="sparse">{sparse}</div>
    </div>
  );
}