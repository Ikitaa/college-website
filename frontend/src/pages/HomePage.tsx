import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, BookOpen, Award, Pin } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { api, getErrorMessage } from "../lib/api";
import type { Course, Notice, GalleryItem } from "../types";

export default function HomePage() {
  const { settings } = useSettings();
  const [courses, setCourses] = useState<Course[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [coursesRes, noticesRes, galleryRes] = await Promise.all([
          api.get("/courses?active=true"),
          api.get("/notices?limit=4"),
          api.get("/gallery?limit=4"),
        ]);
        setCourses(coursesRes.data.courses.slice(0, 3));
        setNotices(noticesRes.data.notices);
        setGallery(galleryRes.data.items);
      } catch (error) {
        console.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden bg-maroon-600 text-cream-50">
  {/* College photo background, if admin set bannerImageUrl - falls back to
      dot-pattern texture if no photo has been uploaded yet. */}
  {settings?.bannerImageUrl ? (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${settings.bannerImageUrl})` }}
      />
      {/* Dark maroon overlay so white text stays readable on top of the photo */}
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

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-semibold text-gold-400">
              {settings?.establishedYear
                ? `Established ${settings.establishedYear}`
                : "Welcome"}
            </span>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {settings?.collegeName || "Your College Name"}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-maroon-100 sm:text-xl">
              {settings?.tagline || "Excellence in education, character, and community."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/admission"
                className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-gold-400"
              >
                Apply for admission
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-md border border-cream-100/40 px-6 py-3 font-semibold text-cream-50 transition-colors hover:bg-cream-50/10"
              >
                Explore courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="border-b border-maroon-100 bg-cream-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center text-maroon-500">
              <Award size={28} strokeWidth={1.75} />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-maroon-600">
              {settings?.establishedYear ? new Date().getFullYear() - settings.establishedYear : "70+"}
            </p>
            <p className="text-sm text-ink-500">Years of excellence</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center text-maroon-500">
              <BookOpen size={28} strokeWidth={1.75} />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-maroon-600">3+</p>
            <p className="text-sm text-ink-500">Programs offered</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center text-maroon-500">
              <Users size={28} strokeWidth={1.75} />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-maroon-600">2000+</p>
            <p className="text-sm text-ink-500">Students enrolled</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center text-maroon-500">
              <Calendar size={28} strokeWidth={1.75} />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-maroon-600">40+</p>
            <p className="text-sm text-ink-500">Faculty members</p>
          </div>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-gold-600">
                About us
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-maroon-600">
                A legacy of academic excellence
              </h2>
              <p className="mt-4 leading-relaxed text-ink-700">
                {settings?.aboutText ||
                  "We are committed to providing quality education and nurturing the next generation of leaders, thinkers, and professionals."}
              </p>
              <Link
                to="/about"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-maroon-600 hover:text-maroon-500"
              >
                Read more about us
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-lg border border-maroon-100 bg-maroon-50 p-8">
              <p className="font-display text-lg leading-relaxed text-maroon-700">
                "Education is the most powerful weapon which you can use to change the world."
              </p>
              <p className="mt-3 text-sm font-semibold text-maroon-500">— Nelson Mandela</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COURSES PREVIEW ============ */}
      <section className="bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-gold-600">
                Academics
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-maroon-600">
                Programs we offer
              </h2>
            </div>
            <Link
              to="/courses"
              className="hidden items-center gap-2 font-semibold text-maroon-600 hover:text-maroon-500 sm:inline-flex"
            >
              View all courses
              <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <p className="mt-8 text-ink-500">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="mt-8 text-ink-500">Course information will be available soon.</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-lg border border-maroon-100 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <span className="font-mono text-xs font-semibold text-gold-600">
                    {course.code}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-maroon-600">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {course.durationYears} years &middot; {course.faculty}
                  </p>
                  <Link
                    to="/courses"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-maroon-600 hover:text-maroon-500"
                  >
                    Learn more
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ NOTICES PREVIEW ============ */}
      <section className="bg-maroon-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-gold-600">
                Stay updated
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-maroon-600">
                Latest notices
              </h2>
            </div>
            <Link
              to="/notices"
              className="hidden items-center gap-2 font-semibold text-maroon-600 hover:text-maroon-500 sm:inline-flex"
            >
              View all notices
              <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <p className="mt-8 text-ink-500">Loading notices...</p>
          ) : notices.length === 0 ? (
            <p className="mt-8 text-ink-500">No notices published yet.</p>
          ) : (
            <div className="mt-8 space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="flex items-start gap-3 rounded-lg border border-maroon-100 bg-white p-4"
                >
                  {notice.isPinned && (
                    <Pin size={16} className="mt-1 shrink-0 text-gold-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-ink-900">{notice.title}</h3>
                    <p className="mt-1 text-sm text-ink-500">
                      {new Date(notice.publishDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ GALLERY PREVIEW ============ */}
      {gallery.length > 0 && (
        <section className="bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-gold-600">
                  Campus life
                </span>
                <h2 className="mt-2 font-display text-3xl font-semibold text-maroon-600">
                  Moments from our campus
                </h2>
              </div>
              <Link
                to="/gallery"
                className="hidden items-center gap-2 font-semibold text-maroon-600 hover:text-maroon-500 sm:inline-flex"
              >
                View gallery
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className="aspect-square overflow-hidden rounded-lg border border-maroon-100 bg-maroon-50"
                >
                  <img
                    src={item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:5000${item.imageUrl}`}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden bg-maroon-700">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/college-photo2.jpg)" }}
        />
        <div className="absolute inset-0 bg-maroon-900/70" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-cream-50">
            Ready to begin your journey with us?
          </h2>
          <p className="mt-3 text-cream-100">
            Applications for the new academic session are now open.
          </p>
          <Link
            to="/admission"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold-500 px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-gold-400"
          >
            Apply now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}