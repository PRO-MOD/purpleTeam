import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';


const InfoTable = ({ data, columns, onRowClick, selectedItems, onItemSelect, onSelectAll, onDelete }) => {
    return (
        <div className="w-[90%] mx-auto">
            <div className='mb-8 flex flex-row justify-end h-[20px]'>
                { selectedItems &&selectedItems.length > 0 && (
                    <FontAwesomeIcon icon={faTrashCan} className='bg-red-400 text-white p-2 rounded-sm me-8' onClick={onDelete} />
                )}
            </div>
            {data.length > 0 && (
                <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                className="odd:bg-white even:bg-gray-50 dark:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700 cursor-pointer"
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
