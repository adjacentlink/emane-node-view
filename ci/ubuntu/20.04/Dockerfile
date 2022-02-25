FROM ubuntu:20.04

# prevent failures due to interactive apt transactions
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get -y update
RUN apt-get -y upgrade --no-install-recommends

RUN apt-get -y install git curl autoconf automake make \
                       python3-flask python3-flask-socketio

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
RUN npm install browserify -g

WORKDIR /opt
RUN git clone https://github.com/adjacentlink/emane-node-view -b develop

WORKDIR emane-node-view
RUN ./autogen.sh && ./configure && make
