import React from "react";
import PopupWithForm from './PopupWithForm.jsx';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function EditProfilePopup (props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState(currentUser.name);
  const [about, setAbout] = React.useState(currentUser.about);
  
  function handleChangeName(e) {
    setName(e.target.value);
    console.log(e.target.value);
  }

  function handleChangeAbout(e) {
    setAbout(e.target.value);
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser, props.isOpen]);


  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name,
      about
    });
  } 
  
  return(
    <PopupWithForm
      title = 'Редактировать профиль'
      name = 'edit'
      onSubmit={handleSubmit}
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText = 'Сохранить'
    >
      <input id="name" name="name" className="popup__input popup__input_type_name" 
            type="text" placeholder="Имя" value={name} 
            onChange={handleChangeName} required minLength="2" maxLength="40"/>
      <span className="name-error popup__input-error"></span>
      <input id="job" name="about" className="popup__input popup__input_type_job" 
            type="text" placeholder="О себе" value={about}
            onChange={handleChangeAbout} required minLength="2" maxLength="200"/>
      <span className="job-error popup__input-error"></span>
      
    </PopupWithForm>
  );
  
}
export default EditProfilePopup;