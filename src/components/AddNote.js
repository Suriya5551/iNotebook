import React, {useContext} from 'react';
import noteContext from '../context/noteContext';
import { useState } from 'react';

const AddNote = (props) => {
  const { addNote } = useContext(noteContext);
  const [note, setNote] = useState({ title: "", description: "", tag: "" })

  const handleClick = (e) => {
      e.preventDefault();
      addNote(note.title, note.description, note.tag);
      setNote({ title: "", description: "", tag: "" })
      props.showAlert("Added successfully", "success");
  }

 


  const onChange =(e)=> {
    setNote({...note, [e.target.name]: e.target.value}) 
  }
  return (
    <div>
      <h1>Add a note</h1> 
            <div className="cointainer">
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" value={note.title} id="title" name='title' aria-describedby="emailHelp" onChange={onChange} minLength={5} required  />
                        
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" value={note.description} id="description" name="description" onChange={onChange} minLength={5} required  />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">tag</label>
                    <input type="text" className="form-control" value={note.tag} id="tag" name="tag" onChange={onChange}   />
                </div>
                
                <button disabled={note.title.length<2 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
            
            </div>
    </div>
  )
}

export default AddNote
