import React, { useContext } from "react";
import noteContext from "../../context/NoteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPencilSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const NoteItem = (props) => {

    const { note, updateNote, showAlert } = props;

    const { deleteNote } = useContext(noteContext);

    const EditNote = (note) => {
        console.log(note);
        updateNote(note)
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 w-72 ms-4">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold text-gray-800">{note.title}</h5>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faPenToSquare} className="text-blue-500 cursor-pointer text-lg" role="button" onClick={() => EditNote(note)} />
                        <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer ml-2 text-lg" role="button" onClick={() => {
                            deleteNote(note._id);
                            showAlert("Deleted Successfully", "success");
                        }} />
                    </div>
                </div>
                <p className="text-black mb-4 text-lg">{note.description}</p>
                <hr className="border-t border-gray-300 my-4" />
                <h6 className="text-sm text-gray-600 font-semibold">{note.tag}</h6>
            </div>
        </div>
    )
}

export default NoteItem;