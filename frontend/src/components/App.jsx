import React from "react";
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import {ProtectedRoute} from "./ProtectedRoute";
import Header from './Header.jsx';
import {api} from '../utils/api.js'
import Main from './Main.jsx';
import Footer from './Footer.jsx';
import DeletePopup from './DeletePopup';
import EditProfilePopup from './EditProfilePopup.jsx';
import ImagePopup from './ImagePopup.jsx';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import Login from './Login';
import Register from './Register';
import PageNotFound from './PageNotFound';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  const [currentUser, setCurrentUser] = React.useState({
    avatar: '../images/avatar.jpg',
    name: 'Загрузка',
    about: 'Загрузка',
    _id: ''
  });
  
  const [cards, setCards] = React.useState([]);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [cardId, setCardId] = React.useState('');
  const [isDeletePopupOpen, setDeletePopupOpen] = React.useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState({email: ''});
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [tooltip, setTooltip] = React.useState({image: '', message: ''});
  

  React.useEffect(() => {
    loggedIn && Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user)
          setCards(cards);
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`)
      });
  }, [loggedIn])

  const registerUser = ({email, password}) => {
    auth.register({email, password})
      .then((res) => {
        setInfoTooltipOpen(true);
        setTooltip({image: true,
          message: 'Вы успешно зарегистрировались!'});
        navigate('/signin', {replace: true});
      })
      .catch((error) => {
        setInfoTooltipOpen(true);
        setTooltip({image: false,
          message: 'Что-то пошло не так! Попробуйте еще раз.'});
        console.log(`Ошибка: ${error}`)
      });
  }

  const handleLogin = (formValue) => {
    const {email, password} = formValue;
    auth.authorize({email, password})
    .then((data) => {
      setUserEmail(data.email);
      setLoggedIn(true);
      navigate('/main', { replace: true });
    })
      .catch((error) => {
        setInfoTooltipOpen(true);
        setTooltip({
          image: false,
          message: 'Неверный email или пароль!'
        });
        console.log(`Ошибка: ${error}`);
      });
  }

  const handleSignOut = () => {
    setLoggedIn(false);
  }

const checkToken = () => {
  auth.getContent()
    .then((res) => {
      if (res.email) {
        setUserEmail(res.email);
        setLoggedIn(true);
        navigate('/main', { replace: true });
      }
    })
    .catch((error) => {
      console.log(error);
    })
 }

  React.useEffect(() => {
    checkToken();
  }, []);

  function handleUpdateAvatar(userData) {
    api.editAvatar(userData)
      .then((avatarData) => {
        setCurrentUser(avatarData.data);
        closeAllPopups()
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }

  function handleUpdateUser(newUserData) {
    api.editUserInfo(newUserData)
    .then((userData) => {
      setCurrentUser(userData.data);
      closeAllPopups()
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    });
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(selectedCard){
    setSelectedCard(selectedCard);
  }

  function handleDeleteCardPlaceClick(card) {
    setCardId(card);
    setDeletePopupOpen(true);
  }

  React.useEffect(() => {
    function handleEscPress(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }

    const handleOverlayClick = (evt) => {
      if (evt.target.classList.contains('popup_opened')) {
        closeAllPopups();
      }
    };

    if (isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || isDeletePopupOpen || selectedCard) {
      document.addEventListener('keydown', handleEscPress);
      document.addEventListener('click', handleOverlayClick);
      return () => {
        document.removeEventListener('keydown', handleEscPress);
        document.removeEventListener('mousedown', handleOverlayClick);
      }
    }
  }, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, isDeletePopupOpen, selectedCard])

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((state) => {
        return state.map((c) => c._id === newCard.data._id ? newCard.data : c)
      });
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    });
  }

  function handleCardDelete() {
    api.deleteCard(cardId)
      .then(() => {
        const newCard = cards.filter((item) => item._id !== cardId);
        setCards(newCard);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }

  function handleAddPlaceSubmit(data) {
    api.addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setDeletePopupOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard({});
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="pages">
        <div className="page">
        <Header loggedIn={loggedIn} handleSignOut={handleSignOut} userEmail={userEmail}/>
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/main" replace/> : <Navigate to="/signin" replace/>}/>
          <Route path="/main" element={
            <ProtectedRoute loggedIn={loggedIn} element={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            cards={cards}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            handleCardLike={handleCardLike}
            handleCardDeleteClick={handleDeleteCardPlaceClick}
            />
          }
          />
          <Route path="/signin" element={<Login onLogin={handleLogin}/>}/>
          <Route path="/signup" element={<Register registerUser={registerUser}/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
        <Footer loggedIn={loggedIn}/>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/> 
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
        <DeletePopup isOpen={isDeletePopupOpen} onClose={closeAllPopups} onDeletePopup={handleCardDelete}/>
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} tooltip={tooltip}/>
      </div>
    </div>
  </CurrentUserContext.Provider>
  );
}

export default App;
