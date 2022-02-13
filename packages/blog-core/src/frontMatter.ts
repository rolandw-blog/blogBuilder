import { IFrontMatter } from "@rolandwarburton/blog-common";
// interface IFrontMatter {
//   [key: string]: unknown;
// }

function getFrontMatter(markdown: string) {
  const lines = markdown.split("\n");
  const hasFrontMatter = /^---$/.test(lines[0]);
  const frontMatter: IFrontMatter = {};
  let i = 1;
  if (hasFrontMatter) {
    while (!/^---$/.test(lines[i])) {
      const frontMatterValues = lines[i].split(":");
      if (frontMatterValues.length === 2) {
        const key = frontMatterValues[0].trim();
        const val = frontMatterValues[1].trim();
        frontMatter[key] = val;
        if (i >= 10) {
          console.log("Error: front matter is too long. (was there a closing tag?)");
        }
      } else {
        console.log("Error: front matter is malformed.");
      }
      i++;
    }
  }
  const spliceOffset = hasFrontMatter ? i - 1 : i - 2;
  return { frontMatter, markdown: lines.splice(i + spliceOffset, lines.length).join("\n") };
}

export { getFrontMatter };
