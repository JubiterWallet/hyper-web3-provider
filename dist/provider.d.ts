import EventEmitter from 'eventemitter3';
interface ConnectInfo {
    chainId: string;
}
interface RequestArguments {
    method: string;
    params?: unknown[] | object;
}
export interface Transaction {
    from: string;
    to: string;
    hash?: string;
    type?: string;
    timestamp?: number;
    value?: number;
    payload?: string;
    opCode?: number;
    simulate?: boolean;
    contractName?: string;
    extra?: string;
    extraIdInt64?: Array<number>;
    extraIdLong?: Array<number>;
    extraIdString?: Array<string>;
    hex?: string;
    signature?: string;
}
interface SignedData {
    publicKey: string;
    payload: string;
    signature: string;
}
export interface SignMessageArguments {
    message: string;
}
export interface VerifyMessageArguments extends SignedData {
}
export interface TransactionArguments extends Transaction {
}
declare type ConnectListener = (connectInfo: ConnectInfo) => void;
declare type ChainChangedListener = (chainId: string) => void;
declare type AccountsChangedListener = (accounts: string[]) => void;
export interface IHyperProvider {
    request(args: RequestArguments): Promise<unknown>;
    isConnected(): boolean;
    signTransaction(args: TransactionArguments): Promise<Transaction>;
    sendTransaction(args: TransactionArguments): Promise<{
        hash: string;
    }>;
    signMessage(args: SignMessageArguments): Promise<string>;
    verifyMessage(args: VerifyMessageArguments): Promise<boolean>;
    requestAccounts(): Promise<string[]>;
    requestNetwork(): Promise<string>;
    on(eventName: 'connect', listener: ConnectListener): this;
    on(eventName: 'disconnect', listener: ConnectListener): this;
    on(eventName: 'chainChanged', listener: ChainChangedListener): this;
    on(eventName: 'accountsChanged', listener: AccountsChangedListener): this;
    removeListener(eventName: 'disconnect', listener: ConnectListener): this;
    removeListener(eventName: 'connect', listener: ConnectListener): this;
    removeListener(eventName: 'chainChanged', listener: ChainChangedListener): this;
    removeListener(eventName: 'accountsChanged', listener: AccountsChangedListener): this;
}
export default class HyperWeb3Provider extends EventEmitter implements IHyperProvider {
    private readonly channel;
    private readonly messenger;
    readonly isHyper: boolean;
    private connectedFlag;
    constructor(channelKey: string);
    request({ method, params }: RequestArguments): Promise<any>;
    isConnected(): boolean;
    signTransaction(args: Transaction): Promise<Transaction>;
    sendTransaction(args: Transaction): Promise<{
        hash: string;
    }>;
    signMessage(args: SignMessageArguments): Promise<string>;
    verifyMessage(args: VerifyMessageArguments): Promise<boolean>;
    requestAccounts(): Promise<string[]>;
    requestNetwork(): Promise<'Mainnet' | 'Devnet' | 'Unhnown'>;
    private initEvents;
    private onConnect;
    private onDisconnect;
    private onChainChanged;
    private onNetworkChanged;
    private emitAccountsChanged;
}
export {};
