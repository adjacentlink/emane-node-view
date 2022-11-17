FROM rockylinux:8.5

RUN dnf -y update
RUN dnf -y install epel-release dnf-plugins-core
RUN dnf config-manager --set-enabled powertools

RUN dnf -y install git autoconf automake make python3-flask

# python3-flask-socketio not available ...


RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf -y install nodejs
RUN npm install browserify -g

WORKDIR /opt
RUN git clone https://github.com/adjacentlink/emane-node-view -b develop

WORKDIR emane-node-view
RUN ./autogen.sh && ./configure && make

RUN echo 'complete'

