# Stage 1: Build React app
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./

# 먼저 필요한 바이너리 설치
RUN npm install -g @rollup/rollup-linux-x64-gnu
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]