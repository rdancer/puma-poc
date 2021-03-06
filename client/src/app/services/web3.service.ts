import * as W3 from 'web3';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import * as Eth from 'ethjs-query';
import * as EthContract from 'ethjs-contract';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
declare var require: any;
const Web3 = require('web3'); // tslint:disable-line

declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  public hasMetaMask: boolean = false;
  private token: any;
  private eth: any;

  public constructor(@Optional() @SkipSelf() prior: Web3Service) {
    if (prior) { return prior; }

    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3(): void {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
      this.hasMetaMask = true;

      this.eth = new Eth(this.web3.currentProvider);
      const contract = new EthContract(this.eth);
      // create the abi
      const abi = [{
        'constant': false,
        'inputs': [
          {
            'name': '_to',
            'type': 'address'
          },
          {
            'name': '_value',
            'type': 'uint256'
          }
        ],
        'name': 'transfer',
        'outputs': [
          {
            'name': 'success',
            'type': 'bool'
          }
        ],
        'payable': false,
        'type': 'function'
      }];
      // transfer the ERC20 token value to a specific address
      const ERC20Transfer = contract(abi);
      this.token = ERC20Transfer.at('0x11c1e537801cc1c37ad6e1b7d0bdc0e00fcc6dc1');
    }
  }

  public sentTransaction(to: string, value: string): Observable<any> {
    // return an error if metamask does not exist
    if (!this.hasMetaMask) {
      throw Error('No MetaMask');
    }

    // transfer the token to the selected address
    return Observable.fromPromise(this.token.transfer(to, value,
      { from: this.web3.currentProvider.publicConfigStore.getState().selectedAddress }));
  }

  public getTransactionStatus(txhash: string): Observable<any> {
    // wait 5 secs and return the transaction hash using getTransactionReceipt
    return Observable.timer(0, 5000).switchMap((i) => {
      return Observable.fromPromise(this.eth.getTransactionReceipt(txhash));
    });
  }
}


