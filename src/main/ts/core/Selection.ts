import { Editor } from "tinymce";
import { Arr, Optional } from "@ephox/katamari";
import { SelectorFilter, SugarElement, SelectorFind, Css } from "@ephox/sugar";

const getClosestListRootElm = (editor: Editor, elm: Node) => {
  const parentTableCell = editor.dom.getParents(elm, "TD,TH");
  const root =
    parentTableCell.length > 0 ? parentTableCell[0] : editor.getBody();

  return root;
};

const getParentList = (editor: Editor, node?: Node) => {
  const selectionStart = node || editor.selection.getStart(true);

  return editor.dom.getParent(
    selectionStart,
    "OL,UL",
    getClosestListRootElm(editor, selectionStart)
  );
};

const selectTarget = (
  target: string,
  currentList: Optional<SugarElement<Element>>,
  editor: Editor
): void => {
  const rng = editor.selection.getRng();
  currentList
    .bind((elm) => Arr.last(SelectorFilter.ancestors(elm, "ol,ul")))
    .map((root) => {
      if (target == "parent" || target == "all") {
        rng.setStartBefore(root.dom);
      }
    });
  currentList
    .bind((elm) => Arr.last(SelectorFilter.descendants(elm, "ol,ul")))
    .map((lastChild) => {
      if (target == "children" || target == "all") {
        rng.setEndAfter(lastChild.dom);
      }
    });
};

export { getParentList, selectTarget };
