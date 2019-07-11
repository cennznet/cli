const wrtc = require('wrtc');
const fetch = require('node-fetch');
const WebSocket = require('ws');

global.fetch = fetch;
global.WebSocket = WebSocket;

global.window = {};
global.window.RTCPeerConnection = wrtc.RTCPeerConnection;
global.window.RTCSessionDescription = wrtc.RTCSessionDescription;
global.window.RTCIceCandidate = wrtc.RTCIceCandidate;
