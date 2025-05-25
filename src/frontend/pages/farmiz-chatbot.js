import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { sendMessageToFarmiz, uploadImageToFarmiz, beginFarmizSession } from "../utils/api";
import { v4 as uuidv4 } from "uuid";

export default function FarmizChatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const router = useRouter();

  const suggestions = [
    "What can I ask you to do?",
    "What happened to my plant in the uploaded image?",
    "Why are my plant leaves curling?",
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Prompt confirmation before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (messages.length > 0) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [messages]);

  const startSession = async () => {
    const newUserId = uuidv4();
    setUserId(newUserId);
    try {
      await beginFarmizSession(newUserId);
      setSessionStarted(true);
    } catch (error) {
      alert("Failed to begin session. Please try again later.");
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message, type: "text" };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const reply = await sendMessageToFarmiz(userId, message);
      const botMessage = { sender: "farmiz", text: reply, type: "text" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = { sender: "farmiz", text: "Sorry, Farmiz cannot respond right now.", type: "text" };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setLoading(true);
  
    try {
      const { plant_condition, annotated_image_base64 } = await uploadImageToFarmiz(userId, file);
  
      const userMessage = {
        sender: "user",
        text: "[Uploaded an Image]",
        image: URL.createObjectURL(file),
      };
      const botMessage = {
        sender: "farmiz",
        text: plant_condition,
        image: annotated_image_base64 ? `data:image/jpeg;base64,${annotated_image_base64}` : null,
      };
  
      setMessages((prev) => [...prev, userMessage, botMessage]);
    } catch (error) {
      const botMessage = { sender: "farmiz", text: "Sorry, failed to upload image." };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleNavClick = (href) => {
    if (messages.length > 0) {
      const leave = confirm("You have an active session. End session and leave?");
      if (leave) {
        setMessages([]);
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-green-900">
        <Image src="/chatbot_icon.png" alt="Farmiz Bot" width={100} height={100} />
        <h1 className="text-2xl font-semibold mt-4">Welcome to Farmiz!</h1>
        <div className="mt-8 flex gap-6">
          <button onClick={startSession} className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full">
            Begin Session
          </button>
          <button onClick={() => router.push("/")} className="border border-green-700 text-green-700 px-6 py-3 rounded-full">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-green-900 font-serif scroll-smooth flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md">
        <div className="flex items-center gap-2">
          <Image src="/mrfarmer_logo_3.png" alt="Mr. Farmer" width={75} height={75} />
          <span className="font-bold text-2xl">Mr. Farmer</span>
        </div>
        <div className="hidden md:flex gap-8 text-xl items-center">
          <p onClick={() => handleNavClick("/#overview")} className="hover:text-green-600 cursor-pointer">Overview</p>
          <p onClick={() => handleNavClick("/#access-farmiz")} className="hover:text-green-600 cursor-pointer">Features</p>
          <p onClick={() => handleNavClick("/#plant-care-tips")} className="hover:text-green-600 cursor-pointer">Plants Care Tips</p>
          <p onClick={() => handleNavClick("/#about-us")} className="hover:text-green-600 cursor-pointer">About Us</p>
        </div>
        <div className="flex gap-4">
          <Link href="/farmiz-chatbot"><button className="flex flex-col items-center"><Image src="/chatbot_icon.png" alt="Chatbot" width={40} height={40} /><span className="text-sm">Farmiz</span></button></Link>
          <Link href="/realtime-monitoring"><button className="flex flex-col items-center"><Image src="/monitoring.png" alt="Monitoring" width={40} height={40} /><span className="text-sm">Monitoring</span></button></Link>
        </div>
      </nav>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col justify-end items-center px-6 pb-16 overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <Image src="/chatbot_icon.png" alt="Farmiz Bot" width={100} height={100} />
          <h1 className="text-2xl font-semibold mt-4">Say Hi To Farmiz!</h1>
        </div>

        {/* Messages */}
        <div className="w-full max-w-2xl flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-4 rounded-lg text-sm ${
              msg.sender === "user" ? "self-end bg-green-200" : "self-start border border-green-800 bg-white"
            }`}
          >
            {/* Show text */}
            <p>{msg.text}</p>

            {/* Show image if exists */}
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded"
                className="mt-2 rounded-md max-w-xs"
              />
            )}
          </div>
        ))}

          {loading && (
            <div className="self-start p-4 rounded-lg border border-green-800 bg-white text-sm">
              Farmiz is thinking...
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>

        {/* Suggestions */}
        <div className="mb-8 mt-8">
          <p className="text-gray-600 text-sm mb-4 text-center">Suggestions</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {suggestions.map((suggestion, index) => (
              <button key={index} onClick={() => setMessage(suggestion)} className="border rounded-lg px-4 py-2 text-sm hover:bg-green-100">
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="w-full max-w-2xl flex items-center border rounded-full overflow-hidden">
          <label htmlFor="upload" className="p-4 cursor-pointer">
            <Image src="/upload_image.png" alt="Upload" width={30} height={30} />
          </label>
          <input id="upload" type="file" ref={fileInputRef} onChange={handleUploadImage} className="hidden" />
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask me anything..." className="flex-1 p-4 focus:outline-none" onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
          <button className="p-4" onClick={handleSendMessage}>
            <Image src="/send.png" alt="Send" width={30} height={30} />
          </button>
        </div>
      </main>
    </div>
  );
}
