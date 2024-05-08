import React, { useContext, useState } from "react";
import NoteContext from "../../context/NoteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

export const AddNote = (props) => {
    const context = useContext(NoteContext);
    const { addNote } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "" });
    const [isValid, setisValid] = useState(false);
    const [showFields, setShowFields] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();

        if (note.title.length < 5 || note.description.length < 5 || note.tag.length < 3) {
            setisValid(true);
            return; // Don't proceed if fields are not valid
        }

        addNote(note.title, note.description, note.tag);
        setNote({ title: "", description: "", tag: "" });
        props.showAlert("Added Successfully", "success");
        setShowFields(false); // Hide fields after adding note
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    const handleHideClick = (e) => {
        setShowFields(false);
    }

    return (
        <div className="px-16">
            <div className="flex flex-row items-center py-4">
                <h1 className="text-2xl font-bold">{!showFields ? "Your Notes" : "Add Notes"}</h1>

                {!showFields && (
                    <FontAwesomeIcon icon={faSquarePlus} className="text-brown-500 ms-4 text-xl  cursor-pointer" title="Add Notes" onClick={() => setShowFields(true)} />
                )}
            </div>
            {showFields && (
                <>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" id="title" name="title" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Enter Title" value={note.title} onChange={onChange} minLength={5} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" name="description" rows="3" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Enter Description" value={note.description} onChange={onChange} minLength={5}></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Tag</label>
                        <input type="text" id="tag" name="tag" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Enter Tag" value={note.tag} onChange={onChange} minLength={3} />
                    </div>
                    <button className="bg-brown-650 text-white transition duration-300 ease-in-out transform hover:scale-105 px-4 py-2 rounded-md" onClick={handleClick}>Add Note</button>
                    <button className="text-gray-800 underline px-4 py-2 rounded-md" onClick={handleHideClick}>CLOSE</button>

                    <div className="text-red-600 mt-4">
                        {isValid && "Title and Description should be at least 5 characters long, and Tag should be at least 3 characters long."}
                    </div>
                </>
            )}
        </div>
    )
}
