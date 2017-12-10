import React from 'react'

import './App/App.css';

// Questa è una pagina 404 personalizzata che viene chiamata quando si digita un indirizzo sbagliato
const NotFound = () => (

    <div className="row flex-row backgroundStyle">
        <div className="col-md-12 div404NotFound">
            <h1 style={{textAlign: 'center'}}>
                404 <small>Not Found :(</small> Kioku è molto triste!
            </h1>
        </div>
    </div>

);

export default NotFound