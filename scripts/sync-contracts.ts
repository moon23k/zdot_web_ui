import { readFileSync, writeFileSync } from "node:fs";
import { CONTRACT_COPY, CONTRACT_SOURCE, contractCopy } from "./contract-copy";

const { body, count } = contractCopy(readFileSync(CONTRACT_SOURCE, "utf8"));

if (process.argv.includes("--check")) {
  if (readFileSync(CONTRACT_COPY, "utf8") !== body) {
    console.error("src/types/contract.ts 가 계약(api.d.ts)과 다릅니다. ZDOT 에서 npm run ui:sync 로 다시 만드세요.");
    process.exit(1);
  }
  console.log(`contract.ts 일치 (${count} schemas)`);
} else {
  writeFileSync(CONTRACT_COPY, body);
  console.log(`${count} schemas`);
}
