
import { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://127.0.0.1:5000"
  
  const [notes, setNotes] = useState([
    {
      "_id": "645ee4df5f5cc085482328f1",
      "user": "645a519101d930885af0e5ae",
      "title": "my title",
      "description": "please take care of your health",
      "tag": "advice",
      "Date": "2023-05-13T01:16:15.587Z",
      "__v": 0
    },
    {
      "_id": "645ee4f25f5cc08548mb2328f3",
      "user": "645a519101d9308n85af0e5ae",
      "title": "my title",
      "description": "please take care of your wealth",
      "tag": "advice",
      "Date": "2023-05-13T01:16:34.835Z",
      "__v": 0
    }
  ])
  

  // Add note
  const addNote = async (title, description, tag) => {

    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const note = await response.json();
    setNotes(notes.concat(note))
  }

  // fetch all note
  const getNote = async (title, description, tag) => {

    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: { 
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    console.log(json);
    setNotes(json)
  }

  // delete note
  const deleteNote = async (id) => {
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    console.log(json)
    
    
  }
  // edit a note
  const editNote = async (id, title, description, tag) => {

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = await response.json();
    console.log(json)
    // setNotes((prevNotes) => {
    //   return prevNotes.map((note) => {
    //     if (note && note._id === id) {
    //       return {
    //         ...note,
    //         title,
    //         description,
    //         tag
    //       };
    //     }
    //     return note;
    //   });
    // });

    let newNotes = notes.slice();
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes);
  }
  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote}}>
      {props.children}
    </noteContext.Provider>
    
  );

  
}


export default NoteState;
