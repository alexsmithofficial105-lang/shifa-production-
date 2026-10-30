import React from 'react';
import { useApp } from '../context/AppContext.tsx';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { settings } = useApp();
  const brandName = settings?.brandName || 'Shifa Productions';

  if (type === 'privacy') {
    const customPrivacy = settings?.legal?.privacyPolicy;
    return (
      <div className="py-16 md:py-24 bg-[#060913] text-neutral-100 animate-fadeIn">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
              Legal Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-brand">
              Privacy Policy
            </h1>
            <p className="text-xs text-neutral-500">
              Last updated: October 2026 · Shifa Productions (Private) Limited, Pakistan
            </p>
          </div>

          <div className="space-y-6 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800 pt-8 whitespace-pre-line">
            {customPrivacy ? (
              <div>{customPrivacy}</div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white font-brand">1. Information Collection</h2>
                <p>
                  At {brandName}, we respect the confidentiality and privacy of our wedding couples, corporate clients, and brand partners across Pakistan. When you submit a quote request or contact form on our website, we collect your name, phone number, email address, city, and creative project details solely for evaluating and responding to your production request.
                </p>

                <h2 className="text-lg font-bold text-white font-brand">2. Use of Media & Footage</h2>
                <p>
                  All video and photographic assets filmed during client engagements are handled strictly under the terms of each signed production contract. Private family wedding footage is never shared publicly or published to social media without explicit prior consent from the couple or family head.
                </p>

                <h2 className="text-lg font-bold text-white font-brand">3. Data Security & Storage</h2>
                <p>
                  Client inquiries and contact details stored on our servers are protected using industry-standard encryption and strict administrative access controls. We do not sell, rent, or trade client information to any third parties or marketing syndicates.
                </p>

                <h2 className="text-lg font-bold text-white font-brand">4. Contact Us</h2>
                <p>
                  If you have any questions regarding our privacy practices or wish to request data deletion, please contact our legal desk at <strong className="text-white">{settings?.email || 'contact@shifaproductions.pk'}</strong>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const customTerms = settings?.legal?.termsAndConditions;
  return (
    <div className="py-16 md:py-24 bg-[#060913] text-neutral-100 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
            Legal Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-brand">
            Terms & Conditions of Service
          </h1>
          <p className="text-xs text-neutral-500">
            Governed under the laws of the Islamic Republic of Pakistan · October 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800 pt-8 whitespace-pre-line">
          {customTerms ? (
            <div>{customTerms}</div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-white font-brand">1. Booking & Retainer Deposits</h2>
              <p>
                All production shoot dates in Pakistan are confirmed only upon receipt of a 50% non-refundable advance booking retainer via official company bank transfer. The booking secures the requested cinema gear and assigned film crew exclusively for the agreed calendar dates.
              </p>

              <h2 className="text-lg font-bold text-white font-brand">2. Payment Schedule</h2>
              <p>
                Standard payment schedule: 50% upon contract signing; 30% payable on the primary shoot day; and the remaining 20% balance settled prior to final delivery of theatrical masters, RAW archival drives, or cloud links.
              </p>

              <h2 className="text-lg font-bold text-white font-brand">3. Editorial Revisions & Delivery</h2>
              <p>
                Each package includes two (2) complimentary rounds of editorial review based on the original creative brief. Additional editorial revisions or alterations of approved sound scores are billed at our standard studio hourly rate. Master delivery schedules range from 3 to 5 weeks following production completion.
              </p>

              <h2 className="text-lg font-bold text-white font-brand">4. Drone & Airspace Regulations</h2>
              <p>
                Aerial drone filming is subject to weather conditions and Civil Aviation Authority (CAA) of Pakistan flight zones. In areas where local defense or security authorities restrict drone flights, {brandName} will substitute ground camera cranes and gimbal movements.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
