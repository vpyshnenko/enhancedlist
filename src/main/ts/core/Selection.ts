import { Editor } from "tinymce";

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

export { getParentList };
