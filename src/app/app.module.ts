import { ConsultarCepService } from './services/consultar-cep.service';
import { DropdownService } from './services/dropdown.service';
import { DataFormModule } from './data-form/data-form.module';
import { TemplateFormModule } from './template-form/template-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { BaseFormComponent } from './base-form/base-form.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    TemplateFormModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataFormModule,
    MatSnackBarModule,
    BrowserAnimationsModule
  ],
  providers:[],
  bootstrap: [AppComponent]
})
export class AppModule { }
