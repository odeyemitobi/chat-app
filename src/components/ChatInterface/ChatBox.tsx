"use client";

import React, { useState, useRef } from "react";
import { Message, User, MessageType } from "@/types/chat";
import { useChatScroll } from "@/hooks/useChatScroll";
import { validateMessage } from "@/lib/validation";
import { formatTimestamp } from "@/lib/formatters";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

interface ChatBoxProps {
  user: User;
  messages: Message[];
  onSendMessage: (content: string, type?: MessageType) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, messages, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useChatScroll(messages);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (validateMessage(message)) {
      onSendMessage(message, MessageType.TEXT);
      setMessage("");
      messageInputRef.current?.focus();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    onSendMessage(emoji, MessageType.EMOJI);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4" ref={messagesEndRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded ${
              msg.user.id === user.id
                ? "bg-blue-500 text-white self-end"
                : "bg-white text-black self-start"
            }`}
          >
            <strong>{msg.user.username}: </strong>
            {msg.content}
            <small className="block text-xs opacity-50 text-right">
              {formatTimestamp(msg.createdAt)}
            </small>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex p-4 bg-white border-t">
        <input
          ref={messageInputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-l"
        />
        <button
          title="Toggle Emoji Picker"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 bg-gray-200 hover:bg-gray-300"
          aria-label="Toggle Emoji Picker"
        >
          <FaSmile />
        </button>
        <button
          title="Send Message"
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          <FaPaperPlane />
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-4">
          <EmojiPicker onEmojiClick={(e) => handleEmojiClick(e.emoji)} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
