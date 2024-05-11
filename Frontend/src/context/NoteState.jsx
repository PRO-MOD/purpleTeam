import React, { useContext, useState } from "react";
import NoteContext from "./NoteContext";


const NoteState = (props) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;

    const s1 = [{}]

    const [Note, setNote] = useState(s1);
    
    // Fetch all notes
    const getNotes=async()=>{
        // API call
        const response = await fetch(`${apiUrl}/api/notes/fetchallnotes`, {
            method: "GET",  
            headers: {
              "Content-Type": "application/json",
              "Auth-token": localStorage.getItem('Hactify-Auth-token')
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          const json = await response.json();

          setNote(json)

    }

    // Add note
    const addNote = async(title, description, tag) => {
        // Api Call
        const response = await fetch(`${apiUrl}/api/notes/addnote`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Auth-token": localStorage.getItem('Hactify-Auth-token')
            },
            body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
          });
          const json = await response.json();
        //   console.log(json);
        // console.log("Added a note");

        // logic
        setNote(Note.concat(json))
    }


    // Delete note
    const deleteNote = async (id) => {
        // Api Call
        const response = await fetch(`${apiUrl}/api/notes//deletenote/${id}`, {
            method: "DELETE",  
            headers: {
              "Content-Type": "application/json",
              "Auth-token": localStorage.getItem('Hactify-Auth-token')
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
        //   const json = await response.json();


        // logic
        const element = Note.filter((currentValue)=>currentValue._id !== id)
        setNote(element)
    }
    // edit note
    const editNote = async(id, title, description, tag) => {
        // Api Call
        const response = await fetch(`${apiUrl}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Auth-token": localStorage.getItem('Hactify-Auth-token')
            },
            body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
          });
        //   const json = await response.json();
        //   console.log(json);
        // console.log("Edited a note");    

        // Logic
        for (let i = 0; i < Note.length; i++) {
            const element = Note[i];
            if(element._id === id){
                element.title = title;
                element.description = description;
                element.tag = tag;
            }

        }

    }




    return (
        <NoteContext.Provider value={{Note, setNote, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )


}

export default NoteState;