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

'use strict';

/**
 * Track the trade of a commodity from one trader to another
 * @param {by.bsuir.medcert.AddMedicalCertificate} tx - the trade to be processed
 * @transaction
 */
async function emitMedicalCertificate(tx) {
    const patientRegistry = await getParticipantRegistry('by.bsuir.medcert.Patient');
    const mcRegistry = await getAssetRegistry('by.bsuir.medcert.MedicalCertificate');

    const diagnosis = tx.diagnosis;
    const patient = tx.recipient;
    if (!patient.diagnoses) {
        patient.diagnoses = [];
    }
    if (!patient.diagnoses.some(d => d.diagnosisId === diagnosis.diagnosisId)) {
        patient.diagnoses.push(diagnosis);
    }
    await patientRegistry.update(patient);

    let mc = getFactory().newResource('by.bsuir.medcert', 'MedicalCertificate', tx.transactionId);
    mc.createdAt = tx.timestamp;
    mc.diagnosis = tx.diagnosis;
    mc.issuer = tx.issuer;
    mc.recipient = tx.recipient;

    await mcRegistry.add(mc);
}
