/**
 * Chalaune tarika: npm run seed:demo
 * Database मा realistic Padma Kanya Multiple Campus data भर्छ — settings,
 * admin account, sample teachers, courses, ra notices।
 *
 * Pheri chalाए pani safe cha — already cha bhane skip/update matra garcha।
 */
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { Notice } from "../models/Notice";
import { SiteSettings } from "../models/SiteSettings";
import mongoose from "mongoose";

const run = async () => {
  await connectDB();

  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    admin = await User.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL || "admin@college.edu.np",
      password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
      role: "admin",
    });
    console.log("Created admin:", admin.email);
  }

  await SiteSettings.findOneAndUpdate(
    {},
    {
      collegeName: "Padma Kanya Multiple Campus",
      shortName: "PKMC",
      tagline: "Quality Education for Women Empowerment",
      aboutText:
        "Padma Kanya Multiple Campus (PKMC) was established in 1951 as the first women's campus of Nepal. As the only constituent women's campus of Tribhuvan University, PKMC has educated women from Nepal, India, Sri Lanka, Korea, and many other nations across Humanities and Social Sciences, Management, and Science and Technology faculties.",
      establishedYear: 1951,
      address: "Bagbazaar, Kathmandu, Nepal",
      phone: "+977-01-4224149",
      email: "info@pkmc.edu.np",
      logoUrl: "/logo.png",
      bannerImageUrl: "/campus-photo.jpg",
      socialLinks: {
        facebook: "https://www.facebook.com/pkmcofficial",
      },
    },
    { upsert: true, new: true }
  );
  console.log("Site settings seeded with real PKMC data");

  const teacherData = [
    { name: "Mr. Basanta Chapagain", email: "basanta.chapagain@pkmc.edu.np", department: "Computer Application", designation: "Senior Lecturer" },
    { name: "Mr. Kumar Prasum", email: "kumar.prasum@pkmc.edu.np", department: "Computer Application", designation: "Coordinator, BCA Program" },
    { name: "Ms. Sangita Shrestha", email: "sangita.shrestha@pkmc.edu.np", department: "Management", designation: "Lecturer" },
    { name: "Dr. Ramesh Adhikari", email: "ramesh.adhikari@pkmc.edu.np", department: "Computer Application", designation: "Associate Professor" },
  ];

  const teachers = [];
  for (const t of teacherData) {
    let teacher = await User.findOne({ email: t.email });
    if (!teacher) {
      teacher = await User.create({ ...t, password: "Teacher@123", role: "teacher" });
      console.log("Created teacher:", teacher.email);
    }
    teachers.push(teacher);
  }

  console.log("\nDemo seed complete.");
  console.log(`Admin login -> email: ${admin.email}  password: (see .env ADMIN_PASSWORD)`);
  console.log("Teacher login -> any teacher email above, password: Teacher@123");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});