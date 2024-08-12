import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Table = ({ columns, data, onEdit, onDelete, editButtonReq }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                        {
                            editButtonReq
                                ?
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Actions
                                </th>
                                :
                                ""
                        }
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-6 py-4 text-gray-700 text-center">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((item, rowIndex) => (
                            <tr key={item._id || rowIndex} className="hover:bg-gray-100">
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                        {column.accessor ? (
                                            column.accessor === "options" ? (
                                                <span>{item[column.accessor] + "\n"}</span>
                                            ) : column.accessor === "index" ? (
                                                <span>{item[column.accessor]}</span>
                                            ) : (
                                                <span>{item[column.accessor]}</span>
                                            )
                                        ) : (
                                            <span>{item}</span>
                                        )}
                                    </td>
                                ))}
                                {
                                    editButtonReq ?
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-24">
                                            <div className="flex justify-end space-x-2">
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className="text-blue-500 cursor-pointer"
                                                    onClick={() => onEdit(item)}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                    className="text-red-500 cursor-pointer"
                                                    onClick={() => onDelete(item._id)}
                                                />
                                            </div>
                                        </td>
                                        :
                                        ""
                                }
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
