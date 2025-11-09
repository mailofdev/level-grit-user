import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import Heading from "../../components/navigation/Heading";
import { sendMessage, subscribeToMessages } from "../../config/chatService";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import Loader from "../../components/display/Loader";
import ClientMessagesUI from "./ClientMessagesUI";
import TrainerMessagesUI from "./TrainerMessagesUI";

export default function Messages({ isTrainer = false }) {
  const location = useLocation();
  const params = useParams();
  const loggedInUser = getDecryptedUser();

  // Get data from navigation state or URL params
  const {
    client,
    trainer,
    trainerId: stateTrainerId,
    clientId: stateClientId,
    clientName,
  } = location.state || {};

  // Determine trainerId and clientId based on who is logged in
  let trainerId, clientId;

  if (isTrainer) {
    // Trainer view: trainerId = logged-in trainer, clientId = selected client
    trainerId = loggedInUser?.userId || loggedInUser?.id || loggedInUser?.trainerId;
    clientId = stateClientId || client?.clientId || client?.userId || client?.id;
  } else {
    // Client view: trainerId = selected trainer, clientId = logged-in client
    trainerId = stateTrainerId || params.trainerId || trainer?.trainerId || trainer?.userId || trainer?.id;
    clientId = stateClientId || client?.clientId || loggedInUser?.userId || loggedInUser?.clientId || loggedInUser?.id;
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Subscribe to messages (real-time updates)
  useEffect(() => {
    if (!trainerId || !clientId) {
      console.log("Missing IDs for messages:", { trainerId, clientId, isTrainer, client, trainer, loggedInUser });
      setError("Missing trainer or client information");
      setLoading(false);
      return;
    }

    console.log(`Subscribing to messages (${isTrainer ? "trainer" : "client"} view):`, { trainerId, clientId });

    const unsubscribe = subscribeToMessages(trainerId, clientId, (msgs) => {
      console.log("Received messages:", msgs);
      setMessages(msgs);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [trainerId, clientId, isTrainer]);

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !trainerId || !clientId) return;

    const senderId = isTrainer ? trainerId : clientId;
    console.log(`Sending message (${isTrainer ? "trainer" : "client"} view):`, {
      trainerId,
      clientId,
      senderId,
      message: newMessage.trim(),
    });

    try {
      await sendMessage(trainerId, clientId, senderId, newMessage.trim());
      setNewMessage("");
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  // Determine chat name
  const otherPersonName = isTrainer
    ? client?.fullName || client?.clientName || client?.name || "Client"
    : trainer?.fullName || trainer?.name || "Trainer";
  
  const chatName = `Chat with ${otherPersonName}`;

  // Loading state
  if (loading) {
    return <Loader fullScreen text="Loading messages..." color="var(--color-primary)" />;
  }

  // Error state
  if (error && (!trainerId || !clientId)) {
    return (
      <div className="container py-3">
        <Heading pageName="Messages" sticky={true} />
        <Card className="border-0 shadow-lg mt-4">
          <Card.Body className="text-center py-5">
            <p className="text-danger mb-0">{error}</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <Heading pageName={chatName} sticky={true} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isTrainer ? (
          <TrainerMessagesUI
            client={client}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={onEmojiClick}
            handleSubmit={handleSubmit}
            messagesEndRef={messagesEndRef}
            error={error}
            trainerId={trainerId}
          />
        ) : (
          <ClientMessagesUI
            trainer={trainer}
            clientName={clientName || loggedInUser?.fullName}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={onEmojiClick}
            handleSubmit={handleSubmit}
            messagesEndRef={messagesEndRef}
            error={error}
            clientId={clientId}
          />
        )}
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
          style={{ position: "fixed", top: "80px", right: "20px", zIndex: 1050 }}
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </motion.div>
      )}
    </div>
  );
}
