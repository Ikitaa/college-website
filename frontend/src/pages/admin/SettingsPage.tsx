import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

interface Settings {
  collegeName: string;
  shortName: string;
  tagline: string;

  logoUrl: string;
  faviconUrl: string;
  bannerImageUrl: string;

  aboutText: string;
  establishedYear?: number;

  address: string;
  phone: string;
  email: string;
  website: string;

  mapEmbedUrl: string;

  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
    linkedin: string;
  };

  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;

  footerDescription: string;
  copyright: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    collegeName: "",
    shortName: "",
    tagline: "",

    logoUrl: "",
    faviconUrl: "",
    bannerImageUrl: "",

    aboutText: "",
    establishedYear: undefined,

    address: "",
    phone: "",
    email: "",
    website: "",

    mapEmbedUrl: "",

    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      twitter: "",
      linkedin: "",
    },

    heroTitle: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroButtonLink: "",

    footerDescription: "",
    copyright: "",
  });

  // Logo upload file
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Banner upload file
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Favicon upload file
  const [faviconFile, setFaviconFile] = useState<File | null>(null);  // ================= FETCH SETTINGS =================

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/settings");

      setSettings(res.data.settings);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ================= HANDLE INPUT CHANGE =================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        name === "establishedYear"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  // ================= HANDLE SOCIAL LINKS =================

  const handleSocialChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  // ================= HANDLE FILE SELECT =================

  const handleLogoChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleBannerChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleFaviconChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setFaviconFile(e.target.files[0]);
    }
  };

  // ================= UPLOAD FILE =================

  const uploadImage = async (
    file: File | null
  ): Promise<string> => {
    if (!file) return "";

    const formData = new FormData();

    formData.append("file", file);

    const res = await api.post(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.fileUrl;
  };

  // ================= SAVE SETTINGS =================

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      let logoUrl = settings.logoUrl;
      let bannerImageUrl = settings.bannerImageUrl;
      let faviconUrl = settings.faviconUrl;

      if (logoFile) {
        logoUrl = await uploadImage(logoFile);
      }

      if (bannerFile) {
        bannerImageUrl = await uploadImage(bannerFile);
      }

      if (faviconFile) {
        faviconUrl = await uploadImage(faviconFile);
      }

      await api.put("/settings", {
        ...settings,
        logoUrl,
        bannerImageUrl,
        faviconUrl,
      });

      toast.success("Settings updated successfully.");

      fetchSettings();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Site Settings
          </h1>

          <p className="text-sm text-ink-500">
            Manage your college website settings
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-maroon-600 px-6 py-2 text-white hover:bg-maroon-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* ================= COLLEGE INFORMATION ================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold">
          College Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              College Name
            </label>

            <input
              type="text"
              name="collegeName"
              value={settings.collegeName}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Short Name
            </label>

            <input
              type="text"
              name="shortName"
              value={settings.shortName}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Tagline
            </label>

            <input
              type="text"
              name="tagline"
              value={settings.tagline}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Established Year
            </label>

            <input
              type="number"
              name="establishedYear"
              value={settings.establishedYear ?? ""}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              About College
            </label>

            <textarea
              rows={6}
              name="aboutText"
              value={settings.aboutText}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

        </div>

      </div>

      {/* ================= CONTACT INFORMATION ================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold">
          Contact Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Website
            </label>

            <input
              type="text"
              name="website"
              value={settings.website}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Google Map Embed URL
            </label>

            <textarea
              rows={3}
              name="mapEmbedUrl"
              value={settings.mapEmbedUrl}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

        </div>

      </div>      {/* ================= HERO SECTION ================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold">
          Homepage Hero
        </h2>

        <div className="grid gap-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Hero Title
            </label>

            <input
              type="text"
              name="heroTitle"
              value={settings.heroTitle}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Hero Subtitle
            </label>

            <textarea
              rows={3}
              name="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Button Text
              </label>

              <input
                type="text"
                name="heroButtonText"
                value={settings.heroButtonText}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Button Link
              </label>

              <input
                type="text"
                name="heroButtonLink"
                value={settings.heroButtonLink}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

          </div>

        </div>

      </div>

      {/* ================= SOCIAL LINKS ================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold">
          Social Media
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <input
            type="text"
            name="facebook"
            placeholder="Facebook URL"
            value={settings.socialLinks.facebook}
            onChange={handleSocialChange}
            className="rounded-md border px-3 py-2"
          />

          <input
            type="text"
            name="instagram"
            placeholder="Instagram URL"
            value={settings.socialLinks.instagram}
            onChange={handleSocialChange}
            className="rounded-md border px-3 py-2"
          />

          <input
            type="text"
            name="youtube"
            placeholder="YouTube URL"
            value={settings.socialLinks.youtube}
            onChange={handleSocialChange}
            className="rounded-md border px-3 py-2"
          />

          <input
            type="text"
            name="twitter"
            placeholder="Twitter URL"
            value={settings.socialLinks.twitter}
            onChange={handleSocialChange}
            className="rounded-md border px-3 py-2"
          />

          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn URL"
            value={settings.socialLinks.linkedin}
            onChange={handleSocialChange}
            className="rounded-md border px-3 py-2"
          />

        </div>

      </div>

      {/* ================= IMAGES ================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold">
          Images
        </h2>

        <div className="grid gap-8 md:grid-cols-3">

          {/* Logo */}

          <div>

            <label className="mb-2 block font-medium">
              Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />

            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="mt-4 h-24 rounded border object-contain"
              />
            )}

          </div>

          {/* Banner */}

          <div>

            <label className="mb-2 block font-medium">
              Banner
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
            />

            {settings.bannerImageUrl && (
              <img
                src={settings.bannerImageUrl}
                alt="Banner"
                className="mt-4 h-28 w-full rounded border object-cover"
              />
            )}

          </div>

          {/* Favicon */}

          <div>

            <label className="mb-2 block font-medium">
              Favicon
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFaviconChange}
            />

            {settings.faviconUrl && (
              <img
                src={settings.faviconUrl}
                alt="Favicon"
                className="mt-4 h-16 w-16 rounded border object-contain"
              />
            )}

          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold">
          Footer
        </h2>

        <div className="grid gap-5">

          <textarea
            rows={4}
            name="footerDescription"
            placeholder="Footer Description"
            value={settings.footerDescription}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          />

          <input
            type="text"
            name="copyright"
            placeholder="Copyright"
            value={settings.copyright}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          />

        </div>

      </div>

    </form>
  );
}