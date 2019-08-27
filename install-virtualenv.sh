#!/bin/bash -
#
# Copyright (c) 2019 - Adjacent Link LLC, Bridgewater, New Jersey
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
# * Redistributions of source code must retain the above copyright
#   notice, this list of conditions and the following disclaimer.
# * Redistributions in binary form must reproduce the above copyright
#   notice, this list of conditions and the following disclaimer in
#   the documentation and/or other materials provided with the
#   distribution.
# * Neither the name of Adjacent Link LLC nor the names of its
#   contributors may be used to endorse or promote products derived
#   from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
# FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
# COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
# BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
# ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#

develop=0
python=python2

# process options
while getopts ":hd23" opt;
do
    case $opt in
        h)
            echo 'usage: install-virtual.sh [-d] [-2|-3] <install dir>'
            echo
            echo 'options:'
            echo '   -d             Development mode. Install with pip -e.'
            echo '   -2             Build Python2 virtualenv. (default)'
            echo '   -3             Build Python3 virtualenv.'
            echo
            exit 0
            ;;
        d)
            develop=1
            ;;
        2)
            python=python2
            ;;
        3)
            python=python3
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            exit 1
            ;;
    esac
done

shift $((OPTIND -1))

if [ $# -ne 1 ]
then
    echo 'error: invalid usage. See `./install-virtual.sh -h`.'
    exit 1
fi

install_dir=$1

if [ ! -d $install_dir ]
then
    echo "error: $1 does not exist or is not a directory"
    exit 1
fi

if [ ! -f setup.py ]
then
    echo 'error: missing setup.py. Please type `./autogen.sh && ./configure && make` first.'
    exit 1
fi

if [ ! -d $install_dir/emane-node-view ]
then
    virtualenv \
        --python=$python \
        --system-site-packages \
        $install_dir/emane-node-view

    $install_dir/emane-node-view/bin/pip install --upgrade pip

    $install_dir/emane-node-view/bin/pip install flask flask-socketio
fi

if [ $develop -ne 0 ]
then
    echo "performing develop mode install"
    $install_dir/emane-node-view/bin/pip install -e .
else
    $install_dir/emane-node-view/bin/pip install .
fi
