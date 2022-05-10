import EventEmitter from 'eventemitter3';

export default class MessageChannel extends EventEmitter {
    _channelKey: string;
    constructor(channelKey: string) {
        super();

        if(!channelKey)
            throw 'No channel scope provided';

        this._channelKey = channelKey;
        this._registerEventListener();
    }

    _registerEventListener() {
        window.addEventListener('message', ({ data: { isHyper = false, message, source } }) => {
            if(!isHyper || (!message && !source))
                return;

            if(source === this._channelKey)
                return;

            const {
                action,
                data
            } = message;

            this.emit(action, data);
        });
    }

    send(action:string, data = {}) {
        if(!action)
            return { success: false, error: 'Function requires action {string} parameter' };

        window.postMessage({
            message: {
                action,
                data
            },
            source: this._channelKey,
            isHyper: true
        }, '*');
    }
}

