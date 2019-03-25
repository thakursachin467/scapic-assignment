import React from 'react';
import  './Card.css';


const Card = ({thumb}) =>{
    return (
        <div className="column">
            <img src={thumb} alt=''  style={{"width":"100%"}}/>
        </div>
    )
};


export default Card;