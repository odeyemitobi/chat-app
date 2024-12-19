'use client';

import React from "react";
import Image from "next/image";
import { ChatBoxProps } from "@/types/chat";
import { useChatScroll } from "@/hooks/useChatScroll";
import { formatTimestamp } from "@/lib/formatters";
import { useChatBox } from "./hooks";
import {
  FaSmile,
  FaSignOutAlt,
  FaImage,
  FaEllipsisV,
} from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";

const ChatBox: React.FC<ChatBoxProps> = ({
  user,
  messages,
  onSendMessage,
  onLogout,
}) => {
  const {
    message,
    showEmojiPicker,
    isTyping,
    messageInputRef,
    chatContainerRef,
    messageRefs,
    setShowEmojiPicker,
    handleSendMessage,
    handleEmojiClick,
    handleTyping,
  } = useChatBox(messages, onSendMessage);

  const messagesEndRef = useChatScroll(messages);

  return (
    <div
      ref={chatContainerRef}
      className="chat-container flex flex-col h-screen max-w-2xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-xl"
    >
      {/* Chat Header */}
      <div className="chat-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 border-b md:rounded-t-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={user.avatar || "/Bluey.jpg"}
              alt={user.username}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{user.username}</h3>
            <p className="text-xs text-gray-200">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            title="More options"
            onClick={() => {}}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <FaEllipsisV />
          </button>
          <button
            title="Sign out"
            onClick={onLogout}
            className="p-2 text-red-300 hover:bg-white/10 rounded-full transition-colors"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="chat-messages flex-grow overflow-y-auto p-4 space-y-4"
        ref={messagesEndRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            ref={(el) => {
              if (el) {
                messageRefs.current.set(msg.id, el);
              }
            }}
            className={`flex ${
              msg.user.id === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl ${
                msg.user.id === user.id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.user.id !== user.id && (
                <p className="text-xs font-medium mb-1">{msg.user.username}</p>
              )}
              <p className="break-words">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {formatTimestamp(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-sm">{user.username} is typing...</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <div className="flex-grow relative">
            <input
              ref={messageInputRef}
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="chat-input text-black w-full p-3 pr-12 rounded-full border border-gray-200 transition-colors"
            />
            <button
              title="Show emoji picker"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FaSmile />
            </button>
          </div>
          <button
            title="Send an image"
            onClick={() => {}}
            className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaImage />
          </button>
          <button
            title="Send message"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all hover:scale-105 ${
              message.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <BiSolidSend />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={(e) => handleEmojiClick(e.emoji)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;