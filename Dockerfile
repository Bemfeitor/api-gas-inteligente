# Usa uma versão leve do Node.js
FROM node:18-alpine

# Cria a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o resto do código
COPY . .

# Expõe a porta que sua API usa
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["npm", "start"]
