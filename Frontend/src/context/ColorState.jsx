// ColorState.js
import React, { useState } from "react";
import ColorContext from "./ColorContext";

const ColorState = (props) => {
    // Define the initial color states
    const [bgColor, setBgColor] = useState("#e1defc");       // Default background color
    const [textColor, setTextColor] = useState("#000000");   // Default text color
    const [sidenavColor, setSidenavColor] = useState("#00174d"); // Default sidenav color
    const [hoverColor, setHoverColor] = useState(" #3652f3"); // Default hover color
    const [tableColor, setTableColor]=useState("#bc8fee");
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
    const updateTableColor = (color) => {
        setLoading(true);
        try {
            setTableColor(color);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ColorContext.Provider value={{ 
            bgColor, textColor, sidenavColor, hoverColor, tableColor
        }}>
            {props.children}
        </ColorContext.Provider>
    );
};

export default ColorState;
