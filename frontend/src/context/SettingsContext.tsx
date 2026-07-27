import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "../lib/api";
import { SiteSettings } from "../types";

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Default PKMC settings
const defaultSettings: SiteSettings = {
  collegeName: "Padma Kanya Multiple Campus",
  shortName: "PKMC",
  tagline: "Excellence in education, character, and community.",
  address: "Setais, Kathmandu, Nepal",
  phone: "01-0000000",
  email: "info@pkmc.edu.np",
  logoUrl: "/logo.png",
};

export const SettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const { data } = await api.get("/settings");

      if (data.settings) {
        // Merge backend settings with defaults
        setSettings({
          ...defaultSettings,
          ...data.settings,
        });
      } else {
        setSettings(defaultSettings);
      }
    } catch (err) {
      console.error(
        "Failed to load settings, using default PKMC settings",
        err
      );

      // Keep PKMC defaults if API fails
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, isLoading, refreshSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error(
      "useSettings must be used within a SettingsProvider"
    );
  }

  return ctx;
};