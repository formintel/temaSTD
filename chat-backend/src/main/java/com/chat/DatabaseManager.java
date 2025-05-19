package com.chat;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DatabaseManager {
    private static final String DB_URL = "jdbc:h2:mem:chatdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";
    private static final String DB_USER = "sa";
    private static final String DB_PASSWORD = "";

    static {
        try {
            // Încarcă driver-ul H2
            Class.forName("org.h2.Driver");
            
            // Inițializează baza de date și creează tabelul
            initializeDatabase();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    private static void initializeDatabase() {
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             Statement stmt = conn.createStatement()) {
            
            // Creează tabelul pentru mesaje dacă nu există
            String createTableSQL = "CREATE TABLE IF NOT EXISTS messages (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "username VARCHAR(255) NOT NULL, " +
                    "message TEXT NOT NULL, " +
                    "timestamp VARCHAR(255) NOT NULL" +
                    ")";
            
            stmt.executeUpdate(createTableSQL);
            System.out.println("Database initialized successfully");
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void saveMessage(Message message) {
        String insertSQL = "INSERT INTO messages (username, message, timestamp) VALUES (?, ?, ?)";
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(insertSQL)) {
            
            pstmt.setString(1, message.getUsername());
            pstmt.setString(2, message.getMessage());
            pstmt.setString(3, message.getTimestamp());
            
            pstmt.executeUpdate();
            System.out.println("Message saved: " + message);
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static List<Message> getAllMessages() {
        List<Message> messages = new ArrayList<>();
        String selectSQL = "SELECT username, message, timestamp FROM messages ORDER BY id ASC";
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(selectSQL)) {
            
            while (rs.next()) {
                Message message = new Message(
                    rs.getString("username"),
                    rs.getString("message"),
                    rs.getString("timestamp")
                );
                messages.add(message);
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return messages;
    }

    // Metodă pentru testare - șterge toate mesajele
    public static void clearAllMessages() {
        String deleteSQL = "DELETE FROM messages";
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             Statement stmt = conn.createStatement()) {
            
            stmt.executeUpdate(deleteSQL);
            System.out.println("All messages cleared");
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Metodă pentru debugging - printează toate mesajele
    public static void printAllMessages() {
        List<Message> messages = getAllMessages();
        System.out.println("=== All Messages in Database ===");
        for (Message msg : messages) {
            System.out.println(msg);
        }
        System.out.println("================================");
    }
}