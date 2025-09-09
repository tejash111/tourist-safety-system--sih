"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DATASET from "@/lib/Standardisedver.json";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Lottie from "lottie-react";
import animationDate from "@/lib/logo-ai.json";
import HeaderChatbot from "@/components/headerChatbot";

// --- SVG Icons ---
const SendIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
  </svg>
);

const CompassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3L9.5 8.5L4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

// --- Main Component ---
export default function SafeTravelChatbot() {
  // --- State Management ---
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    // Scroll to the bottom of the chat on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // --- Core Functions ---
  const handleSendMessage = async (messageText = newMessage) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    const userMessage = { type: "user", text: trimmedMessage };
    setChatMessages((prev) => [...prev, userMessage]);
    setIsBotTyping(true);
    setNewMessage("");

    // Simulate API call
    await getBotResponse(trimmedMessage);
  };

  const getBotResponse = async (userQuestion) => {
    // This is where you would call the Gemini API
    // For demonstration, we'll use a local response generation
    // Build a clean conversation history string
    const history = chatMessages
      .map(
        (msg) => `${msg.type === "user" ? "User" : "Assistant"}: ${msg.text}`
      )
      .join("\n");

    const instruction = {
      text: `
You are **SafeTravel India**, a professional yet friendly AI safety assistant for tourists in India.  

### Core Principles
1. **Interpret, Don’t Recite** — analyze and adapt advice instead of copy-pasting.  
2. **Keep it Cautious** — always prioritize user safety with a practical and empathetic tone.  
3. **Stay Contextual** — continue the flow of conversation naturally, remembering what was previously asked/answered.  
4. **Be Concise** — keep answers short, easy to read, and well-structured.  
5. **Use Data Wisely** — rely on the dataset provided when relevant, but phrase advice conversationally.  
6. **Honest Limitations** — if you don’t have the answer, politely say so instead of guessing.  

### Conversation Continuity
Here’s the chat so far:
${history}

### Dataset for Reference
${JSON.stringify(DATASET, null, 2)}
  `,
    };

    const body = {
      contents: [
        {
          parts: [instruction, { text: `User question: ${userQuestion}` }],
        },
      ],
    };
    const apiKey = "AIzaSyCr7RlUz910nhaLin7YMj98DqEh83TgLCA"; // IMPORTANT: Leave this as-is for the environment to inject the key.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";

      setChatMessages((prev) => [...prev, { type: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I ran into an issue fetching AI assistance. Please try again.",
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handlePresetClick = (presetText) => {
    setNewMessage(presetText);
    handleSendMessage(presetText);
  };

  // --- Render ---
  return (



    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#f7f7ff] font-sans relative overflow-hidden">
      {/* Background Glow */}
      <HeaderChatbot/>

      <Image
        src="/Traveling-rafiki.svg"
        alt="Background Image"
        className="absolute top-0 right-120 w-full h-full object-fit opacity-50"
        width={1000}
        height={1000}
      />
      <Image
        src="/Travelers-cuate.svg"
        alt="Background Image"
        className="absolute top-0 left-120 w-full h-full object-fit opacity-50"
        width={1000}
        height={1000}
      />

      <div className="w-full max-w-3xl h-full my-10 flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <AnimatePresence>
          {!isChatStarted ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <Lottie
                animationData={animationDate}
                loop={true}
                style={{ width: "300px", height: "300px" }}
              />
              <h1 className="text-4xl md:text-3xl font-bold text-gray-800">
                Hi there!
              </h1>
              <p className="text-2xl md:text-2xl text-gray-600 mt-2">
                How can I help you today?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full">
                <PresetCard
                  icon={<CompassIcon />}
                  text="Plan a trip to the mountains"
                  onClick={() =>
                    handlePresetClick(
                      "Plan a 7-day trip to the mountains in North India"
                    )
                  }
                />
                <PresetCard
                  icon={<SparkleIcon />}
                  text="Find hidden gems in Goa"
                  onClick={() =>
                    handlePresetClick(
                      "What are some hidden gems or offbeat places to visit in Goa?"
                    )
                  }
                />
                <PresetCard
                  icon={<ShieldIcon />}
                  text="Is it safe to travel to..."
                  onClick={() =>
                    handlePresetClick(
                      "How safe is it for a solo female traveler to visit Mumbai?"
                    )
                  }
                />
              </div>
            </motion.div>
          ) : (
            <div
              key="chat"
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar"
            >
              <AnimatePresence>
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex my-3 ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] text-base prose prose-sm ${
                        msg.type === "user"
                          ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-br-none prose-invert"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2">{children}</p>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
                {isBotTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex justify-start"
                  >
                    <div className="p-3 rounded-2xl  gap-2 rounded-bl-none bg-gray-200 flex items-center space-x-2">
                      {/* Animated "Thinking..." text */}
                      Thinking
                      {/* Animated bouncing dots */}
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-1 h-1 bg-gray-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-1 h-1 bg-gray-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="w-1 h-1 bg-gray-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="mt-auto pt-4">
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything about your travel plans..."
              className="w-full p-4 pr-14 rounded-full border border-gray-300/80 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow duration-300 shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isBotTyping}
            />
            <motion.button
              onClick={() => handleSendMessage()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newMessage.trim() || isBotTyping}
            >
              <SendIcon />
            </motion.button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
          border: 3px solid transparent;
        }
      `}</style>
    </div>
  );
}

// --- Sub-components ---
const PresetCard = ({ icon, text, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    whileTap={{ scale: 0.98 }}
    className="bg-white/80 p-6 rounded-xl border border-gray-200/70 text-left transition-shadow duration-300"
  >
    <div className="text-purple-600 mb-3">{icon}</div>
    <p className="font-semibold text-gray-700">{text}</p>
  </motion.button>
);
