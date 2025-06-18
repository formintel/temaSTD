package com.chat;

import com.google.gson.Gson;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@ServerEndpoint("/chat")
public class ChatEndpoint {
    private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
    private static final Gson gson = new Gson();

    public ChatEndpoint() {
        System.out.println("ChatEndpoint initialized");
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("onOpen called for session: " + session.getId());
        sessions.add(session);
        System.out.println("Client conectat: " + session.getId());

        try {
            List<Message> messages = DatabaseManager.getAllMessages();
            System.out.println("Retrieved " + messages.size() + " messages from database");
            for (Message msg : messages) {
                String messageJson = gson.toJson(msg);
                session.getBasicRemote().sendText(messageJson);
                System.out.println("Sent message to client: " + messageJson);
            }
        } catch (IOException e) {
            System.err.println("Failed to send message history: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Unexpected error in onOpen: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @OnMessage
    public void onMessage(String messageJson, Session session) {
        System.out.println("onMessage called with: " + messageJson);
        try {
            Message message = gson.fromJson(messageJson, Message.class);
            DatabaseManager.saveMessage(message);
            String broadcastJson = gson.toJson(message);
            synchronized (sessions) {
                for (Session s : sessions) {
                    if (s.isOpen()) {
                        try {
                            s.getBasicRemote().sendText(broadcastJson);
                            System.out.println("Broadcasted message to session " + s.getId() + ": " + broadcastJson);
                        } catch (IOException e) {
                            System.err.println("Failed to broadcast to session " + s.getId() + ": " + e.getMessage());
                            e.printStackTrace();
                            sessions.remove(s);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to process message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("onClose called for session: " + session.getId());
        sessions.remove(session);
        System.out.println("Client deconectat: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.out.println("onError called for session: " + (session != null ? session.getId() : "null"));
        throwable.printStackTrace();
        if (session != null) {
            sessions.remove(session);
        }
    }

    public static void shutdown() {
        System.out.println("Shutting down ChatEndpoint");
        DatabaseManager.close();
    }
}