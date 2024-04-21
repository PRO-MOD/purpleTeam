import React, { useContext, useState } from "react";
import NoteContext from "../../context/NoteContext";
// import { NavItem } from "react-bootstrap";

export const AddNote = (props) => {
    const context = useContext(NoteContext);
    const {addNote} = context;

    const [Note, setNote] = useState({title: "", description: "", tag: ""});
    const [isValid, setisValid] = useState(false);


    const handleClick = (e) => {
        e.preventDefault();
        console.log(Note);

        if(Note.title.length<5 || Note.description.length<5 || Note.tag.length<3){
            setisValid(true);
        }

        addNote(Note.title, Note.description, Note.tag);
        setNote({title: "", description: "", tag: ""})
        props.showAlert("Added Successfully", "success")
    }

    const onChange = (e) => {
        setNote({...Note, [e.target.name]: e.target.value})
    }

    return (
        <div className="container mt-4">
            <h1>Add Note</h1>

            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="title" name="title" placeholder="Enter Title" value={Note.title} onChange={onChange} minLength={5}/>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" name="description" placeholder="Enter Description" value={Note.description} rows="3" onChange={onChange} minLength={5}></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Tag</label>
                <input type="text" className="form-control" id="tag" name="tag" placeholder="Enter Tag" value={Note.tag} onChange={onChange} minLength={3}/>
            </div>
            <button className="btn text-light" style={{backgroundColor: "#e94e1e"}} onClick={handleClick}>Add Note</button>

            <div className="container text-danger mt-4">
                {isValid ? "Title and Desscription should atleast be of length 5 and Tag of length 3": ""}
            </div>


        </div>
    )
}