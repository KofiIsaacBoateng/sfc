import startServer from "./app/server.js";

const initializeApp = async (): Promise<void> => {
  try {
    startServer();
  } catch (error) {
    console.error("Failed to initialize application: ", error);
    process.exit(1);
  }
};

initializeApp();
