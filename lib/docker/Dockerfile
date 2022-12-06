## Ubuntu Server Base Image
## Sets up and initializes the base webserver installation
## author: Carlos L. Cuenca

FROM ubuntu as base

# Install needed programs
RUN apt-get update && \
    apt-get install -y build-essential && \
    apt-get install -y software-properties-common && \
    apt-get install -y byobu curl git htop man unzip vim wget && \
    apt-get install -y nodejs npm && \
    mkdir /usr/src/app && \      
    cd /usr/src/app && \        
    git clone https://github.com/clcuenca/clcuenca-dev.git && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install Dependencies
RUN cd clcuenca-dev && npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
#COPY . .

EXPOSE 8080

CMD [ "bin/www" ]