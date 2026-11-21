// Text of the legal pages. Facts about the platform must match the current system.

export interface LegalSection {
  title: string
  items: { subtitle: string; text: string }[]
}

export interface LegalDocument {
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
}

export const LINKS = {
  github: 'https://github.com/12fahed/CertiNova',
  issues: 'https://github.com/12fahed/CertiNova/issues',
  discord: 'https://discord.gg/sQ4sSMRjP',
  twitter: 'https://x.com/12fahedk',
  linkedin: 'https://www.linkedin.com/in/fahed-khan-13b11025b/',
} as const

export const PRIVACY: LegalDocument = {
  title: 'Privacy Policy',
  intro:
    'At CertiNova, your privacy is not an afterthought, it is the foundation of how we build. This document explains exactly how we handle your data.',
  updated: 'November 2026',
  sections: [
    {
      title: '1. Information We Collect',
      items: [
        {
          subtitle: 'Account Information',
          text: 'When you register on CertiNova, we collect your name, email address, and a securely hashed version of your password. We also store the name of each organisation you create or join. We never store your password in plain text.',
        },
        {
          subtitle: 'Recipient Data',
          text: 'When generating certificates, organisations provide recipient information including names, optional email addresses, and ranks. We store this data so that organisations can search their history, send emails, and so that the public verify page works.',
        },
        {
          subtitle: 'Certificate Templates and Images',
          text: 'Certificate background images uploaded by organisations, and the certificate images we generate, are stored in private storage. Template files are restricted to PNG, JPEG and WebP images, with a maximum size of 10MB.',
        },
      ],
    },
    {
      title: '2. How We Protect Your Data',
      items: [
        {
          subtitle: 'Access Control',
          text: 'Every request is checked against your organisation membership and role. The database applies the same rules a second time with row-level security, so one organisation cannot read the data of another.',
        },
        {
          subtitle: 'Encryption',
          text: 'All data travels over encrypted connections (HTTPS). Our database and file storage provider encrypts stored data at rest. Files are served only through short-lived signed links.',
        },
        {
          subtitle: 'Password Security',
          text: 'Account passwords are hashed with bcrypt by our authentication provider. Our team and our servers never see your password in plain text.',
        },
      ],
    },
    {
      title: '3. Third-Party Services',
      items: [
        {
          subtitle: 'Supabase',
          text: 'Supabase hosts our database, user accounts and file storage. Recipient data, events, templates, certificate images and verification records are stored there.',
        },
        {
          subtitle: 'Hasura and Render',
          text: 'Hasura Cloud runs the API that the app uses. Render runs our servers that make certificate images, files for download, and emails.',
        },
        {
          subtitle: 'Email and Fonts',
          text: 'When an organisation sends certificates by email, we pass the recipient email address and the certificate to our email provider. Fonts for certificates are loaded from Google Fonts.',
        },
      ],
    },
    {
      title: '4. Public Certificate Verification',
      items: [
        {
          subtitle: 'What the Verify Page Shows',
          text: 'The public verification page (/verify/{UUID}) shows the organisation name, issuer name, event name, event date, issue date, rank, and whether the certificate was revoked. It shows the recipient name and certificate image only if the organisation allows it. It never shows the recipient email.',
        },
        {
          subtitle: 'No Login Required',
          text: 'Certificate verification is fully public and does not require any account. Anyone with a valid certificate UUID or QR code can verify its authenticity.',
        },
      ],
    },
    {
      title: '5. Data Retention & Deletion',
      items: [
        {
          subtitle: 'Events and Certificates',
          text: 'When an organisation deletes an event, the event is hidden from the dashboard. Its certificates are kept, so that verify links and QR codes continue to work. Organisations can revoke any certificate. To remove data permanently, contact us.',
        },
        {
          subtitle: 'Data From the Old CertiNova',
          text: 'Recipient data moved from the old CertiNova stays encrypted until the organisation owner unlocks it with the old password. We use that password one time to unlock the data and we do not store it.',
        },
      ],
    },
    {
      title: '6. Data Isolation',
      items: [
        {
          subtitle: 'Organisation-Based Isolation',
          text: 'Each organisation can only access its own events, certificate templates, and recipient data. Members see only the organisations they belong to.',
        },
      ],
    },
  ],
}

