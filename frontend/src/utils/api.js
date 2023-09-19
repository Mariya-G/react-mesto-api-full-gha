class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }
  _checkResponse(res) {
    if (res.ok) {
        return res.json()
    }
    return Promise.reject(res.status);
  }

  // Получение карточек с сервера
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => {
      return this._checkResponse(res)
    });
  }

  // Добавление новой карточки через попап
  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: data.title,
        link: data.link
      })
    })
    .then(res => {
      return this._checkResponse(res)
    });
  }

  // Удаление карточки
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => {
      return this._checkResponse(res)
    });
  }

// Статус лайка
  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => {
      return this._checkResponse(res)
    });
  }

// Получение информации о пользователе с сервера
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => {
      return this._checkResponse(res)
    });
  }

// Редактирование информации о пользователе через попап
  editUserInfo(user) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: user.name,
        about: user.about
      })
    })
    .then(res => {
      return this._checkResponse(res)
    });
  }

  // Редактирование аватара пользователя через попап
  editAvatar(user) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar: user.avatar
      })
    })
    .then(res => {
      return this._checkResponse(res)
    });
  }
}

export const api = new Api({
  baseUrl: 'https://api.mesto.mg.nomoredomainsrocks.ru',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  credentials: 'include',
});
