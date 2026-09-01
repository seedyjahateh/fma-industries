/**
 * Generate the ADMIN_PASSWORD_HASH value.
 *
 *   node scripts/hash-password.mjs "the password"
 *
 * Paste the output into .env.local (and into the host's environment variables
 * when deploying). The plain password is never stored anywhere.
 */

import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "the password"');
  process.exit(1);
}

if (password.length < 12) {
  console.error(
    `That password is ${password.length} characters. Use at least 12.\n` +
      "It is the only thing between the internet and his customer list."
  );
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

console.log("\nAdd these to .env.local:\n");
console.log(`ADMIN_USERNAME=musa`);
// THE BACKSLASHES ARE LOAD-BEARING. A bcrypt hash looks like $2b$12$..., and
// the env loader expands $VAR references. Unescaped, "$2b" and "$12" resolve to
// undefined and vanish, leaving a 32-character string that can never match, and
// the only symptom is "wrong password". Quoting does not help; escaping does.
console.log(`ADMIN_PASSWORD_HASH=${hash.replaceAll("$", "\\$")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}`);
console.log(
  "\nCopy the hash line exactly, backslashes included. They stop the env loader\n" +
    "treating $2b and $12 as variables, which would silently break the login.\n" +
    "The session secret is freshly generated. Rotating it signs him out.\n"
);
