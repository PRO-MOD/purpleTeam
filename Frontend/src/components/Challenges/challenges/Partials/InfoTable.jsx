import React, {useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../context/FontContext';
import ColorContext from '../../../../context/ColorContext';


const InfoTable = ({ data, columns, onRowClick, selectedItems, onItemSelect, onSelectAll, onDelete }) => {

    const { bgColor, textColor, sidenavColor, hoverColor, tableColor } = useContext(ColorContext);
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
    return (
        <div className="w-[90%] mx-auto">
            <div className='mb-16 flex flex-row justify-end h-[20px]'>
                { selectedItems &&selectedItems.length > 0 && (
                    <FontAwesomeIcon icon={faTrashCan} className='bg-red-400 text-white p-2 rounded-sm me-8' onClick={onDelete} />
                )}
            </div>
            {data.length > 0 && (
                <table className="text-sm text-left  w-full">
                    <thead className="text-xs" style={{backgroundColor:tableColor}}>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className="py-2 px-4 border-b">{column.header}</th>
                            ))}
                            <th className="py-2 px-4 border-b">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === data.length}
                                    onChange={onSelectAll}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, rowIndex) => (
                            <tr
                                key={item._id}
                                className="bg-white border-b dark:border-gray-700 cursor-pointer"
                                onClick={(event) => onRowClick(item._id, event)}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="py-2 px-4 border-b">{column.accessor === "_id" ? rowIndex + 1 : item[column.accessor]}</td>
                                ))}
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item._id)}
                                        onChange={() => onItemSelect(item._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
};

export default InfoTable;
