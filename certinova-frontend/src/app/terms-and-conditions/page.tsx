'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Scale,
  AlertTriangle,
  UserCheck,
  ArrowLeft,
  Pencil,
  Lock,
  Shield,
  Mail,
  Award,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const sections = [
  {
    icon: UserCheck,
    title: '1. Acceptance of Terms',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By creating an account, accessing, or using CertiNova in any way, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, you must not use the platform.',
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: '2. Acceptable Use',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    content: [
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
    icon: Lock,
    title: '3. User Responsibilities',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    content: [
      {
        subtitle: 'Account Security',
        text: 'You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility. Notify us immediately if you suspect unauthorised access.',
      },
      {
        subtitle: 'Encryption Password',
        text: 'The encryption password you set during certificate generation is never stored by CertiNova. You are solely responsible for remembering and securing it. If lost, encrypted recipient data cannot be recovered by anyone, including our team.',
      },
      {
        subtitle: 'Recipient Data Accuracy',
        text: 'You are solely responsible for the accuracy, legality, and appropriateness of recipient data you enter or upload into the platform. CertiNova is not liable for errors in recipient information.',
      },
    ],
  },
  {
    icon: Pencil,
    title: '4. Intellectual Property',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    content: [
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
    icon: Scale,
    title: '5. Limitation of Liability',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    content: [
      {
        subtitle: 'As-Is Service',
        text: 'CertiNova is provided on an "as-is" and "as-available" basis without warranties of any kind, express or implied. We do not guarantee that the platform will be error-free, uninterrupted, or free of security vulnerabilities.',
      },
      {
        subtitle: 'Data Loss',
        text: 'We are not liable for any loss of data, including recipient data that cannot be recovered due to a lost encryption password, accidental deletion, or any other reason.',
      },
      {
        subtitle: 'Misuse',
        text: 'We are not responsible for any misuse of the platform by organisations or individuals, including the generation of fraudulent certificates or unauthorised use of recipient data.',
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: '6. Termination',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    content: [
      {
        subtitle: 'By You',
        text: 'You may stop using CertiNova at any time. You can delete your account and all associated data from the dashboard.',
      },
      {
        subtitle: 'By Us',
        text: 'We reserve the right to suspend or terminate access to CertiNova for any account that violates these Terms and Conditions, without prior notice.',
      },
    ],
  },
  {
    icon: FileText,
    title: '7. Changes to Terms',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    content: [
      {
        subtitle: 'Updates',
        text: 'We may update these Terms and Conditions from time to time. We will update the "Last updated" date at the top of this page. Continued use of CertiNova after changes are posted constitutes your acceptance of the updated terms.',
      },
    ],
  },
  {
    icon: Mail,
    title: '8. Contact Us',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    content: [
      {
        subtitle: 'Questions or Concerns',
        text: (
          <>
            For any questions about these Terms and Conditions, please reach out via our{' '}
            <a
              href="https://discord.gg/sQ4sSMRjP"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord server
            </a>{' '}
            or open an issue on our{' '}
            <a
              href="https://github.com/12fahed/CertiNova"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            .
          </>
        ),
      },
    ],
  },
];

export default function TermsAndConditionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 z-50 backdrop-blur-xl bg-white/90 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">CertiNova</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-violet-50/50 to-white pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-blue-700 text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Legal Document
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-gray-500 text-lg max-w-2xl mb-3">
              Please read these Terms and Conditions carefully before using CertiNova. By using our
              platform, you agree to be bound by these terms.
            </p>
            <p className="text-gray-400 text-sm">
              Last updated: May 2026 &nbsp;·&nbsp; Effective immediately
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlight Cards */}
      <section className="py-8 border-y border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                label: 'Legitimate Use Only',
                desc: 'Platform is for genuine certificate generation',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: Lock,
                label: 'Your Responsibility',
                desc: 'Secure your encryption password, we cannot recover it',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
              },
              {
                icon: Scale,
                label: 'MIT Licensed',
                desc: 'Open-source, free to use and contribute',
                color: 'text-violet-600',
                bg: 'bg-violet-50',
              },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl p-5 ${item.bg} border border-gray-100`}>
                <item.icon className={`h-5 w-5 ${item.color} mb-3`} />
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`rounded-2xl border ${section.border} p-8`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-10 h-10 ${section.bg} rounded-xl flex items-center justify-center`}
                >
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="space-y-5">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <p className="font-semibold text-gray-800 mb-1">{item.subtitle}</p>
                    <p className="text-gray-500 leading-relaxed text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="container mx-auto px-6 max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
          <p>© 2026 CertiNova. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <span className="text-red-500">❤</span> using TypeScript & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
