import { Parent } from "mdast";

interface TraverseNodesParams<T> {
  node: Parent;
  nodeOfType: string;
  cb: (node: T) => void;
}

function traverseNodes<T>({ node, nodeOfType, cb }: TraverseNodesParams<T>): void {
  // check this nodes type
  if (node.type === nodeOfType) {
    cb(node as unknown as T);
  }

  // if there are children on this node, then we need to traverseNodes them as well
  if (node.children) {
    node.children.forEach((child: any) => {
      // the callback will make this recursive by providing traverseNodes with the ability
      // to call traverseNextNodes on the child node once it is done
      traverseNodes({ node: child, nodeOfType, cb });
    });
  }
}

export { traverseNodes };
