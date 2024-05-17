import React, { useState } from 'react';
import './ChatArea.css';

const ChatArea = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div className='chat-area'>
      <div className='messages'>
        {messages.map((message, index) => (
          <div key={index} className='message'>
            {message}
          </div>
        ))}
      </div>
      <div className='input-area'>
        <input
          type='text'
          value={input}
          onChange={handleInputChange}
          placeholder='Type a message'
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatArea;
