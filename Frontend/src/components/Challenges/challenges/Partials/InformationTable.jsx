import React, { useContext } from 'react';
import FontContext from '../../../../context/FontContext';
import ColorContext from '../../../../context/ColorContext';

const InformationTable = ({ data, columns, onRowClick }) => {
    const { sidenavColor } = useContext(ColorContext);
    const { navbarFont, paraFont } = useContext(FontContext);

    return (
        <div className="w-[90%] mx-auto">
            {data.length > 0 && (
                <table
                    className="text-sm text-left w-full border-collapse"
                    style={{ tableLayout: 'fixed' }}
                >
                    <colgroup>
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '70%' }} />
                    </colgroup>
                    <thead className="text-xs font-bold" style={{ backgroundColor: sidenavColor }}>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="py-2 px-4 border-b border-r text-center text-white"
                                    style={{
                                        ...navbarFont,
                                        textAlign: 'center',
                                        height: '50px', // Uniform header row height
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, rowIndex) => (
                            <tr
                                key={item._id}
                                className="bg-white border-b dark:border-gray-700 cursor-pointer"
                                onClick={() => onRowClick(item._id)}
                                style={{ height: '100px' }} // Uniform row height
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`py-2 px-4 border-b ${
                                            colIndex === columns.length - 1 ? '' : 'border-r'
                                        }`}
                                        style={{
                                            ...paraFont,
                                            whiteSpace: colIndex === 0 ? 'nowrap' : 'normal',
                                            fontWeight: colIndex === 0 ? 'bold' : 'normal',
                                            textAlign: colIndex === 0 ? 'center' : 'left',
                                            height: '100px', // Ensure cell matches row height
                                            overflow: 'hidden', // Prevent overflowing content
                                            textOverflow: 'ellipsis', // Add ellipsis for overflow text
                                        }}
                                    >
                                        {column.accessor === '_id' ? rowIndex + 1 : item[column.accessor]}
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
