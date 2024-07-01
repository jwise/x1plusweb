import WebSocketAsPromised from 'websocket-as-promised';

class PrinterConnection extends EventTarget {
    connected: boolean = false;
    wsp: WebSocketAsPromised | undefined;
    host: string | undefined;
    _event(name: string, params: any) {
        const event = new Event(name);
        Object.assign(event, params);
        this.dispatchEvent(event);
    }
    
    async rpc(method: string, params: Object) {
        const resp = await this.wsp!.sendRequest({"jsonrpc": "2.0", "method": method, "params": params});
        if (resp.error) {
            throw resp.error;
        }
        return resp.result;
    }

    async connect(ip: string, password: string) {
        if (this.connected) {
            await this.disconnect();
        }
        /* ws://${location.host}/ws */
        const wsPath = `ws://${ip}/ws`;
        console.log(`PrinterConnection: WebSocket path ${wsPath}`);
        this.wsp = new WebSocketAsPromised(wsPath, {
            packMessage: data => JSON.stringify(data),
            unpackMessage: data => JSON.parse(data as string),
            attachRequestId: (data, requestId) => Object.assign({id: requestId}, data),
            extractRequestId: data => data && data.id,
        });

        console.log("PrinterConnection: connecting to WebSocket");
        this._event('connectingProgress', { 'progress': 'Connecting to WebSocket' });
        this.wsp.onError.addListener(() => { this.disconnect() });
        this.wsp.onClose.addListener(() => { this.disconnect() });
        try {
            await this.wsp.open();
        } catch (e) {
            console.log(`PrinterConnection: ${e}`);
            throw e; 
        }
        console.log("PrinterConnection: waiting for hello");
        await this.wsp.waitUnpackedMessage(data => data.method == 'hello' );
        
        console.log("PrinterConnection: authenticating");
        this._event('connectingProgress', { 'progress': 'Authenticating' });
        try {
            await this.rpc("auth", {"password": password});
        } catch (e) {
            console.log(`PrinterConnection: authentication failed: ${e}`);
            this._event('connectionFailed', { 'error': e });
            await this.wsp.close();
            this.wsp = undefined;
            return;
        }
        this.connected = true;
        this.host = ip;
        console.log('PrinterConnection: connected');
        this._event('connected', {});
    }
    
    async disconnect() {
        if (!this.connected) {
            return;
        }
        if (this.wsp) {
            await this.wsp.close();
            this.wsp.removeAllListeners();
            this.wsp = undefined;
        }
        this.connected = false;
        this.dispatchEvent(new Event('disconnected'));
    }
}

const printerConnection = new PrinterConnection();

export default printerConnection;
