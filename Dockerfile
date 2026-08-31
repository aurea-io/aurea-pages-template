FROM node:22-alpine

WORKDIR /app
COPY package.json server.js server.mjs ./
COPY apps/web ./apps/web

RUN npm install --omit=dev
RUN mkdir -p /app/logs && chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=4173
EXPOSE 4173
VOLUME ["/app/logs"]
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD node -e "fetch('http://127.0.0.1:4173/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"
CMD ["node", "server.mjs"]
