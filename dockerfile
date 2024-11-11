FROM node:18

# Crear directorio de la app
WORKDIR /usr/src/app

# Instalar dependencias
COPY package*.json ./

RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 5000

# Comando para iniciar la app
CMD ["npm", "run", "dev"]
