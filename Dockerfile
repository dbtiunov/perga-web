# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy configs
COPY tsconfig.json .
COPY tsconfig.app.json .
COPY tsconfig.node.json .
COPY tailwind.config.js .
COPY eslint.config.js .
COPY vite.config.ts .

# Copy app code
COPY index.html .
COPY src ./src

# Declare ARG (build-time var) and pass ARG into ENV for Vite
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the application
RUN npm run build

## Runner stage
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
