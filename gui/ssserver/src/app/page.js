"use client";

import styles from "./home.module.css";
import "./global.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ThemeButton } from "./themebutton";

export default function Home() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setThemeInit();
  }, []);

  const setThemeInit = () => {
    let themeState = Cookies.get("theme");
    const body = document.getElementById("body");
    if (themeState !== undefined) {
      if (themeState === 'dark') {
        setTheme('dark');
        body.dataset.theme = 'dark';
      }
      else if (themeState === 'light') {
        setTheme('light');
        body.dataset.theme = 'light';
      }
    }
    else {
      setTheme('dark');
      body.dataset.theme = 'dark';
    }
  };

  return (
    <div className={styles.body} id="body">
      <ThemeButton styles={styles} theme={theme} setTheme={setTheme} />
      <a href="https://github.com/DanielCasquino/AED_SparseSet">
        <img
          src="github-mark/github-mark.svg"
          className={styles.github}
          decoding="async"
        ></img>
      </a>
      <h1 className={styles.bigTitle}>SSServer</h1>
      <h3 className={styles.smallTitle}>(Sparse Set Server)</h3>
      <span className={styles.about}>
        SSServer is a web app built on C++ that provides a simple sandbox to
        work and tinker around with the Sparse Set data structure. Press the
        button below to get started.
      </span>
      <a href="/sandbox">
        <button className={styles.sandbox}>Enter Sandbox</button>
      </a>
    </div>
  );
}
