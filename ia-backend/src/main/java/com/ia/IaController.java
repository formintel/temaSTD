package com.ia;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.ai.translation.text.TextTranslationClient;
import com.azure.ai.translation.text.TextTranslationClientBuilder;
import com.azure.ai.translation.text.models.InputTextItem;
import com.azure.core.credential.AzureKeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ia")
@CrossOrigin(origins = "*")
public class IaController {

    private final String azureStorageConnectionString;
    private final String containerName;
    private final String azureSqlConnection;
    private final TextTranslationClient translatorClient;

    public IaController(
            @Value("${azure.storage.connection-string}") String azureStorageConnectionString,
            @Value("${azure.storage.container-name}") String containerName,
            @Value("${spring.datasource.url}") String azureSqlConnection,
            @Value("${azure.translator.endpoint}") String translatorEndpoint,
            @Value("${azure.translator.key}") String translatorKey) {
        
        this.azureStorageConnectionString = azureStorageConnectionString;
        this.containerName = containerName;
        this.azureSqlConnection = azureSqlConnection;
        
        this.translatorClient = new TextTranslationClientBuilder()
                .endpoint(translatorEndpoint)
                .credential(new AzureKeyCredential(translatorKey))
                .buildClient();
    }

    @PostMapping("/process")
    public ResponseEntity<String> processFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file uploaded");
            }

            String fileName = file.getOriginalFilename();
            System.out.println("Processing file: " + fileName);

            // Citim conținutul fișierului
            String fileContent = readFileContent(file.getInputStream());
            
            // Traducem conținutul
            String translatedContent = translateText(fileContent);
            
            // Upload to Azure Blob Storage
            System.out.println("Uploading file to Azure Blob Storage...");
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(azureStorageConnectionString)
                    .buildClient();
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
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
            try (Connection conn = DriverManager.getConnection(azureSqlConnection);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, fileName);
                pstmt.setString(2, translatedBlobClient.getBlobUrl());
                pstmt.setTimestamp(3, new java.sql.Timestamp(System.currentTimeMillis()));
                pstmt.setString(4, result);
                int rowsAffected = pstmt.executeUpdate();
                System.out.println("Data saved to Azure SQL Database, rows affected: " + rowsAffected);
            }
    
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error in IaController: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error processing file: " + e.getMessage());
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
            List<InputTextItem> inputTextItems = new ArrayList<>();
            inputTextItems.add(new InputTextItem(text));
            
            var translation = translatorClient.translate(List.of("ro"), inputTextItems);
            return translation.get(0).getTranslations().get(0).getText();
        } catch (Exception e) {
            System.err.println("Translation error: " + e.getMessage());
            return "Eroare la traducere: " + e.getMessage();
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory() {
        try {
            List<Map<String, Object>> history = new ArrayList<>();
            String sql = "SELECT fileName, blobUrl, timestamp, result FROM FileHistory ORDER BY timestamp DESC";
            
            try (Connection conn = DriverManager.getConnection(azureSqlConnection);
                 PreparedStatement pstmt = conn.prepareStatement(sql);
                 ResultSet rs = pstmt.executeQuery()) {
                
                while (rs.next()) {
                    Map<String, Object> record = new HashMap<>();
                    record.put("fileName", rs.getString("fileName"));
                    record.put("blobUrl", rs.getString("blobUrl"));
                    record.put("timestamp", rs.getTimestamp("timestamp"));
                    record.put("result", rs.getString("result"));
                    history.add(record);
                }
            }
            
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            System.err.println("Error getting history: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestParam String blobName) {
        try {
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(azureStorageConnectionString)
                    .buildClient();
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            BlobClient blobClient = containerClient.getBlobClient(blobName);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            blobClient.download(outputStream);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", blobName);
            
            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error downloading file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
} 