import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../../context/NoteContext";
import NoteItem from "./NoteItem";
import { AddNote } from "./AddNotes";
import { useNavigate } from "react-router-dom";

export const Notes = (props) => {
    const context = useContext(NoteContext);
    const { Note, getNotes, editNote } = context;
    const [currNote, setcurNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });
    const [isValid, setisValid] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('Hactify-Auth-token')) {
            navigate('/signin');
        }
        getNotes();
    }, [navigate, getNotes]);

    const refClose = useRef();

    const updateNote = (currentNote) => {
        setcurNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
        setOpen(true);
    };

    const onChange = (e) => {
        setcurNote({ ...currNote, [e.target.name]: e.target.value });
    };

    const handleClick = (e) => {
        e.preventDefault();
        if (currNote.etitle.length < 5 || currNote.edescription.length < 5 || currNote.etag.length < 3) {
            setisValid(true);
        } else {
            editNote(currNote.id, currNote.etitle, currNote.edescription, currNote.etag);
            refClose.current.click();
            props.showAlert("Update Successfully", "success");
        }
    };

    return (
        <>
            <AddNote showAlert={props.showAlert} />

            <div className={`fixed inset-0 overflow-y-auto ${open ? 'block' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">Edit Note</h3><hr className="my-4 border-black"/>
                                    <div className="mt-2">
                                        <div className="mb-4">
                                            <label htmlFor="etitle" className="block text-md font-medium text-gray-700 mb-1">Title</label>
                                            <input type="text" id="etitle" name="etitle" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter title" value={currNote.etitle} onChange={onChange} />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="edescription" className="block text-md font-medium text-gray-700 mb-1">Description</label>
                                            <textarea id="edescription" name="edescription" rows="3" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter description" value={currNote.edescription} onChange={onChange}></textarea>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="etag" className="block text-md font-medium text-gray-700 mb-1">Tag</label>
                                            <input type="text" id="etag" name="etag" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter tag" value={currNote.etag} onChange={onChange} />
                                        </div>
                                    </div>
                                    {isValid && <p className="text-sm text-red-500">Title and Description should be at least 5 characters long and Tag should be at least 3 characters long</p>}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" onClick={handleClick} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brown-650 text-base font-medium text-white transition duration-300 ease-in-out transform hover:scale-105 sm:ml-3 sm:w-auto sm:text-sm">
                                Update Note
                            </button>
                            <button type="button" ref={refClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="px-8 notes mt-4">
                {/* <h2 className="text-2xl font-semibold">Your Notes</h2> */}
                <div className="container mx-4">
                    {Note.length === 0 && <p className="text-gray-600">No notes available</p>}
                </div>
                <div className="flex flex-row mt-4">
                    {Note.map((ele, index) => (
                        <NoteItem key={index} updateNote={updateNote} note={ele} showAlert={props.showAlert} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Notes;
