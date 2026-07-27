import { Schema, model, Document } from "mongoose";

export interface ISiteSettings extends Document {
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

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    collegeName: {
      type: String,
      default: "Padma Kanya Multiple Campus",
    },

    shortName: {
      type: String,
      default: "PKMC",
    },

    tagline: {
      type: String,
      default: "Excellence in Education",
    },

    logoUrl: {
      type: String,
      default: "",
    },

    faviconUrl: {
      type: String,
      default: "",
    },

    bannerImageUrl: {
      type: String,
      default: "",
    },

    aboutText: {
      type: String,
      default: "",
    },

    establishedYear: Number,

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    mapEmbedUrl: {
      type: String,
      default: "",
    },

    socialLinks: {
      facebook: {
        type: String,
        default: "",
      },

      instagram: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },
    },

    heroTitle: {
      type: String,
      default: "",
    },

    heroSubtitle: {
      type: String,
      default: "",
    },

    heroButtonText: {
      type: String,
      default: "",
    },

    heroButtonLink: {
      type: String,
      default: "",
    },

    footerDescription: {
      type: String,
      default: "",
    },

    copyright: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = model<ISiteSettings>(
  "SiteSettings",
  siteSettingsSchema
);