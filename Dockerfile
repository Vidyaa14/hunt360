FROM node:20-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    udev \
    ttf-freefont \
    bash \
    curl \
    unzip \
    chromium-chromedriver

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROMEDRIVER_BIN=/usr/bin/chromedriver \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
