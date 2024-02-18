'use client'

import styles from './home.module.css'
import './global.css'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

export default function Home() {
  useEffect(() => {
    setThemeInit();
  }, []);

  const setThemeInit = () => {
    let curr = Cookies.get('theme');
    const body = document.getElementById('body');
    body.dataset.theme = curr === 'dark' ? 'dark' : 'light';
  }

  const changeTheme = () => {
    const body = document.getElementById('body');
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    let curr = Cookies.get('theme');
    curr = curr === 'dark' ? 'light' : 'dark';
    Cookies.set('theme', curr);
  }
  return (<div className={styles.body} id="body">
    <button className={styles.themeButton} onClick={changeTheme}></button>
    <a href='https://github.com/DanielCasquino/AED_SparseSet'><img src="github-mark/github-mark.svg" className={styles.github} decoding='async'></img></a>
    <h1 className={styles.bigTitle}>SSServer</h1>
    <h3 className={styles.smallTitle}>(Sparse Set Server)</h3>
    <span className={styles.about}>SSServer is a web app built on C++ that provides a simple sandbox to work and tinker around with the Sparse Set data structure. Press the button below to get started.</span>
    <a href="/sandbox"><button className={styles.sandbox}>Enter Sandbox</button></a>
  </div >)
}