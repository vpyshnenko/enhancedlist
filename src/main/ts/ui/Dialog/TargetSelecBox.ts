import { SugarElement, SelectorFilter } from "@ephox/sugar";
import { Arr, Optional } from "@ephox/katamari";
import { ListSel } from "../ListStyleTypes";

type TargetType = "current" | "parent" | "children" | "all";
type TargetLabelMapType = {
  [key in TargetType]: string;
};

const targetLabelMap: TargetLabelMapType = {
  current: "Current list",
  parent: "Current and parent lists",
  children: "Current and children list",
  all: "All lists",
};

const getTargetSelectBoxSettings = (
  currentList: Optional<SugarElement<Element>>
) => {
  const targetItems: TargetType[] = ["current"];
  currentList
    .map((elm) => [
      SelectorFilter.ancestors(elm, ListSel),
      SelectorFilter.descendants(elm, ListSel),
    ])
    .map(([ancestors, descendants]) => {
      if (ancestors.length > 0) {
        targetItems.push("parent");
      }
      if (descendants.length > 0) {
        targetItems.push("children");
      }
      if (ancestors.length > 0 && descendants.length > 0) {
        targetItems.push("all");
      }
    });

  const targetSelectBoxSettings =
    targetItems.length > 1
      ? [
          {
            type: "selectbox",
            name: "target",
            label: "Apply styles only to",
            items: Arr.map(targetItems, (v) => ({
              value: v,
              text: targetLabelMap[v],
            })),
          },
        ]
      : [];
  return targetSelectBoxSettings;
};

export { getTargetSelectBoxSettings };
