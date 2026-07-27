import { User } from "../models/User";
import { SiteSettings } from "../models/SiteSettings";

/**
 * Server startup मा euta पटक चल्छ। Yedi admin account कतै छैन भने,
 * .env credentials बाट पहिलो admin account बनाउँछ, ani SiteSettings
 * document कतै छैन भने default document बनाउँछ।
 */
export const runStartupSeed = async (): Promise<void> => {
  const adminExists = await User.findOne({ role: "admin" });

  if (!adminExists) {
    const email = process.env.ADMIN_EMAIL || "admin@college.edu.np";
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const name = process.env.ADMIN_NAME || "Super Admin";

    await User.create({ name, email, password, role: "admin" });
    console.log(`Seed: created first admin account -> ${email}`);
  }

  const settingsExist = await SiteSettings.findOne();
  if (!settingsExist) {
    await SiteSettings.create({});
    console.log("Seed: created default SiteSettings document");
  }
};