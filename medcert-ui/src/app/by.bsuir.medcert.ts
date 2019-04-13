import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace by.bsuir.medcert{
   export class Patient extends Participant {
      patientId: string;
      firstName: string;
      lastName: string;
      diagnoses: Diagnosis[];
   }
   export class Doctor extends Participant {
      doctorId: string;
      firstName: string;
      lastName: string;
      speciality: string;
   }
   export class Diagnosis extends Asset {
      diagnosisId: string;
      name: string;
   }
   export class MedicalCertificate extends Asset {
      certificateId: string;
      createdAt: Date;
      diagnosis: Diagnosis;
      issuer: Doctor;
      recipient: Patient;
   }
   export class AddMedicalCertificate extends Transaction {
      diagnosis: Diagnosis;
      issuer: Doctor;
      recipient: Patient;
   }
// }
