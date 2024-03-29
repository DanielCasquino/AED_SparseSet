"use client";

import Cookies from "js-cookie";

export function ThemeButton({ styles, theme, setTheme }) {
  const changeTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    Cookies.set("theme", theme === 'dark' ? 'light' : 'dark');
    const body = document.getElementById("body");
    body.dataset.theme = theme === 'dark' ? 'light' : 'dark';
  };
  return (
    <button className={styles.themeButton} onClick={changeTheme}>
      <img className={styles.img}
        src={
          theme === "dark"
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
      <img className={styles.img} src="arrow_back_FILL0_wght400_GRAD0_opsz24.svg"></img>
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
      <img className={styles.img} src={audioEnabled === true ? "volume_up_FILL0_wght400_GRAD0_opsz24.svg" : "no_sound_FILL0_wght400_GRAD0_opsz24.svg"}></img>
    </button>
  );
}