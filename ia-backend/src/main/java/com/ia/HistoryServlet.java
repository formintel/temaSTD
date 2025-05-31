package com.ia;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/ia/history")
public class HistoryServlet extends HttpServlet {
    private static final String AZURE_SQL_CONNECTION = "jdbc:sqlserver://stdtema-sql.database.windows.net:1433;database=iaDB;user=dbadmin@stdtema-sql;password=Parola1234;encrypt=true;trustServerCertificate=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;";

    @Override
    public void init() throws ServletException {
        super.init();
        try {
            // Încarcă driver-ul SQL Server
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            System.out.println("SQL Server JDBC Driver loaded successfully");
            try (Connection conn = DriverManager.getConnection(AZURE_SQL_CONNECTION)) {
                System.out.println("Successfully connected to Azure SQL Database during init.");
            }
        } catch (Exception e) {
            System.err.println("Failed to connect to Azure SQL Database during init: " + e.getMessage());
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String sql = "SELECT fileName, blobUrl, timestamp, result FROM FileHistory ORDER BY timestamp DESC";
        try (Connection conn = DriverManager.getConnection(AZURE_SQL_CONNECTION);
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            JSONArray jsonArray = new JSONArray();
            while (rs.next()) {
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("fileName", rs.getString("fileName"));
                jsonObj.put("blobUrl", rs.getString("blobUrl"));
                jsonObj.put("timestamp", rs.getTimestamp("timestamp").toString());
                jsonObj.put("result", rs.getString("result"));
                jsonArray.put(jsonObj);
            }
            response.getWriter().write(jsonArray.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Error retrieving history: " + e.getMessage() + "\"}");
        }
    }
}