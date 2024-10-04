// ColorState.js
import React, { useState } from "react";
import ColorContext from "./ColorContext";

const ColorState = (props) => {
    // Define the initial color states
    const [bgColor, setBgColor] = useState("green-500");       // Default background color
    const [textColor, setTextColor] = useState("#000000");   // Default text color
    const [sidenavColor, setSidenavColor] = useState("#333333"); // Default sidenav color
    const [hoverColor, setHoverColor] = useState("#f0f0f0"); // Default hover color
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to update background color
    const updateBgColor = (color) => {
        setLoading(true);
        try {
            setBgColor(color);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to update text color
    const updateTextColor = (color) => {
        setLoading(true);
        try {
            setTextColor(color);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to update sidenav color
    const updateSidenavColor = (color) => {
        setLoading(true);
        try {
            setSidenavColor(color);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to update hover color
    const updateHoverColor = (color) => {
        setLoading(true);
        try {
            setHoverColor(color);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ColorContext.Provider value={{ 
            bgColor, textColor, sidenavColor, hoverColor
        }}>
            {props.children}
        </ColorContext.Provider>
    );
};

export default ColorState;
