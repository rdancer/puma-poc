import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Item } from '../../models/Item';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { Subscription } from 'rxjs/Subscription';
import { PurchaseOptionsModalComponent } from '../../components/item-details/modals/purchase-options/purchase-options.component';

@Component({
  selector: `app-item-details`,
  templateUrl: `./item-details.component.html`,
  styleUrls: [`./item-details.component.css`]
})
export class ItemDetailsComponent implements OnInit {
  public item: Item = <Item>{};
  private routerSubscription: Subscription;
  @ViewChild('purchaseOptionModal')
  public purchaseOptionsModal: PurchaseOptionsModalComponent;
  // @Input() showWarning: boolean;
  // completedStatus: number = 0;

  public constructor(
    private router: ActivatedRoute,
    private itemService: ItemsService
  ) {
    // this.showWarning = true;
  }

  public ngOnInit(): void {
    this.routerSubscription = this.router.params.subscribe(params => {
      const itemID = params['itemID'];

      this.itemService
        .getItemByID(itemID)
        .subscribe((response: HttpResponse) => {
          this.item = response.data[0];
          this.item.uploadedDate = this.item.uploadedDate * 1000;
        });
    });
  }

  // onPurchaseStatusUpdate(completedStatus) {
  //   this.completedStatus = completedStatus;
  // }

  // public closeButton() {
  //   this.showWarning = false;
  // }

  public openPurchaseOptionsModal() {
    this.purchaseOptionsModal.open();
  }
}
