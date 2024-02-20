"use client";

import Cookies from "js-cookie";
import { useState } from "react";

export function ThemeButton({ styles }) {
  const [currTheme, setCurrTheme] = useState("dark");
  const changeTheme = () => {
    const body = document.getElementById("body");
    body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";

    let curr = Cookies.get("theme");
    curr = curr === "dark" ? "light" : "dark";
    Cookies.set("theme", curr);
    setCurrTheme(curr);
  };
  return (
    <button className={styles.themeButton} onClick={changeTheme}>
      <img
        src={
          currTheme === "dark"
            ? "light_mode_FILL0_wght400_GRAD0_opsz24.svg"
            : "dark_mode_FILL0_wght400_GRAD0_opsz24.svg"
        }
      ></img>
    </button>
  );
}

export function HomeButton({ styles }) {
  const goHome = () => {
    window.location.href = "/";
  };
  return (
    <button
      className={styles.themeButton}
      onClick={goHome}
      style={{ left: "var(--medium)", right: "auto" }}
    >
      <img src="arrow_back_FILL0_wght400_GRAD0_opsz24.svg"></img>
    </button>
  );
}


export function MuteButton({ styles, audioEnabled, setAudioEnabled }) {
  const toggleAudio = () => {
    setAudioEnabled(audioEnabled === false ? true : false);
    Cookies.set("audioEnabled", audioEnabled === false ? 'true' : 'false');
  };
  return (
    <button
      className={styles.themeButton}
      onClick={toggleAudio}
      style={{ right: 'var(--huge)' }}
    >
      <img src={audioEnabled === true ? "volume_up_FILL0_wght400_GRAD0_opsz24.svg" : "no_sound_FILL0_wght400_GRAD0_opsz24.svg"}></img>
    </button>
  );
}