export const TERMS: LegalDocument = {
  title: 'Terms & Conditions',
  intro:
    'Please read these Terms and Conditions carefully before using CertiNova. By using our platform, you agree to be bound by these terms.',
  updated: 'November 2026',
  sections: [
    {
      title: '1. Acceptance of Terms',
      items: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By creating an account, accessing, or using CertiNova in any way, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, you must not use the platform.',
        },
      ],
    },
    {
      title: '2. Acceptable Use',
      items: [
        {
          subtitle: 'Permitted Use',
          text: 'CertiNova is designed for legitimate certificate generation, management, and verification for educational institutions, corporate training, event management, and professional certifications.',
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You must not generate fraudulent, misleading, or counterfeit certificates. You must not upload offensive, inappropriate, or copyrighted content as certificate templates without proper rights. You must not attempt to reverse-engineer, exploit, or attack any part of the platform.',
        },
        {
          subtitle: 'Compliance',
          text: 'You are responsible for ensuring that your use of CertiNova complies with all applicable local, national, and international laws and regulations.',
        },
      ],
    },
    {
      title: '3. User Responsibilities',
      items: [
        {
          subtitle: 'Account Security',
          text: 'You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility. Notify us immediately if you suspect unauthorised access.',
        },
        {
          subtitle: 'Old Encrypted Data',
          text: 'Data moved from the old CertiNova can only be unlocked with the password used on the old app. CertiNova does not store that password. If it is lost, the old recipient data cannot be recovered by anyone, including our team.',
        },
        {
          subtitle: 'Recipient Data Accuracy',
          text: 'You are solely responsible for the accuracy, legality, and appropriateness of recipient data you enter or upload into the platform. CertiNova is not liable for errors in recipient information.',
        },
      ],
    },
    {
      title: '4. Intellectual Property',
      items: [
        {
          subtitle: 'Open Source License',
          text: 'CertiNova is open-source software licensed under the MIT License. You are free to use, copy, modify, and distribute the software in accordance with the terms of the MIT License.',
        },
        {
          subtitle: 'Your Content',
          text: 'You retain full ownership of any certificate templates you upload to CertiNova. By uploading templates, you confirm that you own the rights to use them and grant CertiNova a limited licence to store and display them solely for the purpose of generating certificates.',
        },
        {
          subtitle: 'Platform IP',
          text: 'The CertiNova name, logo, and branding are the intellectual property of the project maintainers. You must not use them without prior written permission.',
        },
      ],
    },
    {
      title: '5. Limitation of Liability',
      items: [
        {
          subtitle: 'As-Is Service',
          text: 'CertiNova is provided on an "as-is" and "as-available" basis without warranties of any kind, express or implied. We do not guarantee that the platform will be error-free, uninterrupted, or free of security vulnerabilities.',
        },
        {
          subtitle: 'Data Loss',
          text: 'We are not liable for any loss of data, including old recipient data that cannot be unlocked because the old password is lost, accidental deletion, or any other reason.',
        },
        {
          subtitle: 'Misuse',
          text: 'We are not responsible for any misuse of the platform by organisations or individuals, including the generation of fraudulent certificates or unauthorised use of recipient data.',
        },
      ],
    },
    {
      title: '6. Termination',
      items: [
        {
          subtitle: 'By You',
          text: 'You may stop using CertiNova at any time. To delete your account and its data, contact us.',
        },
        {
          subtitle: 'By Us',
          text: 'We reserve the right to suspend or terminate access to CertiNova for any account that violates these Terms and Conditions, without prior notice.',
        },
      ],
    },
    {
      title: '7. Changes to Terms',
      items: [
        {
          subtitle: 'Updates',
          text: 'We may update these Terms and Conditions from time to time. We will update the "Last updated" date at the top of this page. Continued use of CertiNova after changes are posted constitutes your acceptance of the updated terms.',
        },
      ],
    },
  ],
}
