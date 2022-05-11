import EventEmitter from 'eventemitter3';
interface ConnectInfo {
    chainId: string;
}
interface RequestArguments {
    method: string;
    params?: unknown[] | object;
}
export interface SendPaymentArguments {
    to: string;
    amount: number;
    memo?: string;
}
export interface SendStakeDelegationArguments {
    to: string;
    memo?: string;
}
interface SignedData {
    publicKey: string;
    payload: string;
    signature: {
        field: string;
        scalar: string;
    };
}
export interface SignMessageArguments {
    message: string;
}
export interface VerifyMessageArguments extends SignedData {
}
declare type ConnectListener = (connectInfo: ConnectInfo) => void;
declare type ChainChangedListener = (chainId: string) => void;
declare type AccountsChangedListener = (accounts: string[]) => void;
export interface IMinaProvider {
    request(args: RequestArguments): Promise<unknown>;
    isConnected(): boolean;
    sendPayment(args: SendPaymentArguments): Promise<{
        hash: string;
    }>;
    sendStakeDelegation(args: SendStakeDelegationArguments): Promise<{
        hash: string;
    }>;
    signMessage(args: SignMessageArguments): Promise<SignedData>;
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
export default class HyperWeb3Provider extends EventEmitter implements IMinaProvider {
    private readonly channel;
    private readonly messenger;
    readonly isHyper: boolean;
    private connectedFlag;
    constructor(channelKey: string);
    request({ method, params }: RequestArguments): Promise<any>;
    isConnected(): boolean;
    sendPayment(args: SendPaymentArguments): Promise<{
        hash: string;
    }>;
    sendStakeDelegation(args: SendStakeDelegationArguments): Promise<{
        hash: string;
    }>;
    signMessage(args: SignMessageArguments): Promise<SignedData>;
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
