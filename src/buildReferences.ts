import { Link, Text } from "mdast";
import { IConfig } from "./interfaces/config.interface";
import { parse, resolve } from "path";

function buildReferences(config: IConfig, pathOnDist: string, nodes: Link[]) {
  // remove the filename (index.html) from the pagination so we can use it to resolve the file path
  // const paginationWithoutLastFile = pagination.slice(0, pagination.length - 1).join("/");

  let references = "## References";
  const areAt = parse(pathOnDist).dir;
  for (const node of nodes) {
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
    references += `\n- [${(node.children[0] as unknown as Text).value}](${destinationFull})`;
  }
  return references;
}

export { buildReferences };
