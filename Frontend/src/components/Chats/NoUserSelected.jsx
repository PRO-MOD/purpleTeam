import React, {useContext} from 'react';
import FontContext from '../../context/FontContext';

function NoUserSelected() {
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
    return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4" style={{fontFamily:headingFont}}>No user selected</h2>
                <p className="text-gray-600" style={{fontFamily:paraFont}}>Start a conversation by selecting a user from the list.</p>
            </div>
    );
}

export default NoUserSelected;
