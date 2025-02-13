// Matches to <em class="alt-italic">...</em>
import Quill from "quill";

const Inline = Quill.import("blots/inline");

const log = require("debug")("bobapost:styles:spoilers");

export default class InlineSpoilers extends Inline {
  static blotName = "inline-spoilers";
  static tagName = "SPAN";
  static className = "inline-spoilers";

  constructor(domNode: HTMLElement) {
    super(domNode);
    InlineSpoilers.addEventListeners(domNode);
  }

  static addEventListeners(domNode: HTMLElement) {
    domNode.addEventListener("click", (e) => {
      if (!domNode.classList.contains("visible")) {
        e.preventDefault();
      }
      log(`Changing visibility of spoilers!`);
      domNode.classList.toggle("visible");
    });
  }

  static formats(domNode: HTMLElement) {
    log(`Formatting spoilers node.`);
    super.formats(domNode);
    return true;
  }

  optimize(context: any) {
    super.optimize(context);
    let next = this;
    let adjacentSpoilers = [];
    // Get all consecutive nodes that are also "inline-spoilers"
    while (next?.domNode?.classList?.contains("inline-spoilers")) {
      adjacentSpoilers.push(next);
      next = next.next;
    }
    log(`Found ${adjacentSpoilers.length} adjacent spoiler nodes.`);
    for (let i = 1; i < adjacentSpoilers.length; i++) {
      log(`Merging node ${i + 1}`);
      adjacentSpoilers[i].moveChildren(this);
      adjacentSpoilers[i].remove();
    }
  }
}
Inline.order.push("inline-spoilers");
