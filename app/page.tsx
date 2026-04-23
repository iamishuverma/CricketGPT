"use client";
import Image from "next/image";
import CricketGPTLogo from "./assets/logo.png";
import { useChat } from "@ai-sdk/react";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import { useState } from "react";
import { TextStreamChatTransport } from "ai";

const Home = () => {
  const { sendMessage, status, messages } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
    }),
  });
  const [input, setInput] = useState("");

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = async (promptText) => {
    await sendMessage({
      text: promptText,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input) return;

    const text = input;

    setInput("");

    await sendMessage({
      text: text,
    });
  };

  return (
    <main>
      <Image src={CricketGPTLogo} width="250" alt="CricketGPT Logo" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              The Ultimate place for Cricket fans! Ask CricketGPT anything about
              the fantastic topic of Cricket and it will come back with the most
              up-to-date answers. We hope you enjoy!
            </p>
            <br />
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {status == "submitted" && <LoadingBubble />}
          </>
        )}
      </section>
      <form onSubmit={onSubmit}>
        <input
          className="question-box"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Ask me something..."
        />
        <input type="submit" />
      </form>
    </main>
  );
};

export default Home;
