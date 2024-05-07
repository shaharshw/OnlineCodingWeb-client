import React from 'react';
import myImage from '../images/404photo.jpg';
import '../styles/ErrorComponent.css';


export default function ErrorComponent() {
    return (
        <div className="ErrorComponent">
            <img src={myImage} className='img' alt="404Image" />
        </div>
    );
}