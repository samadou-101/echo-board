import React, { useState, useEffect, useRef } from "react";
import socket from "@services/socket/socket";
import { useAppSelector } from "@hooks/redux/redux-hooks";

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: number;
}

const Chat: React.FC<{ userId: string; roomId: string | null }> = ({
  userId,
  roomId,
}) => {
  const isOpen = useAppSelector((state) => state.global.isChatOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const handleMessage = (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== userId) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("chat-message", handleMessage);
    socket.on("typing", handleTyping);

    socket.emit("get-messages", roomId, (previousMessages: ChatMessage[]) => {
      if (Array.isArray(previousMessages)) {
        setMessages(previousMessages);
      }
    });

    return () => {
      socket.off("chat-message", handleMessage);
      socket.off("typing", handleTyping);
    };
  }, [roomId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (message.trim() && roomId) {
      const chatMessage: ChatMessage = {
        userId,
        message: message.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, chatMessage]);
      socket.emit("chat-message", { roomId, message: chatMessage });
      setMessage("");
      socket.emit("typing", { roomId, userId, isTyping: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (roomId) {
      socket.emit("typing", { roomId, userId, isTyping: true });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { roomId, userId, isTyping: false });
      }, 2000);
    }
  };

  useEffect(() => {
    if (roomId && messages.length === 0) {
      setMessages([
        {
          userId: "system",
          message: "Welcome to the chat! Send your first message.",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [roomId, messages.length]);

  const groupedMessages = messages.reduce(
    (groups: Record<string, ChatMessage[]>, message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {},
  );

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100vh-4rem)] transition-all duration-300 ${
        isOpen ? "w-96" : "w-0"
      } overflow-hidden bg-white/70 shadow-lg backdrop-blur-md dark:bg-gray-900/70`}
    >
      {isOpen && (
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {roomId ? `Room: ${roomId.slice(0, 8)}...` : "Chat"}
                </h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-300">
                {messages.length} messages
              </span>
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto p-4">
            {roomId ? (
              Object.keys(groupedMessages).length > 0 ? (
                Object.keys(groupedMessages).map((date) => (
                  <div key={date} className="mb-6">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white/70 px-2 text-xs text-gray-500 dark:bg-gray-900/70 dark:text-gray-300">
                          {new Date(date).toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {groupedMessages[date].map((msg, index) => (
                      <div
                        key={`${date}-${index}`}
                        className={`flex ${
                          msg.userId === "system"
                            ? "justify-center"
                            : msg.userId === userId && index !== 0
                              ? "justify-end"
                              : "justify-start"
                        } mb-4`}
                      >
                        {(msg.userId !== userId || index === 0) &&
                          msg.userId !== "system" && (
                            <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                              {msg.userId.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2 shadow ${
                            msg.userId === "system"
                              ? "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              : msg.userId === userId && index !== 0
                                ? "bg-blue-500 text-white dark:bg-blue-400"
                                : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          <p className="overflow-hidden text-sm break-words whitespace-pre-wrap">
                            {msg.message}
                          </p>
                          {msg.userId !== "system" && (
                            <span
                              className={`block text-right text-xs ${
                                msg.userId === userId && index !== 0
                                  ? "text-gray-200"
                                  : "text-gray-500 dark:text-gray-300"
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                            </span>
                          )}
                        </div>
                        {msg.userId === userId && index !== 0 && (
                          <div className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white dark:bg-blue-400">
                            YOU
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-300">
                    <p>No messages yet</p>
                    <p className="mt-2 text-xs">
                      Send your first message below
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-300">
                  <p>No room selected</p>
                  <p className="mt-2 text-xs">Join a room to start chatting</p>
                </div>
              </div>
            )}
            {isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-2xl bg-gray-200 px-4 py-2 dark:bg-gray-800">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-500 dark:bg-gray-300"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-500 dark:bg-gray-300"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-500 dark:bg-gray-300"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="relative">
              <textarea
                ref={textareaRef}
                className="w-full resize-none rounded-2xl bg-gray-100 px-4 py-3 pr-12 text-gray-800 placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-300"
                value={message}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  roomId ? "Type a message..." : "Join a room to chat"
                }
                rows={1}
                disabled={!roomId}
                style={{ minHeight: "46px", maxHeight: "120px" }}
              />
              <button
                className="absolute right-2 bottom-2 rounded-full bg-blue-500 p-2 text-white transition-all duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 dark:bg-blue-400 dark:hover:bg-blue-500"
                onClick={sendMessage}
                disabled={!message.trim() || !roomId}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            {roomId && (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-300">
                  <span>Shift+Enter for new line</span>
                </div>
                <div className="text-xs text-blue-500 dark:text-blue-400">
                  {message.length}/500
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
