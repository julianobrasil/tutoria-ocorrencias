import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AuthModule} from './auth/auth.module';
import {AuthGuardModule} from './auth/guards/auth-guard.module';
import {CustomMaterialModule} from './custom-material.module';
import {ServicosSingletonModule} from './model/servicos/servicos-singleton.module';
import {ServicosModule} from './model/servicos/servicos.module';

import {AppComponent} from './app.component';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CustomMaterialModule,
    HttpClientModule,
    AuthModule.forRoot(),
    AuthGuardModule.forRoot(),
    ServicosModule,
    ServicosSingletonModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
