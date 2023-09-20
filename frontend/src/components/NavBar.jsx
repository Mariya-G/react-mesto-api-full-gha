import React from "react";

function NavBar({handleSignOut, userEmail}) {
  
  return (
    <div className="header__user">
      <p className="header__user-email">{userEmail}</p>
      <a type="submit" onClick={handleSignOut} className="header__link">Выйти</a>
    </div>
  )
}

export default NavBar;