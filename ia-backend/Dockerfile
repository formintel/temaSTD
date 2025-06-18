# Etapa de build
FROM maven:3.9-eclipse-temurin-21 as build

WORKDIR /app

# Copiem fișierele de configurare
COPY pom.xml .

# Descărcăm dependențele
RUN mvn dependency:go-offline

# Copiem codul sursă
COPY src/ ./src/

# Construim aplicația
RUN mvn clean package -DskipTests

# Verificăm dacă JAR-ul a fost creat
RUN ls -l target/

# Etapa de producție
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copiem JAR-ul din etapa anterioară
COPY --from=build /app/target/*.jar ./app.jar

# Verificăm dacă JAR-ul a fost copiat
RUN ls -l

# Expunem portul 8080
EXPOSE 8080

# Configurăm variabilele de mediu pentru Azure
ENV SPRING_DATASOURCE_URL="jdbc:sqlserver://stdtema-sql.database.windows.net:1433;database=iaDB;user=dbadmin@stdtema-sql;password=Parola1234;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"
ENV SPRING_DATASOURCE_USERNAME="dbadmin@stdtema-sql"
ENV SPRING_DATASOURCE_PASSWORD="Parola1234"
ENV AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=stdtemastorage;AccountKey=UrPcJEvx4WmzeTGdMSqPzKywDXT5nLrLJuOifaKKOitE5EhCY4lydDbQZTfOnCgSlietjknFxfJI+ASt8+NiLA==;EndpointSuffix=core.windows.net"
ENV AZURE_STORAGE_CONTAINER_NAME="files"
ENV AZURE_TRANSLATOR_ENDPOINT="https://ia-translator-service.cognitiveservices.azure.com/"
ENV AZURE_TRANSLATOR_KEY="42XjVGICUU2DYabxlTOLXfB4pDA1LbZssohkZmYWj14BcoS5EXlEJQQJ99BEAC5RqLJXJ3w3AAAbACOGSldf"

# Pornim aplicația Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"] 