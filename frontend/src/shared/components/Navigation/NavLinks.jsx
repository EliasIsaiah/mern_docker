import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      <li>{auth.isLoggedIn && <NavLink to="/u1/places">MY PLACES</NavLink>}</li>
      <li>
        {auth.isLoggedIn && <NavLink to="/places/new">ADD PLACE</NavLink>}
      </li>
      <li>{!auth.isLoggedIn && <NavLink to="/auth">AUTHENTICATE</NavLink>}</li>
      <li>
        {auth.isLoggedIn && (
          <li>
            <button onClick={auth.logout}>LOGOUT</button>
          </li>
        )}
      </li>
    </ul>
  );
};

export default NavLinks;
