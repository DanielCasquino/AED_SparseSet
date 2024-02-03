'use client'

import styles from './styles.module.css'
import './global.css'

export default function Home() {
  const changeTheme = () => {
    const body = document.getElementById('body');
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
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