# Etapa de build
FROM node:18 as build

WORKDIR /app

# Copiem fișierele de configurare
COPY package*.json ./
COPY tsconfig*.json ./
COPY angular.json ./

# Instalăm dependențele
RUN npm install

# Copiem codul sursă
COPY src/ ./src/

# Construim aplicația
RUN npm run build -- --configuration production

# Etapa de producție
FROM nginx:alpine

# Copiem configurația nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiem build-ul din etapa anterioară
COPY --from=build /app/dist/ia-frontend/browser /usr/share/nginx/html

# Expunem portul 90
EXPOSE 90

CMD ["nginx", "-g", "daemon off;"] 