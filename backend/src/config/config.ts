export const config = {
  MONGO_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/chatbot",
  NODE_ENV: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5001),
  appName: "Universal Chatbot Service",
};
