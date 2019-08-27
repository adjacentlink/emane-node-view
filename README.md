emane-node-view
==

The emane-node-view project is a Python [Flask][1] web app that
publishes [EMANE][2] node location and link information using [Flask
SocketIO][3] and [Leaflet][4].

![emane node view](images/emane-node-view.png)

The `emane-node-view-publisher` service subscribes to
[OpenTestPoint][5] measurement probes to determine node location and
optionally, link connectivity. Link connectivity is determined by
processing OpenTestPoint measurements using embedded Python algorithms
specified via XML.

[1]: https://palletsprojects.com/p/flask/
[2]: https://github.com/adjacentlink/emane
[3]: https://github.com/miguelgrinberg/Flask-SocketIO
[4]: https://leafletjs.com
[5]: https://github.com/adjacentlink/opentestpoint

Currently Flask SocketIO and some of its dependencies are not
available in all distribution repositories. The recommended approach
is to install emane-node-view using a Python virtualenv. An
installation script that satisfies most use cases is provided
(`install-virtualenv.sh`).

The follow EMANE and OpenTestPoint packages are required:

1. [opentestpoint][5]
2. [opentestpoint-probe-emane][10]
3. Other probes referenced in link detection algorithms.

[10]: https://github.com/adjacentlink/opentestpoint-probe-emane

# Installation Instructions

Node Package Manager (npm) is used to manage JavaScript
dependencies. [Browserify][6] is used to bundle all dependencies into
a single JavaScript file.

[6]: http://browserify.org/

## Install the latest stable Node LTS

1. Installing NODE LTS 10.x

    On Fedora/CentOS:

    ```
    $ curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -
    sudo dnf install nodejs
    ```

    On Ubuntu:

    ```
    $ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    $ sudo apt-get install nodejs
    ```

2. Install Browerify globally

    ```
    $ sudo npm install browserify -g
    ```

## Install emane-node-view in a virtualenv

Create a Python virtualenv with flask, flask-socketio and
emane-node-view installed. The virtualenv is created with
`--system-site-packages` to allow access to EMANE and OpenTestPoint
plugins that have been [installed][7] via your system package manager.

[7]: https://github.com/adjacentlink/emane/wiki/Install

For most use cases this will be what you want. More complex system
installs are possible, use `install-virtualenv.sh` as a guide.

The following creates a virtual environment emane-node-view in your
chosen install path:

```
$ ./autogen.sh && ./configure && make
$ sudo ./install-virtualenv.sh  /install/path
```

# Running `emane-node-view-publisher`

emane-node-view consists of the Python module `emane_node_view` and the
`emane-node-view-publisher` application.

To execute with default options:

```
$ /install/path/emane-node-view/bin/emane-node-view-publisher config.xml
```

See `emane-node-view-publisher -h` for more information.

To view the Leaflet web front end, point your browser of choice at
*your_host:5000*.

# Configuring `emane-node-view-publisher`

The following XML can be used to visualize node locations and links
for EMANE Tutorial demonstration [3][8].

[8]: https://github.com/adjacentlink/emane-tutorial/wiki/Demonstration-3

The top level `endpoint` attribute corresponds to the OpenTestPoint
broker publish endpoint to connect for subscriptions.

For each node specify:

1. `nem-id`: NEM id of the node.

2. `color`: Color to display the node. (optional)

3. `label`: Name of the node to display.

4. `tag`: The OpenTestPoint tag corresponding the node.

5. `link-color`: Color to display node links. (optional)

6. `link-detection`: The name of the link detection algorithm to
    use. (optional)

A node can proxy report the location of other nodes. This is useful to
position nodes that are not running OpenTestPoint or that only exist
for generating interference (see [emane-jammer-simple][9]). No links
are reported for proxy nodes.

[9]: https://github.com/adjacentlink/emane-jammer-simple

```xml
<emane-node-view-publisher endpoint='localhost:9002'>
  <nodes>
    <node nem-id='1'
          color='blue'
          label='Radio 1'
          tag='node-1'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='2'
          color='blue'
          label='Radio 2'
          tag='node-2'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='3'
          color='blue'
          label='Radio 3'
          tag='node-3'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='4'
          color='blue'
          label='Radio 4'
          tag='node-4'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='5'
          color='blue'
          label='Radio 5'
          tag='node-5'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='6'
          color='blue'
          label='Radio 6'
          tag='node-6'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='7'
          color='blue'
          label='Radio 7'
          tag='node-7'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='8'
          color='blue'
          label='Radio 8'
          tag='node-8'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='9'
          color='blue'
          label='Radio 9'
          tag='node-9'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'/>
    <node nem-id='10'
          color='blue'
          label='Radio 10'
          tag='node-10'
          link-color='green'
          link-detection='IEEE80211abg-NeighborMetricTable'>
      <proxy>
        <node nem-id='300' color='white' label='Ghost 300'/>
      </proxy>
    </node>
  </nodes>
  <link-detection>
    <algorithm name='IEEE80211abg-NeighborMetricTable'
               probe='EMANE.IEEE80211abg.Tables.Neighbor'
               measurement='Measurement_emane_ieee80211abg_tables_neighbor'>
      <python>
        <![CDATA[
import time
from otestpoint.emane.ieee80211abg_pb2 import Measurement_emane_ieee80211abg_tables_neighbor

measurement = Measurement_emane_ieee80211abg_tables_neighbor()

measurement.ParseFromString(_blob)

# 0: NEM          7: SINR Avg
# 1: Rx Pkts      8: SINR Stdv
# 2: Tx Pkts      9: NF Avg
# 3: Missed Pkts 10: NF Stdv
# 4: BW Util     11: Rx Rate Avg
# 5: Last Rx     12: Tx Rate Avg
# 6: Last Tx     

if _cookie == None:
    _cookie = {}

for row in measurement.neighbormetrictable.rows:
    remote_id = row.values[0].uValue
    last_rx =  row.values[5].dValue
    _cookie[remote_id] = last_rx

now = time.time()
    
for remote_id,last_rx in _cookie.items():
    if remote_id != 65535:
        if now - last_rx <= 5:
            _links.append(remote_id)
        ]]>
      </python>
    </algorithm>
  </link-detection>
</emane-node-view-publisher>
```

Link detection algorithms are Python code that is loaded and executed
by `emane-node-view-publisher`. You must specify a unique algorithm
`name`, the OpenTestPoint measurement `probe` to subscribe, and the
`measurement` within the probe to process.

Three special local variables are used to communicate information to
and from link detection code:

1. `_blob`: Serialized OpenTestPoint measurement specified with the
   `measurement` attribute. (in)

2. `_cookie`: A variable that is passed to the link detection code to
   store any state information. Each instance of the link detection
   algorithm has a unique `_cookie`. (in/out)

3. `_links`: A list of NEM ids that represent the links seen by the
   node. (out)

For the simple link detection algorithm shown, a node is considered to
have a link to a remote node if that node has received an over-the-air
message from the remote node in the last 5 seconds.

For heterogeneous experiments, you will need to define link detection
algorithms for each radio model since the models have different
probes.
