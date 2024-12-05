import React, { useContext } from 'react';
import FontContext from '../../../../context/FontContext';
import ColorContext from '../../../../context/ColorContext';

const InformationTable = ({ data, columns, onRowClick }) => {
    const { bgColor, textColor, sidenavColor, hoverColor, tableColor } = useContext(ColorContext);
    const { navbarFont, headingFont, paraFont, updateFontSettings } = useContext(FontContext);

    return (
        <div className="w-[90%] mx-auto">
            {data.length > 0 && (
                <table className="text-sm text-left w-full">
                    <thead className="text-xs" style={{ backgroundColor: sidenavColor}}>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className="py-2 px-4 border-b text-white" style={navbarFont}>{column.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, rowIndex) => (
                            <tr
                                key={item._id}
                                className="bg-white border-b dark:border-gray-700 cursor-pointer"
                                onClick={() => onRowClick(item._id)}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="py-2 px-4 border-b" style={paraFont}>
                                        {column.accessor === "_id" ? rowIndex + 1 : item[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InformationTable;
