import MessageChannel from "./lib/messageChannel";
import Messenger from "./messager";
import EventEmitter from 'eventemitter3';
import { DAppActions } from "./constant";

/**
 * code 4001 The request was rejected by the user
 * code -32602 The parameters were invalid
 * code -32603 Internal error
 */
interface ProviderError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

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
  publicKey: string,
  payload: string,
  signature: string
}

export interface SignMessageArguments {
  message: string
}

export interface VerifyMessageArguments extends SignedData {

}

export interface TransactionArguments extends Transaction {

}

export interface Account {
  address: string;
  publicKey: string;
  didAddress: string;
}

type ConnectListener = (connectInfo: ConnectInfo) => void
type ChainChangedListener = (chainId: string) => void
type AccountsChangedListener = (accounts: Account[]) => void

export interface IHyperProvider {
  request(args: RequestArguments): Promise<unknown>
  isConnected(): boolean
  signTransaction(args: TransactionArguments): Promise<Transaction>
  sendTransaction(args: TransactionArguments): Promise<{ hash: string }>
  signMessage(args: SignMessageArguments): Promise<string>
  verifyMessage(args: VerifyMessageArguments): Promise<boolean>
  requestAccounts(): Promise<Account[]>
  requestNetwork(): Promise<string>

  // Events
  on(eventName: 'connect', listener: ConnectListener): this
  on(eventName: 'disconnect', listener: ConnectListener): this
  on(eventName: 'chainChanged', listener: ChainChangedListener): this
  on(eventName: 'accountsChanged', listener: AccountsChangedListener): this

  removeListener(eventName: 'disconnect', listener: ConnectListener): this
  removeListener(eventName: 'connect', listener: ConnectListener): this
  removeListener(
    eventName: 'chainChanged',
    listener: ChainChangedListener
  ): this
  removeListener(
    eventName: 'accountsChanged',
    listener: AccountsChangedListener
  ): this
}


export default class HyperWeb3Provider extends EventEmitter implements IHyperProvider {
  private readonly channel: MessageChannel;
  private readonly messenger: Messenger;
  public readonly isHyper: boolean = true;
  private connectedFlag: boolean
  constructor(channelKey: string) {
    super();
    this.channel = new MessageChannel(channelKey || 'hyper-inpage');
    this.messenger = new Messenger(this.channel);
    this.initEvents();
  }

  public request({ method, params }: RequestArguments): Promise<any> {
    return this.messenger.send(method, params)
  }

  public isConnected(): boolean {
    return this.connectedFlag;
  }

  public async signTransaction(args: Transaction): Promise<Transaction> {
    return this.request({ method: DAppActions.HYPER_SIGN_TRANSACTION, params: args })
  }

  public async sendTransaction(args: Transaction): Promise<{ hash: string }> {
    return this.request({ method: DAppActions.HYPER_SEND_TRANSACTION, params: args })
  }

  public async signMessage(args: SignMessageArguments): Promise<string> {
    return this.request({ method: DAppActions.HYPER_SIGN_MESSAGE, params: args })
  }

  public async verifyMessage(args: VerifyMessageArguments): Promise<boolean> {
    return this.request({ method: DAppActions.HYPER_VERIFY_MESSAGE, params: args })
  }

  public async requestAccounts(): Promise<Account[]> {
    return this.request({ method: DAppActions.HYPER_REQUEST_ACCOUNTS })
  }

  public async requestNetwork(): Promise< 'RedCave' | 'Unhnown'> {
    return this.request({ method: DAppActions.HYPER_REQUEST_NETWORK })
  }

  private initEvents() {
    this.channel.on('connect', this.onConnect.bind(this))
    this.channel.on('disconnect', this.onDisconnect.bind(this))
    this.channel.on('chainChanged', this.onChainChanged.bind(this))
    this.channel.on('networkChanged', this.onNetworkChanged.bind(this))
    this.channel.on(
      'accountsChanged',
      this.emitAccountsChanged.bind(this)
    )
  }

  private onConnect(): void {
    this.connectedFlag = true
    this.emit('connect')
  }

  private onDisconnect(error: ProviderError): void {
    this.connectedFlag = false
    this.emit('disconnect', error)
  }

  private onChainChanged(chainId: string): void {
    this.emit('chainChanged', chainId)
  }

  private onNetworkChanged(network: string): void {
    this.emit('networkChanged', network)
  }

  private emitAccountsChanged(accounts: string[]): void {
    this.emit('accountsChanged', accounts)
  }
}

