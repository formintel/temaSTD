FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src/ ./src/
RUN mvn clean package -DskipTests

FROM tomcat:10.1-jdk17-openjdk

# Șterge aplicațiile implicite
RUN rm -rf /usr/local/tomcat/webapps/*

# Copiază WAR-ul generat
COPY --from=build /app/target/chat-backend.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 88

# Modifică portul Tomcat la 88
RUN sed -i 's/port=\"8080\"/port=\"88\"/g' /usr/local/tomcat/conf/server.xml

CMD ["catalina.sh", "run"]