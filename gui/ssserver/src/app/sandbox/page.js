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
  return (<>
    <span className={styles.loading}>Loading... {timer}s</span>
    {timer > timeout ? <span className={styles.timeout}>Api not responding. Is it up and running?</span> : <></>}
  </>)
}

function Content() {
  return (<span className={styles.loading}>Content loaded!</span>)
}

export default function Sandbox() {
  return (<div className={`${styles.body} ${styles.dark}`}>
    <LoadingScreen />
  </div>)
}