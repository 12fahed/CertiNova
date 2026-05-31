'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Database,
  Eye,
  Trash2,
  Mail,
  ArrowLeft,
  Server,
  FileKey,
  Award,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const sections = [
  {
    icon: Eye,
    title: '1. Information We Collect',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you register on CertiNova, we collect your organisation name, email address, and a securely hashed version of your password. We never store your password in plain text.',
      },
      {
        subtitle: 'Recipient Data',
        text: 'When generating certificates, organisations provide recipient information including names, email addresses, and ranks. This data is encrypted immediately using AES-256-CBC before being stored in our database.',
      },
      {
        subtitle: 'Certificate Templates',
        text: 'Certificate background images uploaded by organisations are stored securely on Cloudinary CDN. Files are restricted to images only, with a maximum size of 10MB.',
      },
    ],
  },
  {
    icon: Lock,
    title: '2. How We Protect Your Data',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    content: [
      {
        subtitle: 'AES-256-CBC Encryption',
        text: 'All recipient personal data is encrypted using AES-256-CBC with PBKDF2 key derivation (SHA-256, 10,000 iterations). Each batch uses a unique salt and IV, ensuring that even identical data produces different ciphertext.',
      },
      {
        subtitle: 'Zero Plain-Text Storage',
        text: 'Recipient names, emails, and ranks exist only transiently in server memory during processing. They are never written to the database in plain text under any circumstances.',
      },
      {
        subtitle: 'Password Security',
        text: 'User account passwords are hashed using bcrypt at cost factor 12. The encryption password used during certificate generation is never transmitted to or stored by our servers, only you know it.',
      },
    ],
  },
  {
    icon: Database,
    title: '3. Third-Party Services',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    content: [
      {
        subtitle: 'Cloudinary',
        text: 'Certificate template images are stored on Cloudinary, a cloud-based media management platform. Files are stored under the certinova/certificate-templates/ folder and are never written to our own servers.',
      },
      {
        subtitle: 'MongoDB',
        text: 'Encrypted recipient data, event configurations, organisation accounts, and certificate verification records are stored in MongoDB. All sensitive fields are encrypted before storage.',
      },
    ],
  },
  {
    icon: Eye,
    title: '4. Public Certificate Verification',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    content: [
      {
        subtitle: 'Privacy-by-Design Verification',
        text: 'The public certificate verification page (/verify/{UUID}) displays only the organisation name, issuer name, event name, and event date. A sample certificate is rendered using placeholder identity data, real recipient information is never exposed.',
      },
      {
        subtitle: 'No Login Required',
        text: 'Certificate verification is fully public and does not require any account. Anyone with a valid certificate UUID or QR code can verify its authenticity without accessing any personal data.',
      },
    ],
  },
  {
    icon: Trash2,
    title: '5. Data Retention & Deletion',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    content: [
      {
        subtitle: 'Organisation-Controlled Deletion',
        text: 'Organisations can permanently delete any event and all its associated data, including certificate configurations, encrypted recipient batches, and verification UUID records, directly from the dashboard at any time.',
      },
      {
        subtitle: 'Encryption Password',
        text: 'The encryption password used during certificate generation is never stored by CertiNova. If the password is lost, the encrypted recipient data cannot be recovered by anyone, including our team.',
      },
    ],
  },
  {
    icon: FileKey,
    title: '6. Data Isolation',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    content: [
      {
        subtitle: 'Organisation-Based Isolation',
        text: 'Each organisation can only access its own events, certificate templates, and recipient data. There is no cross-organisation data access at any level of the platform.',
      },
    ],
  },
  {
    icon: Mail,
    title: '7. Contact Us',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    content: [
      {
        subtitle: 'Get in Touch',
        text: (
          <>
            If you have any questions, concerns, or requests regarding this Privacy Policy or your
            data, please reach out to us via our{' '}
            <a
              href="https://discord.gg/sQ4sSMRjP"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord server
            </a>{' '}
            or through{' '}
            <a
              href="https://github.com/12fahed/CertiNova/issues"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Issues
            </a>
            .
          </>
        ),
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
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
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-500 text-lg max-w-2xl mb-3">
              At CertiNova, your privacy is not an afterthought, it is the foundation of how we
              build. This document explains exactly how we handle your data.
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
                icon: Lock,
                label: 'AES-256-CBC Encryption',
                desc: 'All recipient data encrypted before storage',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: Server,
                label: 'Zero Plain-Text Storage',
                desc: 'Personal data never stored unencrypted',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
              },
              {
                icon: Eye,
                label: 'Privacy-by-Design',
                desc: 'Verification never exposes real recipient data',
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
