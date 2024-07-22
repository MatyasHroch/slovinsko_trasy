import fs from "fs";
import path from "path";

const defaultDirectory = "./src/components";
const prototypes = {};

function getVariables(textHtml) {
  const regex = /{(.*?)}/g;
  const matches = textHtml.match(regex);
  return matches ? matches.map((match) => match.slice(1, -1)) : [];
}

function getHtmlFiles(directoryPath, fileList = []) {
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (path.extname(file) === ".html") {
      fileList.push(filePath);
    }
  });
  return fileList;
}

export async function loadAll(directoryPath = defaultDirectory) {
  // now look through all the files with .html extension in the directory
  const filePaths = getHtmlFiles(directoryPath);
  for (const path of filePaths) {
    const fileName = path.split("\\").pop().split(".")[0];
    try {
      const textHtml = await fs.promises.readFile(path, "utf8");
      const variables = getVariables(textHtml);
      const withSlot = textHtml.includes("<slot/>");
      prototypes[fileName] = {
        variables,
        textHtml,
      };
    } catch (error) {
      console.error(`Error reading file ${path}: ${error}`);
    }
  }
  return prototypes;
}

export function getPrototype(name) {
  if (!(name in prototypes)) {
    throw new Error(`Prototype ${name} not found`);
  }
  return prototypes[name];
}

export function getComponent(name, primitives) {
  const prototype = getPrototype(name);
  let resultString = prototype.textHtml;
  for (const variable of prototype.variables) {
    resultString = resultString.replace(`{${variable}}`, primitives[variable]);
  }
  return resultString;
}
