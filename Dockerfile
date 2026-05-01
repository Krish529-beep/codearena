# 1. Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
ARG VITE_GOOGLE_CLIENT_ID=556210530699-tj13785qr0cgpar24lso4c3goj2586hg.apps.googleusercontent.com
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# 2. Setup Backend
FROM node:20-slim
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install

COPY server/ ./server/
COPY --from=frontend-build /app/client/dist ./client/dist

# 3. Environment Variables
ENV NODE_ENV=production
ENV PORT=7860

EXPOSE 7860

# 4. Start Server
CMD ["node", "server/src/app.js"]
