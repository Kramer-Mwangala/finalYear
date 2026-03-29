# NSC-AI ASSISTANT — Nairobi Skin Centre
## User Manual: AI-Powered Dermatologist Booking Platform

| Field | Details |
|---|---|
| Document | NSC-AI Assistant User Manual |
| Supervisor | Dr. Ernest Madara |
| Prepared by | Mwangala Kramer |
| ADM. No | 22/07021 |
| Date | March 2026 |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements & Getting Started](#2-system-requirements--getting-started)
3. [Patient Registration & Login](#3-patient-registration--login)
4. [Booking an Appointment](#4-booking-an-appointment)
5. [AI Image Diagnosis & Severity Scoring](#5-ai-image-diagnosis--severity-scoring)
6. [M-Pesa Payment](#6-m-pesa-payment)
7. [SMS Appointment Reminders](#7-sms-appointment-reminders)
8. [Dermatologist Dashboard](#8-dermatologist-dashboard)
9. [Patient Records & Progress Tracking](#9-patient-records--progress-tracking)
10. [Admin Dashboard](#10-admin-dashboard)
11. [Pharmacy Module](#11-pharmacy-module)
12. [IT Support & System Administration](#12-it-support--system-administration)
13. [Troubleshooting](#13-troubleshooting)
14. [Frequently Asked Questions (FAQ)](#14-frequently-asked-questions-faq)
15. [Glossary of Terms](#15-glossary-of-terms)
16. [Contact & Support](#16-contact--support)

---

## Disclaimer

This User Manual has been prepared for the NSC-AI Assistant platform developed as a Final Year Project by Mwangala Kramer (Student ID: 22/07021) at KCA University. The platform is intended to support dermatology appointment booking, AI-powered skin condition severity assessment, M-Pesa payment processing, and automated SMS reminders at Nairobi Skin Centre.

> **NOTE:** The AI severity scoring system (scale 1–10) is a clinical decision-support tool only. It does not replace a qualified dermatologist's professional diagnosis. Always consult a licensed dermatologist for medical advice.

> **NOTE:** All M-Pesa transactions are processed through Safaricom's Daraja API. Ensure you have sufficient M-Pesa balance before initiating any payment.

---

## 1. Introduction

### 1.1 About the NSC-AI Assistant

The NSC-AI Assistant is a comprehensive AI-powered dermatologist booking platform built for Nairobi Skin Centre (NSC). It brings together six core capabilities into one seamless digital experience:

| Feature | Description |
|---|---|
| Voice AI Booking | Book dermatologist appointments hands-free using a voice AI agent |
| AI Image Diagnosis | Upload a photo of your skin condition and receive an AI severity score from 1 (mild) to 10 (urgent) |
| Urgent Slot System | Patients scored 8–10 are automatically placed into one of 2 reserved urgent care slots per day |
| M-Pesa Payments | Pay for bookings and prescriptions securely via M-Pesa STK Push (Daraja API) |
| SMS Reminders | Automated reminder SMS sent 48 hours before every scheduled appointment via Africa's Talking API |
| Web Portal | Full booking, records, and payment management available via the Next.js web application |

### 1.2 Who This Manual Is For

| User Type | Role | Sections to Focus On |
|---|---|---|
| Patient | Books appointments, uploads images, pays via M-Pesa, receives SMS reminders | Sections 3, 4, 5, 6, 7 |
| Dermatologist | Views AI severity scores, manages urgent and routine slots, accesses patient records | Sections 8, 9 |
| Admin Staff | Manages booking calendar, reconciles payments, runs reports | Sections 10, 11 |
| IT Support | Monitors system, manages APIs, handles escalations | Section 12 |

### 1.3 How to Use This Manual

This manual is structured around tasks. Each section opens with an overview of what the feature does, followed by numbered step-by-step instructions. Tips, warnings, and notes appear in coloured boxes. A Glossary of Terms and an FAQ are included at the end.

---

## 2. System Requirements & Getting Started

### 2.1 Minimum System Requirements

| Requirement | Details |
|---|---|
| Web Browser | Chrome 110+, Firefox 110+, Safari 16+, Edge 110+ (JavaScript must be enabled) |
| Internet | Stable internet connection (minimum 1 Mbps recommended) |
| Mobile | Android 9.0+ or iOS 14+ for mobile access |
| M-Pesa | Active Safaricom M-Pesa account registered to your Kenyan phone number |
| Microphone | Required for Voice AI booking feature |
| Camera / File Upload | Required for AI image analysis feature |

### 2.2 Accessing the Platform

The NSC-AI Assistant is accessible via a web browser. No installation is required.

1. Open your web browser and navigate to the NSC-AI Assistant web portal URL provided by Nairobi Skin Centre.
2. The platform home page loads with options to **Log In**, **Register**, or continue as a **Guest** (limited features only).
3. For full access — including booking, payment, and AI diagnosis — you must create a patient account (see Section 3).

### 2.3 Supported Languages

The platform currently supports **English**. Swahili language support is planned for a future release.

---

## 3. Patient Registration & Login

### 3.1 Creating a New Patient Account

New patients must register before booking an appointment or using the AI diagnosis feature.

1. On the Home page, click **Register**.
2. Enter your **Full Name**, **Email Address**, **Mobile Number** (e.g. +254 XX XXX XXX), and a **Password** (minimum 8 characters, including one uppercase letter and one number).
3. Re-enter your password in the **Confirm Password** field.
4. Read and accept the Terms of Service and Privacy Policy by checking the checkbox.
5. Click **Create Account**.
6. A verification SMS is sent to your registered mobile number. Enter the OTP (One-Time Password) on the verification screen.
7. Your account is now active. You will be redirected to your **Patient Dashboard**.

> **TIP:** Use the same phone number that is registered with your M-Pesa account to ensure seamless payment processing.

### 3.2 Logging In

1. Click **Log In** on the Home page.
2. Enter your registered **Email Address** and **Password**.
3. Click **Sign In**.
4. If you have forgotten your password, click **Forgot Password**, enter your email, and follow the reset link sent to your inbox.

### 3.3 Updating Your Profile

Keep your profile up to date so that dermatologists have accurate information before your consultation.

1. From your Patient Dashboard, click **My Profile** in the left navigation panel.
2. You may update: Full Name, Date of Birth, Gender, Alternative Phone Number, Allergies & Current Medications, and Emergency Contact.
3. Click **Save Changes** when done.

---

## 4. Booking an Appointment

The NSC-AI Assistant offers two ways to book a dermatologist appointment: the standard web booking form and the Voice AI booking agent. Both methods create the same confirmed booking in the system.

### 4.1 Standard Web Booking

1. From your Patient Dashboard, click **Book Appointment**.
2. The **Dermatologist Availability Calendar** loads showing available slots in green and unavailable slots in grey.
3. Select your preferred date by clicking on a green day.
4. Available time slots for that day appear. Click your preferred time.
5. Select the **Consultation Type**: In-Person or Follow-Up.
6. Optionally, add a brief reason for visit in the **Notes** field (e.g. 'Rash on left arm for 2 weeks').
7. Review the booking summary and click **Confirm Booking**.
8. You will be taken to the Payment screen (see Section 6 for M-Pesa payment steps).
9. Once payment is confirmed, your booking is finalised and a confirmation SMS is sent to your registered mobile number.

> **NOTE:** Urgent slots (for AI severity scores 8–10) are reserved and cannot be manually selected. They are assigned automatically by the system after your AI diagnosis result (see Section 5).

### 4.2 Voice AI Booking

The Voice AI agent allows you to book an appointment entirely by speaking — useful when you are unable to type or prefer a conversational experience.

1. From the Home page or Dashboard, click the microphone icon labelled **Talk to Book**.
2. Ensure your browser has permission to use your microphone. Click **Allow** if prompted.
3. The Voice AI Agent greets you: *"Welcome to Nairobi Skin Centre. How can I help you today?"*
4. Say: *"I would like to book an appointment."*
5. The agent will ask for your preferred date. Say, for example: *"Next Tuesday afternoon."*
6. The agent confirms availability and suggests a time slot. Confirm by saying **"Yes"** or request a different time.
7. The agent asks for your name and registered phone number to retrieve your patient record.
8. The agent reads back the booking summary. Say **"Confirm"** to proceed to payment.
9. An M-Pesa STK Push is sent to your phone. Complete the payment (see Section 6).
10. The agent confirms: *"Your appointment has been booked. A confirmation SMS has been sent to your number."*

> **TIP:** Speak clearly and at a normal pace. If the agent does not understand, it will ask you to repeat. You can say "Repeat that" at any time to hear the agent's last message again.

> **TIP:** If the Voice AI agent is unavailable or cannot complete your booking after two attempts, you will be offered the option to be connected to the clinic's front desk staff.

### 4.3 Managing Your Bookings

All your past and upcoming appointments are available under **My Appointments** on your Patient Dashboard.

| Action | How to Perform It |
|---|---|
| View upcoming appointments | Click **My Appointments** on the Dashboard |
| Reschedule | Click **Reschedule** next to the booking — available up to 24 hours before the appointment |
| Cancel | Click **Cancel** next to the booking — available up to 24 hours before (cancellation policy applies) |
| View past appointments | Toggle the filter to **Past** on the My Appointments screen |
| Download appointment receipt | Click the **Download** icon next to any confirmed booking |

---

## 5. AI Image Diagnosis & Severity Scoring

### 5.1 Overview

The AI Diagnosis feature allows you to upload a clear photograph of your skin condition before or during the booking process. The AI model analyses the image and returns a severity score from 1 to 10 to help determine the urgency of your care.

> **IMPORTANT:** This AI assessment is a preliminary triage tool to help prioritise care. It is not a medical diagnosis. A qualified dermatologist at Nairobi Skin Centre will review all cases and make the final clinical judgement.

### 5.2 Understanding the Severity Scale

| Score | Severity | Action |
|---|---|---|
| 1 – 3 | Low 🟢 | Routine — book next available slot |
| 4 – 5 | Moderate 🟡 | Soon — book within 1 week |
| 6 – 7 | Elevated 🟠 | Priority — book within 48 hours |
| 8 – 10 | Urgent 🔴 | Urgent — reserved daily slot assigned immediately |

> **NOTE:** Two urgent care slots are reserved every day. If you receive a score of 8–10, the system will automatically offer you one of these slots, regardless of the general booking queue.

### 5.3 How to Upload Your Skin Image

1. From your Patient Dashboard, click **AI Diagnosis** or select **Upload Image** during the booking flow.
2. Click **Choose File** or drag and drop your image into the upload area.
3. Accepted formats: **JPG, PNG, HEIC**. Maximum file size: **10 MB**.
4. Ensure the image is: clear and in focus, taken in good lighting (natural light preferred), showing only the affected skin area, and not filtered or edited.
5. Click **Analyse Image**.
6. The AI model processes your image (this typically takes 5–15 seconds).
7. Your **Severity Score** (1–10) is displayed with a colour-coded indicator and a brief explanation.
8. If your score is **8–10**, a prompt appears: *"Your condition appears urgent. Would you like to book an urgent care slot?"* Click **Yes** to proceed — an urgent slot will be reserved for you automatically.
9. If your score is **1–7**, proceed to standard booking (Section 4.1) or voice booking (Section 4.2).

### 5.4 Viewing Your Diagnosis History

All uploaded images and their AI results are stored securely in your patient record. You and your dermatologist can review the progression of your condition over time.

1. From your Patient Dashboard, click **My Diagnosis History**.
2. A chronological list of all your previous uploads appears, each showing the date, image thumbnail, and severity score.
3. Click on any entry to view the full result and AI notes.

---

## 6. M-Pesa Payment

### 6.1 Overview

All payments on the NSC-AI Assistant — including consultation booking fees and prescription payments — are processed through M-Pesa using the Safaricom Daraja API. You do not need to enter card details. The payment request is sent directly to your phone as an M-Pesa prompt.

### 6.2 Paying for a Booking

1. After confirming your appointment details, the **Payment Summary** screen appears showing the consultation fee breakdown.
2. Your registered mobile number is pre-filled in the **M-Pesa Phone Number** field. Edit it if needed.
3. Click **Pay Now with M-Pesa**.
4. Within seconds, an **M-Pesa STK Push** notification appears on your phone screen.
5. On your phone, enter your **M-Pesa PIN** and press **OK**.
6. The platform detects the payment confirmation (usually within 10–20 seconds).
7. A green success banner appears: *"Payment Successful. Your booking is confirmed."*
8. A payment receipt SMS is automatically sent to your registered number.
9. Your appointment appears under **My Appointments** as **Confirmed**.

> **TIP:** Keep the browser tab open while waiting for the M-Pesa prompt. Do not close or refresh the page during the payment process.

### 6.3 Paying for a Prescription

1. When your dermatologist issues a prescription, you will receive an SMS notification and an in-app alert under **My Prescriptions**.
2. Click **View & Pay** next to the prescription.
3. Review the medication list and total amount.
4. Click **Pay via M-Pesa**.
5. Complete the STK Push prompt on your phone as described in Section 6.2 steps 4–6.
6. Once payment is confirmed, your prescription is sent to the integrated pharmacy for preparation.
7. You will receive an SMS when your medication is ready for collection or out for delivery.

### 6.4 Payment Troubleshooting

| Issue | Likely Cause | What to Do |
|---|---|---|
| STK Push not received | Wrong phone number or M-Pesa not active | Verify your number on the payment screen and click **Resend STK Push** |
| Insufficient funds | M-Pesa balance too low | Top up M-Pesa, then return to the platform and retry payment from My Appointments |
| Payment timed out | No PIN entered within 60 seconds | The payment window expires — click **Retry Payment** on the booking screen |
| Double charge | Duplicate STK Push accepted | Contact NSC admin immediately. Keep your M-Pesa confirmation SMS for reference |
| Booking not confirmed after payment | System delay | Wait 2 minutes and refresh — if still not confirmed, contact the helpdesk with your M-Pesa transaction code |

### 6.5 Viewing Your Payment History

1. From your Patient Dashboard, click **Payment History**.
2. A full list of all transactions appears with date, amount, type (Booking or Prescription), and status.
3. Click **Download Receipt** next to any transaction to save a PDF receipt.

---

## 7. SMS Appointment Reminders

### 7.1 How Reminders Work

The NSC-AI Assistant automatically sends SMS reminders to your registered mobile number using the Africa's Talking SMS API. You do not need to do anything — reminders are sent automatically for every confirmed appointment.

| Reminder | Timing |
|---|---|
| First Reminder | Sent 48 hours before your appointment date and time |
| Second Reminder | Sent 24 hours before your appointment if the first SMS was not delivered |
| Reminder Content | Your name, dermatologist's name, appointment date and time, clinic location, and a cancellation/reschedule note |
| Language | English / Swahili |

> **NOTE:** SMS reminders are sent to the mobile number you registered with. If you change your number, update it immediately in **My Profile** to continue receiving reminders.

### 7.2 Sample Reminder SMS

```
📱 SMS from Nairobi Skin Centre

Dear John Doe, this is a reminder that you have an appointment with Dr. Wanyika
at Nairobi Skin Centre on 1/1/26. Location: Fortis suites. To reschedule or cancel,
reply CANCEL or call 0721-497-444. – NSC-AI Assistant
```

### 7.3 Managing SMS Preferences

1. From your Patient Dashboard, click **My Profile**.
2. Scroll to the **Notification Preferences** section.
3. Toggle **SMS Reminders** on or off as desired.
4. Click **Save Changes**.

---

## 8. Dermatologist Dashboard

### 8.1 Logging In as a Dermatologist

1. Navigate to the platform URL and click **Log In**.
2. Enter your clinician email and password (set by the NSC admin team).
3. Select the role **Dermatologist** if prompted.
4. The **Dermatologist Dashboard** loads, showing Today's Schedule, Urgent Cases, and Pending Reviews.

### 8.2 Viewing Today's Appointments

Your daily schedule is displayed on the Dashboard home screen. Each appointment card shows:

- Patient name and contact number
- Appointment time
- AI Severity Score (colour-coded) if an image was uploaded
- Consultation type (In-Person or Follow-Up)
- Patient notes / reason for visit

### 8.3 Reviewing AI Severity Scores

Urgent cases (scores 8–10) are highlighted in red at the top of your dashboard under **Urgent Cases**. Before each consultation:

1. Click on the patient appointment card.
2. Click **View AI Diagnosis** to see the uploaded skin image and AI severity score.
3. Review the AI notes and score as preparatory context.
4. Proceed with your clinical consultation and document your own diagnosis independently.

> **IMPORTANT:** The AI severity score is a decision-support tool. Your clinical judgement always takes precedence. You can override or flag any AI result from the patient record.

### 8.4 Managing Urgent Slots

Two urgent care slots are reserved daily in your schedule. They appear at the top of your calendar marked with a red **URGENT** badge.

- Urgent slots are auto-filled by the system when a patient scores 8–10 in AI diagnosis.
- If both urgent slots are filled, subsequent urgent cases are placed on a **Priority Waitlist** and the patient is notified.
- You may manually re-assign an urgent slot via the **Edit Slot** button if clinically necessary.

### 8.5 Issuing Prescriptions

1. From the patient's consultation record, click **Issue Prescription**.
2. Search for and add each medication using the drug name search bar.
3. Set dosage, frequency, and duration for each item.
4. Add any special instructions in the **Notes** field.
5. Click **Submit Prescription**.
6. The prescription is electronically sent to the integrated pharmacy.
7. The patient receives an SMS notification that their prescription is ready for payment.

---

## 9. Patient Records & Progress Tracking

### 9.1 Accessing a Patient Record (Dermatologist)

1. From the Dermatologist Dashboard, click **Patient Records** in the left navigation.
2. Search by patient name, ID, or mobile number.
3. Click on the patient to open their full record.
4. The record shows: personal details, appointment history, AI diagnosis history (all uploads and scores), prescriptions issued, and payment status.

### 9.2 Tracking Condition Progress

For patients with recurring or chronic conditions, the platform provides a visual progress timeline showing all uploaded skin images over time alongside their AI severity scores. This enables you to objectively track improvement or deterioration between visits.

### 9.3 Patient Access to Records

Patients can view their own records from their Patient Dashboard under **My Medical Records**. They can see their AI diagnosis history, appointment history, and issued prescriptions, but cannot edit clinical notes.

---

## 10. Admin Dashboard

### 10.1 Admin Login

1. Navigate to the platform URL and click **Log In**.
2. Enter your admin credentials (email and password set by IT).
3. Select the role **Admin** if prompted.
4. The **Admin Dashboard** loads with a summary of today's bookings, revenue, SMS delivery rates, and M-Pesa transaction status.

### 10.2 Managing the Booking Calendar

Admins can view and manage all bookings across all dermatologists.

| Task | How to Perform |
|---|---|
| View all bookings | Click **Booking Calendar** — filter by dermatologist, date, or status |
| Manually create a booking | Click **+ New Booking**, select patient, dermatologist, date and time |
| Cancel a booking | Click the booking entry, then **Cancel Booking**, and select a cancellation reason |
| Block off a date/time | Click on a time slot and select **Block** — this removes the slot from patient availability |
| Export booking report | Click **Export > CSV or PDF** from the calendar view |

### 10.3 Payment Reconciliation

1. From the Admin Dashboard, click **Payments**.
2. All M-Pesa transactions are listed with date, patient name, amount, type (Booking/Prescription), and status (Success/Failed/Pending).
3. Use the **Date Range** filter to view transactions for a specific period.
4. Click **Export** to download a reconciliation report in CSV format for accounting.
5. For any failed or disputed transactions, click the transaction entry and select **Flag for Review**.

### 10.4 SMS & Communication Logs

1. From the Admin Dashboard, click **SMS Logs**.
2. All outgoing SMS messages are listed with recipient, content, delivery status, and timestamp.
3. Filter by delivery status (Delivered / Failed / Pending).
4. For any failed SMS, click **Resend** to trigger a manual retry.

---

## 11. Pharmacy Module

### 11.1 For Patients — Ordering Your Medication

1. After your dermatologist issues a prescription, you receive an SMS and an in-app notification.
2. Log in to your Patient Dashboard and click **My Prescriptions**.
3. Click **View & Pay** next to the new prescription.
4. Review the itemised medication list and total cost.
5. Select **Delivery Method**: Pickup from Clinic or Home Delivery (additional fee applies).
6. If selecting Home Delivery, enter or confirm your delivery address.
7. Click **Pay via M-Pesa** and complete the STK Push on your phone.
8. Once payment is confirmed, the order is sent to the pharmacy for preparation.
9. You receive an SMS when your order is ready: *"Your prescription from Nairobi Skin Centre is ready for [pickup/delivery]."*

### 11.2 Tracking Your Order

- **For Pickup:** visit the pharmacy counter and present your patient ID or booking confirmation SMS.
- **For Home Delivery:** a tracking link is sent via SMS once the order is dispatched.
- Delivery tracking is updated in real time on your **My Prescriptions** screen.

### 11.3 For Admin — Managing Pharmacy Orders

1. From the Admin Dashboard, click **Pharmacy Orders**.
2. All pending, in-progress, and completed orders are listed.
3. Click on any order to view full prescription details, patient contact, and payment status.
4. Update order status: **Received → In Preparation → Ready → Dispatched → Delivered**.
5. Use the **Stock Alerts** tab to view low-inventory warnings for medications.

---

## 12. IT Support & System Administration

### 12.1 System Monitoring

The platform uses AWS CloudWatch and UptimeRobot for continuous monitoring. IT support staff can access the monitoring dashboard from the Admin panel.

| Component | Monitoring Tool | Alert Threshold | Alert Channel |
|---|---|---|---|
| API Response Time | AWS CloudWatch | > 2 seconds | PagerDuty + Slack |
| AI Inference | Prometheus + Grafana | > 5 seconds | PagerDuty |
| M-Pesa Errors | Custom Dashboard | > 1% error rate | Email + Slack |
| SMS Delivery Rate | Africa's Talking Dashboard | < 95% delivery | Email |
| Server CPU / RAM | AWS CloudWatch | > 80% sustained | PagerDuty + Slack |
| Uptime | UptimeRobot | Any downtime | SMS + Email + Slack |

### 12.2 Routine Maintenance Tasks

- **Weekly:** Review security scan reports (OWASP ZAP, Snyk) and address flagged vulnerabilities
- **Monthly:** Rebuild database indexes and review slow query logs
- **Quarterly:** Run disaster recovery drill — test backup restoration and failover
- **Quarterly:** Retrain AI severity scoring model with new anonymised clinical data
- **Annually:** Commission third-party penetration testing

### 12.3 Backup & Recovery

| Item | Details |
|---|---|
| Database Backups | Automated daily snapshots via AWS RDS — retained for 30 days |
| Image Storage | AWS S3 versioning with cross-region replication |
| Application Code | Git repository with tagged releases; weekly offsite backup |
| RTO | 4 hours for P1 (critical) incidents |
| RPO | Maximum 24 hours of data loss acceptable |

---

## 13. Troubleshooting

### 13.1 Common Patient Issues

| Problem | Possible Cause | Solution |
|---|---|---|
| Cannot log in | Wrong email or password | Click **Forgot Password** to reset via email |
| OTP not received | Wrong phone number or network delay | Wait 60 seconds and click **Resend OTP**. Check that your number is correct. |
| M-Pesa STK Push not received | Incorrect phone number or M-Pesa inactive | Verify number on payment screen and click **Resend STK Push** |
| Image upload fails | File too large or wrong format | Ensure file is JPG/PNG/HEIC and under 10 MB |
| AI score not showing | Analysis still processing or error | Wait 30 seconds and refresh. If still blank, re-upload your image. |
| Voice agent not responding | Microphone permission denied | Go to your browser settings, allow microphone access for the site, and reload |
| Booking not confirmed after payment | System delay | Wait 2 minutes and refresh. If still unconfirmed, contact the helpdesk with your M-Pesa transaction code. |
| SMS reminder not received | Number updated or SMS delivery failure | Check your number in My Profile. Contact admin to trigger a manual resend. |

### 13.2 Error Messages Reference

| Error Message | Meaning | Action |
|---|---|---|
| "Session expired. Please log in again." | Your login session timed out after inactivity | Log in again — your data is not lost |
| "Payment failed. Please try again." | M-Pesa transaction was declined | Check M-Pesa balance; retry or use a different number |
| "Image analysis failed. Please re-upload." | Image was corrupted or unclear | Upload a clearer, well-lit photo |
| "No slots available for selected date." | All slots for that day are fully booked | Choose a different date or join the waitlist |
| "Voice agent unavailable." | Microphone issue or AI agent offline | Use web booking instead; report to IT if recurring |
| "Your session has been transferred to staff." | Voice agent handoff triggered | A clinic staff member will assist you |

---

## 14. Frequently Asked Questions (FAQ)

### General

**Q: Is the AI diagnosis a substitute for seeing a dermatologist?**  
A: No. The AI severity score (1–10) is a triage and prioritisation tool. It helps ensure urgent cases are seen quickly, but a qualified dermatologist at Nairobi Skin Centre will always conduct a proper clinical examination and provide your diagnosis.

**Q: Is my personal and medical data secure?**  
A: Yes. All data is encrypted in transit and at rest. The platform complies with the Kenya Data Protection Act 2019. Images are stored in encrypted AWS S3 storage. No data is shared with third parties without your consent.

**Q: Can I use the platform without a smartphone?**  
A: Yes. The web portal is accessible from any modern web browser, including on desktop computers. The Voice AI feature requires a microphone. The AI image upload requires a camera or the ability to upload a photo file.

### Appointments

**Q: What is an urgent slot?**  
A: Two appointment slots are reserved every day for urgent cases — patients whose AI severity score is 8, 9, or 10. These slots are prioritised regardless of the general booking queue, ensuring that the most critical cases are seen the same day or the next available day.

**Q: Can I book for someone else (e.g. a child or elderly parent)?**  
A: Yes. On the booking form, select "Booking for someone else" and enter the patient's details. The M-Pesa payment and SMS reminders will still go to your registered number.

**Q: How far in advance can I book?**  
A: You can book appointments up to 90 days in advance. Same-day bookings are available for non-urgent cases if slots remain open.

### Payments

**Q: What if I am charged but the booking was not confirmed?**  
A: Note your M-Pesa transaction confirmation code and contact the NSC admin team via the helpdesk. Refunds are processed within 3–5 working days.

**Q: Are there any charges beyond the consultation fee?**  
A: The booking fee covers the consultation. Prescription medications are charged separately through the pharmacy module. Home delivery of medications carries an additional delivery fee shown at checkout.

---

## 15. Glossary of Terms

| Term | Definition |
|---|---|
| AI (Artificial Intelligence) | Computer system that performs tasks normally requiring human intelligence, such as analysing medical images |
| Africa's Talking API | A Kenyan company that offers USSD, SMS and voice solutions to the African market |
| CNN (Convolutional Neural Network) | The type of AI model used by the platform to analyse skin condition images |
| Daraja 3.0 | Safaricom's developer API used to process M-Pesa STK Push payments |
| Dialogflow CX | Google's natural language processing platform powering the Voice AI booking agent's understanding of speech |
| ElevenLabs | The AI voice synthesis platform used to generate the Voice AI agent's spoken responses |
| M-Pesa | Safaricom's mobile money service used for all payments on the NSC-AI Assistant platform |
| NSC | Nairobi Skin Centre — the healthcare institution this platform is built for |
| OTP (One-Time Password) | A temporary code sent via SMS for account verification |
| PIR (Post-Implementation Review) | A formal review conducted 60 days after go-live to assess platform performance |
| RPO (Recovery Point Objective) | The maximum acceptable amount of data loss in case of a system failure (24 hours for this platform) |
| RTO (Recovery Time Objective) | The maximum acceptable time to restore the system after a failure (4 hours for critical incidents) |
| Severity Score | The AI-generated rating from 1–10 indicating the urgency of a patient's skin condition |
| STK Push | Safaricom M-Pesa SIM Toolkit Push — a payment prompt sent directly to a user's phone to enter their PIN |
| Triage | The process of sorting patients based on urgency so the most critical cases receive care first |
| Urgent Slot | One of the 2 daily appointment slots reserved exclusively for patients with AI severity scores of 8, 9, or 10 |
| UAT (User Acceptance Testing) | Testing conducted by real end-users to verify the system meets requirements before go-live |
| Voice AI Agent | The speech-enabled booking AI assistant |

---

## 16. Contact & Support

| Role | Contact |
|---|---|
| Helpdesk (Patients) | kramer@mwangala.com \| 0721-497-444 |
| Admin / IT Support | info@mwangala.com |
| Clinic Address | Nairobi Skin Centre, Nairobi, Kenya |
| Platform Developer | Mwangala Kramer \| 22/07021@students.kcau.ac.ke |
| Academic Supervisor | Dr. Ernest Madara \| KCA University |
| Support Hours | Monday – Friday, 8:00 AM – 5:00 PM EAT |

---

*NSC-AI Assistant User Manual | March 2026*  
*Developed by Mwangala Kramer | KCA University | Final Year Project 2025/2026*
