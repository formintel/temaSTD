package com.chat;

import com.mongodb.client.*;
import org.bson.Document;
import java.util.ArrayList;
import java.util.List;

public class DatabaseManager {
    private static final String CONNECTION_STRING = "mongodb://mongodb:27017";
    private static final String DATABASE_NAME = "chatdb";
    private static final String COLLECTION_NAME = "messages";
    private static MongoClient mongoClient;
    private static MongoCollection<Document> collection;

    static {
        try {
            mongoClient = MongoClients.create(CONNECTION_STRING);
            MongoDatabase database = mongoClient.getDatabase(DATABASE_NAME);
            collection = database.getCollection(COLLECTION_NAME);
            System.out.println("MongoDB connection established successfully to " + CONNECTION_STRING);
        } catch (Exception e) {
            System.err.println("Failed to connect to MongoDB: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static void saveMessage(Message message) {
        if (mongoClient == null) {
            System.err.println("Cannot save message: MongoDB connection is not available");
            return;
        }
        try {
            Document doc = new Document("username", message.getUsername())
                    .append("message", message.getMessage())
                    .append("timestamp", message.getTimestamp());
            collection.insertOne(doc);
            System.out.println("Message saved: " + message);
        } catch (Exception e) {
            System.err.println("Failed to save message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static List<Message> getAllMessages() {
        List<Message> messages = new ArrayList<>();
        if (mongoClient == null) {
            System.err.println("Cannot retrieve messages: MongoDB connection is not available");
            return messages;
        }
        try {
            FindIterable<Document> documents = collection.find();
            for (Document doc : documents) {
                Message message = new Message(
                        doc.getString("username"),
                        doc.getString("message"),
                        doc.getString("timestamp")
                );
                messages.add(message);
            }
        } catch (Exception e) {
            System.err.println("Failed to retrieve messages: " + e.getMessage());
            e.printStackTrace();
        }
        return messages;
    }

    public static void clearAllMessages() {
        if (mongoClient == null) {
            System.err.println("Cannot clear messages: MongoDB connection is not available");
            return;
        }
        try {
            collection.deleteMany(new Document());
            System.out.println("All messages cleared");
        } catch (Exception e) {
            System.err.println("Failed to clear messages: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static void printAllMessages() {
        List<Message> messages = getAllMessages();
        System.out.println("=== All Messages in Database ===");
        for (Message msg : messages) {
            System.out.println(msg);
        }
        System.out.println("================================");
    }

    public static void close() {
        if (mongoClient != null) {
            mongoClient.close();
            System.out.println("MongoDB connection closed");
        }
    }
}