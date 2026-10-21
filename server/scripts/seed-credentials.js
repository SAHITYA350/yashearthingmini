import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";

const DEFAULT_PW = "Yash@Test123";

const ROLES_TO_ENSURE = [
  {
    email: "admin@yash.test",
    name: "System Administrator",
    role: "ADMIN",
    department: "Administration",
    designation: "Chief Administrator"
  },
  {
    email: "sales@yash.test",
    name: "Priya Mehta",
    role: "SALES_MANAGER",
    department: "Sales",
    designation: "Sales Manager"
  },
  {
    email: "engineer@yashgroup.com",
    name: "Er. Rajesh Sharma",
    role: "ENGINEER",
    department: "Engineering",
    designation: "Chief Technical Engineer"
  },
  {
    email: "procurement@yashgroup.com",
    name: "Vikram Malhotra",
    role: "PROCUREMENT_OFFICER",
    department: "Procurement",
    designation: "Procurement Lead"
  },
  {
    email: "operations@yashgroup.com",
    name: "Sunil Verma",
    role: "PROJECT_MANAGER",
    department: "Operations",
    designation: "Field Project Operations Manager"
  },
  {
    email: "finance@yash.test",
    name: "Arun Deshmukh",
    role: "FINANCE_MANAGER",
    department: "Finance",
    designation: "Finance & Accounts Head"
  },
  {
    email: "accountant@yash.test",
    name: "Neha Joshi",
    role: "BANK_OFFICE_EXECUTIVE",
    department: "Finance",
    designation: "Senior Accountant"
  },
  {
    email: "viewer@yash.test",
    name: "Audit Viewer",
    role: "BACK_OFFICER",
    department: "Audit",
    designation: "Compliance Auditor"
  }
];

async function main() {
  console.log("Setting up standard credentials across all roles with password: " + DEFAULT_PW);
  const hash = await bcrypt.hash(DEFAULT_PW, 10);

  for (const u of ROLES_TO_ENSURE) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: u.name,
          role: u.role,
          department: u.department,
          designation: u.designation,
          passwordHash: hash,
          isActive: true
        }
      });
      console.log(`Updated user: ${u.email} (${u.role})`);
    } else {
      await prisma.user.create({
        data: {
          email: u.email,
          name: u.name,
          role: u.role,
          department: u.department,
          designation: u.designation,
          passwordHash: hash,
          isActive: true
        }
      });
      console.log(`Created user: ${u.email} (${u.role})`);
    }
  }

  console.log("All user credentials initialized successfully!");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
