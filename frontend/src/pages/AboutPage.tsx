import { Award, Target, Eye, Users } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function AboutPage() {
  const { settings } = useSettings();

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-maroon-700 text-cream-50">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/college-photo3.jpg)" }}
        />
        <div className="absolute inset-0 bg-maroon-900/70" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-block rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-semibold text-gold-400">
            About us
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
            {settings?.collegeName || "Our College"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-maroon-100">
            {settings?.tagline || "Excellence in education, character, and community."}
          </p>
        </div>
      </section>

      {/* ============ ABOUT TEXT ============ */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-gold-600">
                Our story
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-maroon-600">
                {settings?.establishedYear
                  ? `Serving students since ${settings.establishedYear}`
                  : "A legacy of academic excellence"}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-700">
                {settings?.aboutText ||
                  "We are committed to providing quality education and nurturing the next generation of leaders, thinkers, and professionals. Our institution blends academic rigor with strong values to prepare students for life beyond the classroom."}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-maroon-100">
              <img
                src="/campus-photo.jpg"
                alt="Campus"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ MISSION / VISION / VALUES ============ */}
      <section className="bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-maroon-100 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon-50 text-maroon-600">
                <Target size={22} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-maroon-600">
                Our mission
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                To deliver accessible, high-quality education that empowers students to
                achieve their full academic and personal potential.
              </p>
            </div>

            <div className="rounded-lg border border-maroon-100 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon-50 text-maroon-600">
                <Eye size={22} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-maroon-600">
                Our vision
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                To be a leading institution recognized for academic excellence,
                innovation, and producing graduates who shape their communities.
              </p>
            </div>

            <div className="rounded-lg border border-maroon-100 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon-50 text-maroon-600">
                <Award size={22} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-maroon-600">
                Our values
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Integrity, inclusivity, and a commitment to lifelong learning guide
                everything we do, in and out of the classroom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AT A GLANCE ============ */}
      <section className="border-y border-maroon-100 bg-maroon-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="text-center">
            <p className="font-display text-3xl font-semibold text-maroon-600">
              {settings?.establishedYear
                ? new Date().getFullYear() - settings.establishedYear
                : "70+"}
            </p>
            <p className="text-sm text-ink-500">Years of excellence</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-semibold text-maroon-600">3+</p>
            <p className="text-sm text-ink-500">Programs offered</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-semibold text-maroon-600">2000+</p>
            <p className="text-sm text-ink-500">Students enrolled</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-semibold text-maroon-600">40+</p>
            <p className="text-sm text-ink-500">Faculty members</p>
          </div>
        </div>
      </section>

      {/* ============ CONTACT STRIP ============ */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon-50 text-maroon-600">
              <Users size={22} strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-2xl font-semibold text-maroon-600">
              Want to know more?
            </h2>
            <p className="max-w-md text-sm text-ink-500">
              {settings?.address || "Visit our campus"}
              {settings?.phone ? ` · ${settings.phone}` : ""}
              {settings?.email ? ` · ${settings.email}` : ""}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}