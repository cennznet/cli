// Copyright 2019 Centrality Investments Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import CryptoJS from 'crypto-js';

// tslint:disable
import './peerjs-polyfill';
import Peer, {DataConnection} from 'peerjs';
// tslint:enable

import {AsyncSubject, ReplaySubject, Subject} from 'rxjs';
import {v4} from 'uuid';

const config: any = {
  iceServers: [
    {urls: 'stun:stun01.sipphone.com'},
    {urls: 'stun:stun.ekiga.net'},
    {urls: 'stun:stun.fwdnet.net'},
    {urls: 'stun:stun.ideasip.com'},
    {urls: 'stun:stun.iptel.org'},
    {urls: 'stun:stun.rixtelecom.se'},
    {urls: 'stun:stun.schlund.de'},
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
    {urls: 'stun:stun2.l.google.com:19302'},
    {urls: 'stun:stun3.l.google.com:19302'},
    {urls: 'stun:stun4.l.google.com:19302'},
    {urls: 'stun:stunserver.org'},
    {urls: 'stun:stun.softjoys.com'},
    {urls: 'stun:stun.voiparound.com'},
    {urls: 'stun:stun.voipbuster.com'},
    {urls: 'stun:stun.voipstunt.com'},
    {urls: 'stun:stun.voxgratia.org'},
    {urls: 'stun:stun.xten.com'},
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      urls: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      urls: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    }
  ]
};

class P2PSession {
  static peers: {[key: string]: P2PSession} = {};

  static getPeer = (peerId: string): P2PSession => {
    const peer = P2PSession.peers[peerId];
    if (!peer) console.error(`Cannot find peer: ${peerId}`);
    return peer;
  }

  static connect = async (
    peerId: string,
    secretKey?: string
  ): Promise<P2PSession> => {
    const peer = new P2PSession(secretKey);
    await peer.connect(peerId);
    P2PSession.peers[peerId] = peer;
    return peer;
  }

  // Session uniq identifier
  uuid = v4();
  // SecretKey used to encrypt data flow. Both connect session
  // should use the same secretKey
  secretKey: string;
  // Id received from peer-server
  peerId$: AsyncSubject<string> = new AsyncSubject();
  // Data connection stream
  connection$: ReplaySubject<Peer.DataConnection> = new ReplaySubject(1);
  connectionClosed$: Subject<Peer.DataConnection> = new Subject();
  // Data stream
  data$ = new ReplaySubject(1);
  // Error stream
  error$ = new Subject();
  peer: Peer;

  constructor(secretKey?: string) {
    // Use provided secretKey or generate a random one.
    this.secretKey = secretKey || CryptoJS.lib.WordArray.random(12).toString();

    this.peer = new Peer({config}) as any;
    this.peer.on('open', id => {
      console.log('open');
      this.peerId$.next(id);
      this.peerId$.complete();
    });
    this.peer.on('connection', (conn: DataConnection) => {
      console.log('connection');
      this.subscribeConnection(conn);
    });
    this.peer.on('close', () => {
      console.log('close');
      return this.error$.next(new Error('Peer closed!'));
    });
    this.peer.on('error', err => {
      console.log('error: ', err);
      return this.error$.next(err);
    });
  }

  subscribeConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connection$.next(conn);
    });

    conn.on('data', data => {
      try {
        const decrypted = CryptoJS.AES.decrypt(data, this.secretKey).toString(
          CryptoJS.enc.Utf8
        );
        const message = JSON.parse(decrypted);
        this.data$.next(message);
      } catch (error) {
        this.error$.next(error);
      }
    });

    conn.on('close', () => {
      this.connectionClosed$.next(conn);
    });

    conn.on('error', error => this.error$.next(error));
  }

  handleConnect(peerId: string): Promise<void> {
    return new Promise(resolve => {
      this.connection$.subscribe(() => resolve());
      const conn = this.peer.connect(peerId, {serialization: 'json'});
      this.subscribeConnection(conn);
    });
  }

  async connect(peerId: string): Promise<void> {
    await this.peerId$.toPromise();
    await this.handleConnect(peerId);
  }

  send(message: object): Promise<void> {
    return new Promise((resolve, reject) => {
      const msg = CryptoJS.AES.encrypt(
        JSON.stringify(message),
        this.secretKey
      ).toString();
      this.connection$.subscribe(conn => {
        conn.send(msg);
        resolve();
      }, reject);
    });
  }

  destroy() {
    this.peer.destroy();
  }
}

export default P2PSession;
