FROM fedora:37

RUN dnf -y install git autoconf automake make \
                   python3-flask python3-flask-socketio


RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf -y install nodejs
RUN npm install browserify -g

WORKDIR /opt
RUN git clone https://github.com/adjacentlink/emane-node-view -b develop

WORKDIR emane-node-view
RUN ./autogen.sh && ./configure && make
