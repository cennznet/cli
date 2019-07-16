import fetch from 'node-fetch';
// @ts-ignore
import wrtc from 'wrtc';
import WebSocket from 'ws';

(global as any).fetch = fetch;
(global as any).WebSocket = WebSocket;

(global as any).window = {};
(global as any).window.RTCPeerConnection = wrtc.RTCPeerConnection;
(global as any).window.RTCSessionDescription = wrtc.RTCSessionDescription;
(global as any).window.RTCIceCandidate = wrtc.RTCIceCandidate;
