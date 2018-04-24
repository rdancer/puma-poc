import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';

import { Constants } from './app.constants';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';

import { AuthenticationService } from './services/authentication.service';
import { HeaderComponent } from './shared/header/header.component';
import { ItemsService } from './services/items.service';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { PurchaseOptionsModalComponent } from './components/item-details/modal/purchase-options/purchase-options.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ItemsComponent,
    HeaderComponent,
    ItemDetailsComponent,
    PurchaseOptionsModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    Constants,
    AuthenticationService,
    AuthGuard,
    ItemsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
