import yaml from "js-yaml";
import fs from "fs";
import glob from "glob";

export const getAppId = () => {
  const microsite = fs.readFileSync("../microsite.yaml", "utf8");
  const data = yaml.safeLoad(microsite);
  return data.Config["app-id"];
};

export const getManifestList = () =>
  fs
    .readdirSync("./config")
    .map((filename) => filename.match(/(.*)\.manifest.json/))
    .filter(Boolean) as RegExpMatchArray[];

//  get the widget versions to add to the index.html
//  <meta name="app-name:dashboard-rxassets/dashboard-rx" content= ".." />
export const getWidgetVersions = () =>
  glob
    .sync(
      "node_modules/@origin-digital/?(*-widget|kraken-account)/package.json"
    )
    .map((folder) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pjson = require(`../${folder}`);
      return `${folder.split("/")[2]}: ${pjson.version}`;
    })
    .join("; ");
