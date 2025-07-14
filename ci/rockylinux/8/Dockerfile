FROM rockylinux:8

RUN dnf -y update
RUN dnf -y install epel-release dnf-plugins-core
RUN dnf config-manager --set-enabled powertools
RUN dnf clean all

RUN dnf -y install git autoconf automake make python3-flask

# python3-flask-socketio not available ...

RUN curl -fsSL https://rpm.nodesource.com/setup_22.x -o nodesource_setup.sh && bash nodesource_setup.sh
RUN dnf -y install nodejs
RUN npm install browserify -g

WORKDIR /opt
RUN git clone https://github.com/adjacentlink/emane-node-view -b develop

WORKDIR emane-node-view
RUN ./autogen.sh && ./configure && make

RUN echo 'complete'

