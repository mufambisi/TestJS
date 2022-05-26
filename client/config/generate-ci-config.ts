import fs from "fs";
import { getAppId, getManifestList } from "./utils";

let config = `s3_publish_overrides:
  "${getAppId()}.metadata.json":
    "cache-control": "no-cache,max-age=0,public"`;

getManifestList().forEach((fileNameMatch) => {
  config = config.concat(`
  "${fileNameMatch[0]}":
    "cache-control": "no-cache,max-age=0,public"`);
});

fs.mkdirSync("./dist/config", { recursive: true });
fs.writeFileSync("./dist/config/ci_config.yaml", config);
