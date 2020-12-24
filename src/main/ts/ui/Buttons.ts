import { Arr } from "@ephox/katamari";
import { bulletStyles, numberStyles } from "./ListStyleTypes";
import { Editor, Ui } from "tinymce";
// import { Menu } from "tinymce/core/api/ui/Ui";

const enum ListType {
  OrderedList = "OL",
  UnorderedList = "UL",
}

// <ListStyles>
const styleValueToText = (styleValue) => {
  return styleValue.replace(/\-/g, " ").replace(/\b\w/g, (chr) => {
    return chr.toUpperCase();
  });
};

const addSplitButton = (
  editor: Editor,
  id: string,
  tooltip: string,
  cmd: string,
  nodeName: ListType,
  styles: string[]
) => {
  editor.ui.registry.addSplitButton(id, {
    tooltip,
    icon: nodeName === ListType.OrderedList ? "ordered-list" : "unordered-list",
    presets: "listpreview",
    columns: 3,
    fetch: (callback) => {
      const items = Arr.map(
        styles,
        (styleValue): Ui.Menu.ChoiceMenuItemSpec => {
          const iconStyle = nodeName === ListType.OrderedList ? "num" : "bull";
          const iconName =
            styleValue === "disc" || styleValue === "decimal"
              ? "default"
              : styleValue;
          const itemValue = styleValue === "default" ? "" : styleValue;
          const displayText = styleValueToText(styleValue);
          return {
            type: "choiceitem",
            value: itemValue,
            icon: "list-" + iconStyle + "-" + iconName,
            text: displayText,
          };
        }
      );
      callback(items);
    },
    onAction: () => editor.execCommand(cmd),
    onItemAction: (_splitButtonApi, value) => {
      const cmd =
        nodeName === ListType.OrderedList
          ? "ApplyOrderedListStyle"
          : "ApplyUnorderedListStyle";
      editor.execCommand(cmd, false, {
        "list-style-type": value,
      });
    },
  });
};

const register = (editor) => {
  addSplitButton(
    editor,
    "enumlist",
    "Numbered list",
    "InsertOrderedList",
    ListType.OrderedList,
    numberStyles
  );
  addSplitButton(
    editor,
    "ebullist",
    "Bullet list",
    "InsertUnorderedList",
    ListType.UnorderedList,
    bulletStyles
  );
};

export { register };
