import { Link, Text } from "mdast";
import { IConfig } from "@rolandwarburton/blog-common";
import { parse, resolve } from "path";

function buildReferences(config: IConfig, pathOnDist: string, nodes: Link[]) {
  // remove the filename (index.html) from the pagination so we can use it to resolve the file path
  // const paginationWithoutLastFile = pagination.slice(0, pagination.length - 1).join("/");

  let references = "## References";
  const seen: string[] = [];
  const areAt = parse(pathOnDist).dir;
  for (const node of nodes) {
    if (node.url.startsWith("https://")) continue;
    // where we want to go
    // can be relative or absolute
    const goingTo = node.url;
    // the name of the page we are going to "thing.html" needs to become "thing/index.html"
    const destinationName = parse(resolve(areAt, goingTo)).name + "/index.html";
    // the directory of the page we are navigating to
    const destinationDir = parse(resolve(areAt, goingTo)).dir;
    // construct the path to the page we are going to
    // removing the base url if it exists in the resolved url
    const destinationFull = resolve(destinationDir, destinationName).replace(
      config.blogConfig.root,
      ""
    );

    // construct the children if it exists
    // double parse exists here because we need to pop /file/index.html -> /file
    if (seen.findIndex((s) => s === destinationFull) === -1)
      references += `\n- [${parse(parse(destinationFull).dir).name}](${destinationFull})`;
    seen.push(destinationFull);
  }
  return references.length === 13 ? "" : references;
}

export { buildReferences };
