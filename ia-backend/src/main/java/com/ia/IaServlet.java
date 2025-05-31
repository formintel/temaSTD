package com.ia;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.ai.translation.text.TextTranslationClient;
import com.azure.ai.translation.text.TextTranslationClientBuilder;
import com.azure.ai.translation.text.models.InputTextItem;
import com.azure.core.credential.AzureKeyCredential;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/ia/process")
@MultipartConfig
public class IaServlet extends HttpServlet {
    private static final String AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=stdtemastorage;AccountKey=UrPcJEvx4WmzeTGdMSqPzKywDXT5nLrLJuOifaKKOitE5EhCY4lydDbQZTfOnCgSlietjknFxfJI+ASt8+NiLA==;EndpointSuffix=core.windows.net";
    private static final String CONTAINER_NAME = "files";
    private static final String AZURE_SQL_CONNECTION = "jdbc:sqlserver://stdtema-sql.database.windows.net:1433;database=iaDB;user=dbadmin@stdtema-sql;password=Parola1234;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;";
    private static final String TRANSLATOR_ENDPOINT = "https://ia-translator-service.cognitiveservices.azure.com/";
    private static final String TRANSLATOR_KEY = "42XjVGICUU2DYabxlTOLXfB4pDA1LbZssohkZmYWj14BcoS5EXlEJQQJ99BEAC5RqLJXJ3w3AAAbACOGSldf"; // Trebuie să adăugați cheia dvs.

    private TextTranslationClient translatorClient;

    @Override
    public void init() throws ServletException {
        super.init();
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            System.out.println("SQL Server JDBC Driver loaded successfully");
            
            // Inițializare client traducere
            translatorClient = new TextTranslationClientBuilder()
                .endpoint(TRANSLATOR_ENDPOINT)
                .credential(new AzureKeyCredential(TRANSLATOR_KEY))
                .buildClient();
        } catch (ClassNotFoundException e) {
            throw new ServletException("Failed to load SQL Server JDBC Driver", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("IaServlet processing POST request for /ia/process");
        Part filePart = null;
        try {
            filePart = request.getPart("file");
            if (filePart == null) {
                throw new ServletException("No file part found in request");
            }
            String fileName = filePart.getSubmittedFileName();
            if (fileName == null || fileName.isEmpty()) {
                throw new ServletException("File name is empty or null");
            }
            System.out.println("Processing file: " + fileName);
    
            // Citim conținutul fișierului
            String fileContent = readFileContent(filePart.getInputStream());
            
            // Traducem conținutul
            String translatedContent = translateText(fileContent);
            
            // Upload to Azure Blob Storage
            System.out.println("Uploading file to Azure Blob Storage...");
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(AZURE_STORAGE_CONNECTION_STRING)
                    .buildClient();
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(CONTAINER_NAME);
            containerClient.createIfNotExists();
            
            // Salvăm fișierul original
            byte[] originalContent = fileContent.getBytes();
            BlobClient originalBlobClient = containerClient.getBlobClient("original_" + fileName);
            originalBlobClient.upload(new ByteArrayInputStream(originalContent), originalContent.length, true);
            
            // Salvăm versiunea tradusă
            byte[] translatedBytes = translatedContent.getBytes();
            BlobClient translatedBlobClient = containerClient.getBlobClient("translated_" + fileName);
            translatedBlobClient.upload(new ByteArrayInputStream(translatedBytes), translatedBytes.length, true);
            
            String result = "Fisier tradus cu succes. Versiunea tradusa: " + translatedBlobClient.getBlobUrl();
            System.out.println("Processing result: " + result);
    
            // Salvează în Azure SQL Database
            System.out.println("Saving to Azure SQL Database...");
            String sql = "INSERT INTO FileHistory (fileName, blobUrl, timestamp, result) VALUES (?, ?, ?, ?)";
            try (Connection conn = DriverManager.getConnection(AZURE_SQL_CONNECTION);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, fileName);
                pstmt.setString(2, translatedBlobClient.getBlobUrl());
                pstmt.setTimestamp(3, new java.sql.Timestamp(System.currentTimeMillis()));
                pstmt.setString(4, result);
                int rowsAffected = pstmt.executeUpdate();
                System.out.println("Data saved to Azure SQL Database, rows affected: " + rowsAffected);
            }
    
            response.setContentType("text/plain");
            response.getWriter().write(result);
            System.out.println("Response sent successfully with content: " + result);
        } catch (Exception e) {
            System.err.println("Error in IaServlet: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error processing file: " + e.getMessage());
            System.err.println("Stack trace: " + e.getStackTrace());
        } finally {
            if (filePart != null) {
                try {
                    filePart.delete();
                    System.out.println("Temporary file deleted successfully");
                } catch (IOException e) {
                    System.err.println("Failed to delete temporary file: " + e.getMessage());
                }
            }
        }
    }

    private String readFileContent(InputStream inputStream) throws IOException {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }
        return content.toString();
    }

    private String translateText(String text) {
        try {
            // Creăm lista de texte pentru traducere
            List<InputTextItem> inputTextItems = new ArrayList<>();
            inputTextItems.add(new InputTextItem(text));
            
            // Traducem textul în română
            var translation = translatorClient.translate(List.of("ro"), inputTextItems);
            return translation.get(0).getTranslations().get(0).getText();
        } catch (Exception e) {
            System.err.println("Translation error: " + e.getMessage());
            return "Eroare la traducere: " + e.getMessage();
        }
    }
}