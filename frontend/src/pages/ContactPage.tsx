import { useState, FormEvent } from "react";
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSettings } from "../context/SettingsContext";
import { api, getErrorMessage } from "../lib/api";

export default function ContactPage() {
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/contact", formData);
      toast.success("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* ============ PAGE HEADER ============ */}
       {/* ============ PAGE HEADER ============ */}
      <section className="relative overflow-hidden bg-maroon-600 text-cream-50">
        { true ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/college-photo2.jpg)" }}
            />
            <div className="absolute inset-0 bg-maroon-700/75" />
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Get in touch
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Contact Us</h1>
          <p className="mt-3 max-w-xl text-maroon-100">
            Have a question about admissions, courses, or campus life? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ============ CONTACT INFO + FORM ============ */}
      <section className="bg-cream-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
          {/* Contact info cards */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border border-maroon-100 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-50 text-maroon-600">
                <MapPin size={18} />
              </span>
              <h3 className="mt-3 font-semibold text-ink-900">Address</h3>
              <p className="mt-1 text-sm text-ink-500">{settings?.address || "—"}</p>
            </div>

            <div className="rounded-lg border border-maroon-100 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-50 text-maroon-600">
                <Phone size={18} />
              </span>
              <h3 className="mt-3 font-semibold text-ink-900">Phone</h3>
              <p className="mt-1 text-sm text-ink-500">{settings?.phone || "—"}</p>
            </div>

            <div className="rounded-lg border border-maroon-100 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-50 text-maroon-600">
                <Mail size={18} />
              </span>
              <h3 className="mt-3 font-semibold text-ink-900">Email</h3>
              <p className="mt-1 text-sm text-ink-500">{settings?.email || "—"}</p>
            </div>

            {settings?.mapEmbedUrl && (
              <div className="overflow-hidden rounded-lg border border-maroon-100">
                <iframe
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Campus location map"
                />
              </div>
            )}
          </div>

          {/* Contact form */}
          <div className="rounded-lg border border-maroon-100 bg-white p-6 lg:col-span-3">
            <h2 className="font-display text-xl font-semibold text-maroon-600">Send us a message</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-ink-700">Your name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="Full name"
                    className="mt-1 w-full rounded-md border border-maroon-100 px-3 py-2.5 text-sm outline-none focus:border-maroon-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-700">Email address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange("email")}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-md border border-maroon-100 px-3 py-2.5 text-sm outline-none focus:border-maroon-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-700">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange("subject")}
                  placeholder="What is this regarding?"
                  className="mt-1 w-full rounded-md border border-maroon-100 px-3 py-2.5 text-sm outline-none focus:border-maroon-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-ink-700">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange("message")}
                  placeholder="Write your message here..."
                  className="mt-1 w-full resize-none rounded-md border border-maroon-100 px-3 py-2.5 text-sm outline-none focus:border-maroon-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-md bg-maroon-600 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-maroon-500 disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}