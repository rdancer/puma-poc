import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '../../../../services/transaction.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { TransactionData } from '../../../../models/Transaction';
import { PaymentWalletModalComponent } from '../payment-wallet/payment-wallet.component';
import { Constants } from '../../../../app.constants';
import { PaymentMetamaskComponent } from '../payment-metamask/payment-metamask.component';

@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.css']
})
export class PurchaseOptionsModalComponent {
  @ViewChild('purchaseOptionModal')
  public purchaseOptionModal: NgbModal;
  @ViewChild('paymentWalletModal')
  public paymentWalletModal: PaymentWalletModalComponent;
  @ViewChild('paymentMetamaskModal')
  public paymentMetamaskModal: PaymentMetamaskComponent;

  @Input()
  public itemPrice: number;
  @Input()
  public itemID: string;
  @Input()
  public packagePrice: string;
  @Input()
  public packageID: string;
  @Input()
  public txDataAsString: string;

  public constructor(private modal: NgbModal) { }

  public open(): void {
    this.modal.open(this.purchaseOptionModal, { centered: true, size: 'lg' });
  }
  // opens wallet modal
  public openPaymentWalletModal(): void {
    this.paymentWalletModal.open();
  }
  // opens metamask modal
  public openPaymentMetamaskModal(): void {
    this.paymentMetamaskModal.open();
  }
}
