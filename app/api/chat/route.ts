import OpenAI from "openai";
import { streamText, convertToModelMessages } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { openai } from "@ai-sdk/openai";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openAI = new OpenAI({ apiKey: OPENAI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.parts
      ?.filter((p) => p.type === "text")
      ?.map((p) => p.text)
      ?.join("");

    let docContext = "";

    const embedding = await openAI.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 20,
      });

      const documents = await cursor.toArray();

      const docsMap = documents?.map((doc) => doc.text);

      docContext = JSON.stringify(docsMap);
    } catch (err) {
      console.log("Error querying db...");
      docContext = "";
    }

    const template = {
      role: "system" as const,
      content: `You are an AI assistant who knows everything about Cricket.
            Use the below context to augment what you know about Cricket.
            The context will provide you with the most recent page data from wikipedia.
            If the context doesn't include the information you need answer based on your
            existing knowledge and don't mention the source of your information or
            what the context does or doesn't include.
            Format responses using markdown where applicable and don't return images.
        ---------------
        START CONTEXT
        ${docContext}
        END CONTEXT
        ---------------
        QUESTION: ${latestMessage}
        ---------------
            `,
    };

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: [template, ...modelMessages],
    });
    return result.toTextStreamResponse();
  } catch (err) {
    throw err;
  }
}
