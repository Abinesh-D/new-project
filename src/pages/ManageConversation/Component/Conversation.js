import React, { useState, useEffect } from 'react';
import { retrieveChatBoxData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
import { useDispatch, useSelector } from 'react-redux';
import './Conversation.css';

const Conversation = () => {

  const dispatch = useDispatch();
  const chatData = useSelector(state => state.patentSlice.chatBoxData);
  console.log('chatData :>> ', chatData);

  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = [{ role: 'user', content: input }];
    const updatedHistory = [...chatHistory, userMessage];

    setChatHistory(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      console.log('input :>> ', input);

      await dispatch(retrieveChatBoxData(input, dispatch));
    } catch (err) {
      console.error("Error:", err);
    }
  };


useEffect(() => {
  if (chatData?.message?.content?.[0]?.text) {
    const botMessage = {
      role: "CHATBOT",
      message: chatData.message.content[0].text,
    };
    setChatHistory((prev) => [...prev, botMessage]);
    setLoading(false);
  }
}, [chatData]);



  // const handleSend = async () => {
  //     if (!input.trim()) return;
  //     const userMessage = { role: "USER", message: input };
  //     const updatedHistory = [...chatHistory, userMessage];
  //     setChatHistory(updatedHistory);
  //     setLoading(true);

  //     try {
  //         //   const res = await axios.post('http://localhost:5000/cohere-chat', {
  //         //     message: input,
  //         //     chatHistory: updatedHistory
  //         //   });

  //         await dispatch(retrieveChatBoxData(input, updatedHistory));

  //         // const botMessage = { role: "CHATBOT", message: res.data.text };
  //         // setChatHistory([...updatedHistory, botMessage]);
  //         // setInput('');
  //     } catch (err) {
  //         console.error("Error:", err);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  return (
    <div className="chat-container">
      <h2>Cohere AI Chat</h2>
      <div className="chat-box">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`message ${msg?.role?.toLowerCase()}`}>
            <strong>{msg.role === "USER" ? "You" : "Bot"}:</strong> {msg.message}
          </div>
        ))}
        {loading && <div className="message bot">Bot: Typing...</div>}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Conversation;
