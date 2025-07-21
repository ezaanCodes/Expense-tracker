import React, { useState } from "react";
import useStore from "../../store";
import { LuSun, LuMoonStar } from "react-icons/lu"

const ThemeSwitch = () => {
    const { theme, setTheme } = useStore((state) => state);
    const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

    const toggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        setIsDarkMode(!isDarkMode);

        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <button onClick={toggleTheme} className="outline-none">
            {isDarkMode ? (
                <LuSun size={26} className="bg-amber-50" />
            ) : (
                <LuMoonStar size={26} />
            )}
        </button>
    );
};

export default ThemeSwitch;