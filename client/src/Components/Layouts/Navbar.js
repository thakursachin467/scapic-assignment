import React from 'react';
import {NavLink} from 'react-router-dom';
import './Navbar.css';
const navigation= ()=>{
    return (
        <header className="main_navigation">
            <div className="NavigationLogo">
                <h1>
                    3D Model
                </h1>
            </div>
            <div className="NavigationItems">
                <ul>
                    <li>
                        <NavLink to="/signup">Signup</NavLink>
                    </li>
                    <li>
                        <NavLink to="/login">Login</NavLink>
                    </li>
                    <li>
                        <NavLink to="/categories">Categories</NavLink>
                    </li>
                </ul>

            </div>
        </header>

    )
};

export default navigation;