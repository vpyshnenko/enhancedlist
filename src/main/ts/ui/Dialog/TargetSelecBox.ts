import { SugarElement, SelectorFilter } from "@ephox/sugar";
import { Arr, Optional } from "@ephox/katamari";
import { ListSel } from "../../core/ListStyleTypes";
import { TargetType } from "../../core/Target";
import { Ui } from "tinymce";

const labelMap: { [key in TargetType]: string } = {
  current: "Current list",
  parent: "Current and parent lists",
  children: "Current and children list",
  all: "All lists",
};

const getSelectBoxItems = (
  currentListElm: SugarElement<Element>
): TargetType[] => {
  const hasAncestors =
    SelectorFilter.ancestors(currentListElm, ListSel).length > 0;
  const hasDescendants =
    SelectorFilter.descendants(currentListElm, ListSel).length > 0;
  return Arr.flatten([
    ["current"],
    hasAncestors ? ["parent"] : [],
    hasDescendants ? ["children"] : [],
    hasAncestors && hasDescendants ? ["all"] : [],
  ]);
};

const getTargetSelectBoxSettings = (
  currentList: Optional<SugarElement<Element>>
): Ui.Dialog.SelectBoxSpec[] =>
  currentList
    .map(getSelectBoxItems)
    .filter((selectBoxItems) => selectBoxItems.length > 1)
    .map<Ui.Dialog.SelectBoxSpec>((selectBoxItems) => {
      return {
        type: "selectbox",
        name: "target",
        label: "Apply styles only to",
        items: Arr.map(selectBoxItems, (value) => ({
          value,
          text: labelMap[value],
        })),
      };
    })
    .toArray();

export { getTargetSelectBoxSettings };
