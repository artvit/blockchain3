/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MedicalCertificateService } from './MedicalCertificate.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-medicalcertificate',
  templateUrl: './MedicalCertificate.component.html',
  styleUrls: ['./MedicalCertificate.component.css'],
  providers: [MedicalCertificateService]
})
export class MedicalCertificateComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  certificateId = new FormControl('', Validators.required);
  createdAt = new FormControl('', Validators.required);
  diagnosis = new FormControl('', Validators.required);
  issuer = new FormControl('', Validators.required);
  recipient = new FormControl('', Validators.required);

  constructor(public serviceMedicalCertificate: MedicalCertificateService, fb: FormBuilder) {
    this.myForm = fb.group({
      certificateId: this.certificateId,
      createdAt: this.createdAt,
      diagnosis: this.diagnosis,
      issuer: this.issuer,
      recipient: this.recipient
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceMedicalCertificate.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'by.bsuir.medcert.MedicalCertificate',
      'certificateId': this.certificateId.value,
      'createdAt': this.createdAt.value,
      'diagnosis': this.diagnosis.value,
      'issuer': this.issuer.value,
      'recipient': this.recipient.value
    };

    this.myForm.setValue({
      'certificateId': null,
      'createdAt': null,
      'diagnosis': null,
      'issuer': null,
      'recipient': null
    });

    return this.serviceMedicalCertificate.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'certificateId': null,
        'createdAt': null,
        'diagnosis': null,
        'issuer': null,
        'recipient': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'by.bsuir.medcert.MedicalCertificate',
      'createdAt': this.createdAt.value,
      'diagnosis': this.diagnosis.value,
      'issuer': this.issuer.value,
      'recipient': this.recipient.value
    };

    return this.serviceMedicalCertificate.updateAsset(form.get('certificateId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceMedicalCertificate.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceMedicalCertificate.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'certificateId': null,
        'createdAt': null,
        'diagnosis': null,
        'issuer': null,
        'recipient': null
      };

      if (result.certificateId) {
        formObject.certificateId = result.certificateId;
      } else {
        formObject.certificateId = null;
      }

      if (result.createdAt) {
        formObject.createdAt = result.createdAt;
      } else {
        formObject.createdAt = null;
      }

      if (result.diagnosis) {
        formObject.diagnosis = result.diagnosis;
      } else {
        formObject.diagnosis = null;
      }

      if (result.issuer) {
        formObject.issuer = result.issuer;
      } else {
        formObject.issuer = null;
      }

      if (result.recipient) {
        formObject.recipient = result.recipient;
      } else {
        formObject.recipient = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'certificateId': null,
      'createdAt': null,
      'diagnosis': null,
      'issuer': null,
      'recipient': null
      });
  }

}
