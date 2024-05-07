import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; // choose the theme you like
import '../styles/CodeBlock.css';
import apiClient from '../api/api'; 
import SmileyFace from '../images/smileyFace.jpg';
import socketIOClient from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

const ENDPOINT = 'http://localhost:3001';

const generateUniqueClientId = () => uuidv4();
function generateUniqueToken() {
  return uuidv4();
}

export default function CodeBlock() {
  const location = useLocation();
  const codeBlock = location.state.codeBlock;
  const [code, setCode] = useState(codeBlock ? codeBlock.code : '');
  const [role, setRole] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const socket = useRef();
 
  useEffect(() => {
    let clientId = generateUniqueClientId(); 
    sessionStorage.setItem('clientId', clientId);
    
    if (!socket.current) {
      socket.current = socketIOClient(ENDPOINT, {
        query: {
          clientId: clientId
        }
      });
    }
    
    socket.current.on('connect', () => {
      const token = sessionStorage.getItem('token') || generateUniqueToken();
      sessionStorage.setItem('token', token);
      socket.current.emit('authenticate', token);
    });
    
    socket.current.on('roleAssigned', (assignedRole) => {
      setRole(assignedRole);
    });
    
    socket.current.on('codeUpdate', (updatedCodeBlock) => {
      setCode(updatedCodeBlock);
    });
    
    socket.current.on('submit', () => {
      setIsSubmitted(true);
    });
    
    socket.current.on('success', () => {
      setSuccess(true);
    });
    
    return () => {
      socket.current.off('connect');
      socket.current.off('roleAssigned');
      socket.current.off('codeUpdate');
      socket.current.off('submit');
      socket.current.off('success');
    };
  }, []);

  const handleCodeChange = (newCode) => {
    if (role === 'student') {
      setCode(newCode);
      socket.current.emit('codeChange', newCode);
    }
  };

  const handleSubmit = async () => {
    try {
      await apiClient.post('/codeblock', {
        codeBlockId: codeBlock._id,
        newCode: code
      });
    } catch (error) {
      console.error(error); 
    }

    setIsSubmitted(true);
    checkSolution();
    socket.current.emit('submit');
  }

  function checkSolution() {
    if (code === codeBlock.solution) {
      setSuccess(true);
      socket.current.emit('success');
    }
  }

  return (
    <div className="code-container"> 
      <h1>{codeBlock.title}</h1>
      <div>
        <Editor
          className="editor"
          value={code}
          onValueChange={handleCodeChange}
          highlight={code => highlight(code, languages.js)}
          padding={10}
          readOnly={role === 'mentor'}
        />
      </div>
      <div>
        {role === 'student' && <button className="submit-button" onClick={handleSubmit}>Submit</button> }
      </div>
      <div>
        {role === 'mentor' && success && <p>The Student Succeeded!</p>}
        {role === 'mentor' && isSubmitted && !success && <p>The Student Failed!</p>}
        {success && <img src={SmileyFace} alt='smiley face' className='img'/>  }
        {role === 'student' && isSubmitted && success && <div> <p>Congratulations! You have successfully completed the challenge!</p> </div>}
        {role === 'student'&& isSubmitted && !success && <div> <p>Sorry, you did not pass the challenge. Please try again.</p> </div>} 
      </div>
    </div>
  );
};
