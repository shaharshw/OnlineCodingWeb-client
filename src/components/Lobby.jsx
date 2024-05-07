import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Lobby.css'
import apiClient from '../api/api'; 

export default function Lobby() {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
  apiClient.get('/codeblock')
  .then(response => setCodeBlocks(response.data))
  .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Choose a Code Block</h1>
      <div className="card-container">
        {codeBlocks.map(block => (
          <div key={block.id} className="card">
            <div className="card-body">
              <Link to={`/codeblock/${block.id}`} state={{ codeBlock: block }} >
                <h2>{block.title}</h2>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}