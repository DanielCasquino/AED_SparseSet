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

  return (
    <div className={styles.body}>
      {loaded ? <Content /> : <LoadingMessage timer={timer} timeout={timeout} />}
    </div>
  );
}

function LoadingMessage({ timer, timeout }) {
  return (
    <>
      <span className={styles.loading}>Loading... {timer}s</span>
      {timer > timeout ? <span className={styles.timeout}>Api not responding. Is it up and running?</span> : <></>}
    </>)
}

export default function Sandbox() {
  return (
    <div className={`${styles.body} ${styles.dark}`}>
      <LoadingScreen />
    </div>)
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
      } catch (error) {
        setInfo(null);
        console.error('Error checking server:', error);
      }
    };

    checkExistingSet();

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
      checkExistingSet();
    }, 5000);

    return () => clearInterval(intervalId);

  }, []);

  return (
    <div className={styles.body}>
      {info != null ? <SetFound setInfo={setInfo} /> : <NoSetFound setInfo={setInfo} />}
    </div>
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
          max={999}
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

function SetFound({ setInfo }) {

  const deleter = async () => {
    try {
      const response = await fetch('http://localhost:18080/delete');
      if (response.status == 200) {
        setInfo(null);
      }
      else if (response.status == 404) {
        alert("There is no set to delete!");
      }
    } catch (error) {
      console.error('Error checking server:', error);
    }
  };

  return (<>
    <span className={styles.loading}>Sparse set loaded</span>
    <button className={styles.fetchButton} onClick={deleter}>Setus deletus</button>
  </>
  )
}