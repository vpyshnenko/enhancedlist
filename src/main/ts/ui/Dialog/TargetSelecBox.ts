import { SugarElement, SelectorFilter } from "@ephox/sugar";
import { Optional } from "@ephox/katamari";

// {
//   type: "selectbox",
//   name: "target",
//   label: "Apply styles only to",
//   items: [
//     { value: "current", text: "Current list" },
//     { value: "parent", text: "Current and parent lists" },
//     { value: "children", text: "Current and children lists" },
//     { value: "all", text: "All lists" },
//   ],
// }

type TargetType = "current" | "parent" | "children" | "all";
type TargetMapType = {
  [key in TargetType]: string;
};

const targetMap: TargetMapType = {
  current: "Current list",
  parent: "Current and parent lists",
  children: "Current and children list",
  all: "All lists",
};
console.log("current", targetMap.current);
const getTargetSelectBoxSettings = (
  currentList: Optional<SugarElement<Element>>
) => {
  const targetItems = [{ value: "current", text: "Current list" }];
  currentList
    .map((elm) => [
      SelectorFilter.ancestors(elm, "ol,ul"),
      SelectorFilter.descendants(elm, "ol,ul"),
    ])
    .map(([ancestors, descendants]) => {
      if (ancestors.length > 0) {
        targetItems.push({ value: "parent", text: "Current and parent lists" });
      }
      if (descendants.length > 0) {
        targetItems.push({
          value: "children",
          text: "Current and children lists",
        });
      }
      if (ancestors.length > 0 && descendants.length > 0) {
        targetItems.push({ value: "all", text: "All lists" });
      }
    });

  const targetSelectBoxSettings =
    targetItems.length > 1
      ? [
          {
            type: "selectbox",
            name: "target",
            label: "Apply styles only to",
            items: targetItems,
          },
        ]
      : [];
  return targetSelectBoxSettings;
};

export { getTargetSelectBoxSettings };
