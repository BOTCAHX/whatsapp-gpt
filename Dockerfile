# FROM node:16.16.0-buster  (nodejs v16)
FROM ubuntu

# from: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
# setup chrome from ubuntu and configure.
RUN apt-get update \
    && apt-get install -y wget gnupg curl sudo \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update -y \ 
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
        --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true 
    # PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# NodeJS Installer the latest version.
# Recode By "https://github.com/MyDapitt/ssweb-api-caliph"
# Terima kasih sudah memberikan saran codemu dari repository saya :)
# LTS       :   https://deb.nodesource.com/setup_lts.x
# Current   :   https://deb.nodesource.com/setup_current.x
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash - && \
    apt-get install nodejs -y

# See the process from nodejs
RUN node -e "console.log('Process',JSON.stringify(process,null,4))"

# Running for nodejs Only
# Make and set new directory the path.
RUN mkdir -p /project/app /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /project/app
COPY package.json /project/app
RUN echo -e "-> files:\n$(ls)\n\n-> Folder: $(pwd)"

# Puppeteer v13.5.0 works with Chromium 100.
# RUN yarn add puppeteer@13.5.0

# If running Docker >= 1.13.0 use docker run's --init arg to reap zombie processes, otherwise
# uncomment the following lines to have `dumb-init` as PID 1
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_x86_64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Install puppeteer so it's available in the container.
RUN npm i -g npm@latest
RUN npm init -y
RUN npm install && \
    npm i puppeteer \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads /project/app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /project/app/node_modules \
    && chown -R pptruser:pptruser /project/app/package.json \
    && chown -R pptruser:pptruser /project/app/package-lock.json \
    && chown -R pptruser:pptruser /project/app

COPY . /api/webapp
RUN echo -e "-> files:\n$(ls)\n\n-> Folder: $(pwd)"
RUN npm audit fix --force
RUN node test.js
USER pptruser

# Port
EXPOSE 8050

CMD [ "node", "bot.js" ]
