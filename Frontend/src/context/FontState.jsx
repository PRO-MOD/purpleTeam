import React, { useState } from "react";
import FontContext from "./FontContext";

const FontState = (props) => {
    // Define initial font settings for different categories
    const [navbarFont, setNavbarFont] = useState({
        fontFamily: "Roboto",
        fontSize: "16px",
        fontWeight: "400",
        fontStyle: "normal",
    });

    const [headingFont, setHeadingFont] = useState({
        fontFamily: "Darker Grotesque",
        fontSize: "24px",
        fontWeight: "700",
        fontStyle: "bolder",
    });

    const [paraFont, setParaFont] = useState({
        fontFamily: "Open Sans",
        fontSize: "16px",
        fontWeight: "400",
        fontStyle: "normal",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to update font settings for a specific category
    const updateFontSettings = (category, newSettings) => {
        setLoading(true);
        try {
            if (category === "navbar") {
                setNavbarFont((prev) => ({ ...prev, ...newSettings }));
            } else if (category === "heading") {
                setHeadingFont((prev) => ({ ...prev, ...newSettings }));
            } else if (category === "para") {
                setParaFont((prev) => ({ ...prev, ...newSettings }));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FontContext.Provider value={{ 
            navbarFont,
            headingFont,
            paraFont,
            updateFontSettings,
            loading,
            error
        }}>
            {props.children}
        </FontContext.Provider>
    );
};

export default FontState;
