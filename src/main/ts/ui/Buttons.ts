import { Arr } from "@ephox/katamari";
import { Editor, Ui } from "tinymce";
import * as Dialog from "./Dialog/Main";
import { bulletStyles, numberStyles, commonStyles, styleValueToText } from "../core/ListStyleTypes";

const enum ListType {
  OrderedList = "OL",
  UnorderedList = "UL",
}

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

const register = (editor: Editor) => {
  editor.ui.registry.addButton("enhlist", {
    tooltip: "List style settings",
    icon: "toc",
    onAction: () => {
      Dialog.open(editor);
    },
  });
  addSplitButton(
    editor,
    "enumlist",
    "Numbered list",
    "InsertOrderedList",
    ListType.OrderedList,
    [...numberStyles, ...commonStyles]
  );
  addSplitButton(
    editor,
    "ebullist",
    "Bullet list",
    "InsertUnorderedList",
    ListType.UnorderedList,
    [...bulletStyles, ...commonStyles]
  );
};

export { register };
