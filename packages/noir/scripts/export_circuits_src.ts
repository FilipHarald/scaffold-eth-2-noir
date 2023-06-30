//import initWasm, { compile } from "@noir-lang/noir_wasm";
import { compile } from "@noir-lang/noir_wasm";
import { initialiseResolver } from "@noir-lang/noir-source-resolver";

import path from "path";
import { readFileSync, writeFileSync } from "fs";

const TARGET_FILE = "../nextjs/generated/circuits.json";
const CIRCUIT_PATH = "./circuits/src";
const CIRCUIT_ROOTS = ["main.nr"];

function fileResolverCallback(id: string) {
  try {
    console.log("🤓 trying to read circuit: ", id);
    const code = readFileSync(CIRCUIT_PATH + id, "utf8") as string;
    return code;
  } catch (err) {
    console.error("❌ error when reading file: ", id);
    throw err;
  }
}

async function exportAsJson() {
  initialiseResolver(fileResolverCallback);
  //initWasm();
  const data: any = {};
  try {
    for (const fileName of CIRCUIT_ROOTS) {
      data[fileName] = await compile({
        entry_point: fileName,
      });
      console.log(JSON.stringify(data[fileName]));
    }
  } catch (err) {
    console.error("Error while compiling:", (err as Error).stack);
  }
  writeFileSync(path.resolve(TARGET_FILE), JSON.stringify(data, null, 2));
}

exportAsJson();
