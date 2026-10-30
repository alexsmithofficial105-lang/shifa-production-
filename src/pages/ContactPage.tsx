import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { apiClient } from '../api/client.ts';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  Clock,
} from 'lucide-react';

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Other Pakistani City',
  'International / Overseas Destination',
];

const BUDGET_RANGES = [
  'PKR 100,000 - 250,000',
  'PKR 250,000 - 500,000',
  'PKR 500,000 - 1,000,000',
  'PKR 1,000,000 - 2,500,000',
  'PKR 2,500,000+ (High-End Production)',
  'Undecided / Need Consultation',
];

export const ContactPage: React.FC = () => {
  const { services, settings, quotePreset, setQuotePreset, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: 'Lahore',
    customCity: '',
    requiredService: '',
    projectDescription: '',
    preferredDate: '',
    estimatedBudget: 'PKR 250,000 - 500,000',
    preferredContactMethod: 'phone' as 'phone' | 'whatsapp' | 'email',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle quote preset from package or service click
  useEffect(() => {
    if (quotePreset?.service) {
      setFormData((prev) => ({ ...prev, requiredService: quotePreset.service || '' }));
    } else if (services.length > 0 && !formData.requiredService) {
      setFormData((prev) => ({ ...prev, requiredService: services[0].title }));
    }

    if (quotePreset?.package) {
      setFormData((prev) => ({
        ...prev,
        projectDescription: `Inquiring about package: ${quotePreset.package}. `,
      }));
    }
  }, [quotePreset, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setErrorMessage('Please enter your Pakistani contact phone number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.requiredService) {
      setErrorMessage('Please select the required production service.');
      return;
    }
    if (!formData.projectDescription.trim() || formData.projectDescription.length < 10) {
      setErrorMessage('Please describe your project (minimum 10 characters).');
      return;
    }

    const effectiveCity =
      formData.city === 'Other Pakistani City' ? formData.customCity || 'Other Pakistan' : formData.city;

    try {
      setIsSubmitting(true);
      const res = await apiClient.submitInquiry({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        city: effectiveCity,
        requiredService: formData.requiredService,
        projectDescription: formData.projectDescription,
        preferredDate: formData.preferredDate || 'Flexible',
        estimatedBudget: formData.estimatedBudget,
        preferredContactMethod: formData.preferredContactMethod,
      });

      if (res.success) {
        setSubmittedSuccess(true);
        showToast('Inquiry submitted successfully! Our director will contact you.', 'success');
        setQuotePreset(null);
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to submit inquiry. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const phone = settings?.phone || '+92 300 8492026';
  const whatsapp = settings?.whatsapp || '+92 300 8492026';
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="py-12 sm:py-24 bg-[#060913] text-neutral-100 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
            Inquiries & Bookings
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-brand">
            Request a Production Quote
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed">
            Tell us about your brand commercial, royal wedding film, or visual project. We review every brief and return with an itemized proposal within 24 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form (8 columns) */}
          <div className="lg:col-span-8 bg-[#0d1527] border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
            {submittedSuccess ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-brand">
                    Inquiry Received
                  </h3>
                  <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for contacting Shifa Productions. Our executive producer will review your requirements and reach out via your preferred contact method ({formData.preferredContactMethod.toUpperCase()}).
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmittedSuccess(false);
                      setFormData({
                        fullName: '',
                        phoneNumber: '',
                        email: '',
                        city: 'Lahore',
                        customCity: '',
                        requiredService: services[0]?.title || '',
                        projectDescription: '',
                        preferredDate: '',
                        estimatedBudget: 'PKR 250,000 - 500,000',
                        preferredContactMethod: 'phone',
                      });
                    }}
                    className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>

                  <a
                    href={`https://wa.me/${cleanWa}?text=Hi%20Shifa%20Productions,%20I%20just%20submitted%20an%20inquiry%20under%20the%20name%20${encodeURIComponent(
                      formData.fullName
                    )}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900 transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Daniyal Khan"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Pakistani Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="0300-1234567 or +92 3..."
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>

                {/* Email & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="daniyal@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      City in Pakistan <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#2563eb]"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.city === 'Other Pakistani City' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Specify City Name
                    </label>
                    <input
                      type="text"
                      value={formData.customCity}
                      onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
                      placeholder="e.g. Sahiwal, Kasur, Jhelum"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                )}

                {/* Required Service & Preferred Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Required Service <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.requiredService}
                      onChange={(e) => setFormData({ ...formData, requiredService: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#2563eb]"
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Preferred Project Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>

                {/* Estimated Budget & Preferred Contact Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Estimated Budget (PKR)
                    </label>
                    <select
                      value={formData.estimatedBudget}
                      onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#2563eb]"
                    >
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['phone', 'whatsapp', 'email'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredContactMethod: method })}
                          className={`py-2.5 text-xs font-medium rounded-xl border transition-all uppercase tracking-wider ${
                            formData.preferredContactMethod === method
                              ? 'bg-[#2563eb] text-white border-[#2563eb] font-bold shadow-sm'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Project Description & Creative Brief <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    placeholder="Describe your vision, shooting locations in Pakistan, number of event days, target audience, or specific deliverables..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-xs uppercase tracking-wider font-semibold text-white bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#2563eb]/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Your Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Production Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct Studio Contacts Sidebar (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-7 rounded-2xl bg-[#0f172a] border border-neutral-800 space-y-6">
              <h3 className="text-lg font-bold text-white font-brand">
                Direct Studio Contacts
              </h3>

              <div className="space-y-4 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-neutral-400">Direct Telephone</div>
                    <a href={`tel:${phone}`} className="text-sm font-semibold text-white hover:text-[#3b82f6] transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-neutral-400">Official Production Email</div>
                    <a href={`mailto:${settings?.email || 'contact@shifaproductions.pk'}`} className="text-sm font-semibold text-white hover:text-[#3b82f6] transition-colors break-all">
                      {settings?.email || 'contact@shifaproductions.pk'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-neutral-400">Studio Operating Hours</div>
                    <div className="text-sm font-medium text-white">
                      Monday – Saturday: 10:00 AM – 8:00 PM PKT
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional WhatsApp Button */}
              <div className="pt-4 border-t border-neutral-800">
                <a
                  href={`https://wa.me/${cleanWa}?text=Hi%20Shifa%20Productions,%20I%20would%20like%20to%20inquire%20about%20a%20production.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Optional WhatsApp Chat</span>
                </a>
                <p className="text-[11px] text-neutral-500 text-center mt-2">
                  No app download forced. Feel free to use the web form above.
                </p>
              </div>
            </div>

            {/* Studio Offices */}
            <div className="p-7 rounded-2xl bg-[#0f172a] border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
                Visit Our Studios
              </h3>
              <div className="space-y-4 text-xs text-neutral-400 leading-relaxed">
                <div className="space-y-1">
                  <strong className="text-white block font-brand text-sm">Lahore Headquarters:</strong>
                  <span>{settings?.addressLahore}</span>
                </div>
                <div className="space-y-1 pt-2 border-t border-neutral-800">
                  <strong className="text-white block font-brand text-sm">Islamabad Branch:</strong>
                  <span>{settings?.addressIslamabad}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
