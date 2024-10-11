import React, { useContext } from "react";
import noteContext from "../../context/NoteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPencilSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import '../../App.css'
import ColorContext from "../../context/ColorContext";
import FontContext from "../../context/FontContext";

const NoteItem = (props) => {

    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

    const { note, updateNote, showAlert } = props;
    const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
    const { deleteNote } = useContext(noteContext);

    const EditNote = (note) => {
        console.log(note);
        updateNote(note)
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 w-72 ms-4">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold text-gray-800" style={{fontFamily:headingFont}}>{note.title}</h5>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faPenToSquare} className="cursor-pointer text-lg" role="button" onClick={() => EditNote(note)}  style={{color:textColor, fontFamily: paraFont}}/>
                        <FontAwesomeIcon icon={faTrashAlt} className=" cursor-pointer ml-2 text-lg" role="button" onClick={() => {
                            deleteNote(note._id);
                            showAlert("Deleted Successfully", "success");
                        }}  style={{color:textColor, fontFamily:paraFont}}/>
                    </div>
                </div>
                <p className="text-black mb-4 text-lg  whitespace-pre-wrap  max-h-[150px] overflow-y-auto overflow-x-hidden" style={{fontFamily:paraFont}}>{note.description}</p>
                <hr className="border-t border-gray-300 my-4" />
                <h6 className="text-sm text-gray-600 font-semibold" style={{fontFamily:paraFont}}>{note.tag}</h6>
            </div>
        </div>
    )
}

export default NoteItem;