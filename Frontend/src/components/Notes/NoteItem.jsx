import React, { useContext } from "react";
import noteContext from "../../context/NoteContext";

const NoteItem = (props) => {

    const { note,updateNote, showAlert } = props;

    const { deleteNote} = useContext(noteContext);

    const EditNote = (note) =>{
        console.log(note);
        updateNote(note)
    }

    return (
        <>
            <div className="card me-4 mb-4" style={{ width: "18rem" }}>
                <div className="card-body">
                    <div className="d-flex flex-row">
                        <h5 className="card-title">{note.title}</h5>
                        <div className="ms-auto">
                            <i className="bi bi-pencil-square me-2 text-success" role="button" onClick={()=>EditNote(note)}></i>
                            <i className="bi bi-trash3 text-danger" role="button" onClick={()=>{
                                deleteNote(note._id)
                                showAlert("Deleted Successfully","success")
                                }}></i>
                        </div>
                    </div>
                    <p className="card-text">{note.description}</p>
                    <hr />
                    <h6 className="card-subtitle mb-2 text-muted">{note.tag}</h6>
                </div>
            </div>


        </>
    )
}

export default NoteItem;