package com.chat;

import com.google.gson.Gson;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/chat")
public class ChatEndpoint {
    private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
    private static final Gson gson = new Gson();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("Client conectat: " + session.getId());
        
        // Trimite istoricul mesajelor la client - direct ca array de mesaje
        try {
            String historyJson = gson.toJson(DatabaseManager.getAllMessages());
            // Trimitem fiecare mesaj din istoric individual pentru consistență
            for (Message msg : DatabaseManager.getAllMessages()) {
                String messageJson = gson.toJson(msg);
                session.getBasicRemote().sendText(messageJson);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnMessage
    public void onMessage(String messageJson, Session session) {
        try {
            // Parsează mesajul primit de la client
            Message message = gson.fromJson(messageJson, Message.class);
            
            // Salvează în baza de date
            DatabaseManager.saveMessage(message);
            
            // Trimite mesajul la toți clienții conectați direct ca JSON
            String broadcastJson = gson.toJson(message);
            synchronized (sessions) {
                for (Session s : sessions) {
                    if (s.isOpen()) {
                        try {
                            s.getBasicRemote().sendText(broadcastJson);
                        } catch (IOException e) {
                            e.printStackTrace();
                            // Îndepărtează sesiunea problemă
                            sessions.remove(s);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        System.out.println("Client deconectat: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.out.println("Eroare pentru sesiunea " + session.getId());
        throwable.printStackTrace();
        sessions.remove(session);
    }
}