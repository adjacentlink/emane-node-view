FROM fedora:41

RUN dnf -y install git autoconf automake make \
                   python3-flask python3-flask-socketio python3-setuptools

RUN curl -fsSL https://rpm.nodesource.com/setup_22.x -o nodesource_setup.sh && bash nodesource_setup.sh
RUN dnf -y install nodejs
RUN npm install browserify -g

WORKDIR /opt
RUN git clone https://github.com/adjacentlink/emane-node-view -b develop

WORKDIR emane-node-view
RUN ./autogen.sh && ./configure && make
