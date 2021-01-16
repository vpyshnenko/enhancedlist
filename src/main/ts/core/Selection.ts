import { Editor } from "tinymce";
import { Arr, Optional } from "@ephox/katamari";
import { SelectorFilter, SugarElement, SelectorFind } from "@ephox/sugar";
import {TargetType} from './Target'

const getParentList = (editor: Editor, listSel: string) =>
  Optional.from(editor.selection.getStart(true))
    .map(SugarElement.fromDom)
    .bind((elm) => SelectorFind.closest(elm, listSel));

const selectTarget = (
  target: TargetType,
  currentList: Optional<SugarElement<Element>>,
  editor: Editor,
  listSel: string
): void => {
  const rng = editor.selection.getRng();
  currentList
    .bind((elm) => Arr.last(SelectorFilter.ancestors(elm, listSel)))
    .map((root) => {
      if (target == "parent" || target == "all") {
        rng.setStartBefore(root.dom);
      }
    });
  currentList
    .bind((elm) => Arr.last(SelectorFilter.descendants(elm, listSel)))
    .map((lastChild) => {
      if (target == "children" || target == "all") {
        rng.setEndAfter(lastChild.dom);
      }
    });
};

export { getParentList, selectTarget };
