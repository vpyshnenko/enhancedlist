import { Editor } from "tinymce";
import { getParentList, selectTarget } from "../core/Selection";
import { getListStyleTypeItems, isOrderedListType } from "./ListStyleTypes";
// import { SugarElement, SugarDocument, Traverse, Insert,  } from '@ephox/sugar';
import { SelectorFilter, SugarElement, SelectorFind, Css } from "@ephox/sugar";
import { Optional, Fun, Arr } from "@ephox/katamari";

const open = (editor: Editor) => {
  const dom = editor.dom;
  const currentList = Optional.from(editor.selection.getStart(true))
    .map(SugarElement.fromDom)
    .bind((elm) => SelectorFind.closest(elm, "ol,ul"));
  const listStyleType = currentList.map((elm) =>
    Css.get(elm, "list-style-type")
  );
  const indent = currentList
    .bind((elm) => SelectorFind.child(elm, "li[style*='padding-left']"))
    .map((elm) => Css.get(elm, "padding-left"));
  const initialData = Arr.foldl(
    [{ listStyleType }, { indent }],
    (acc, item) => {
      const [prop, opt] = Object.entries(item)[0];
      opt.fold(Fun.noop, (v) => (acc[prop] = v));
      return acc;
    },
    {}
  );
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
  editor.windowManager.open({
    title: "List style settings",
    body: {
      type: "panel",
      items: [
        {
          type: "selectbox",
          name: "listStyleType",
          label: "List style type",
          items: getListStyleTypeItems(),
        },
        {
          type: "input",
          name: "indent",
          label: "Indent size",
        },
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
        // },
        ...targetSelectBoxSettings,
      ],
    },
    initialData,
    // initialData: {
    //   listStyleType: currentList
    //     ? dom.getStyle(currentList, "list-style-type", true)
    //     : "disc",
    //   indent:
    //     currentList && currentList.firstElementChild
    //       ? dom.getStyle(currentList.firstElementChild, "padding-left")
    //       : "",
    // },
    buttons: [
      {
        type: "cancel",
        name: "cancel",
        text: "Cancel",
      },
      {
        type: "submit",
        name: "save",
        text: "Save",
        primary: true,
      },
    ],
    onSubmit: (api) => {
      const { listStyleType, indent, target } = api.getData();
      const cmd = isOrderedListType(listStyleType)
        ? "InsertOrderedList"
        : "InsertUnorderedList";
      const params = { "list-style-type": listStyleType };
      if (indent.length > 0) {
        params["list-item-attributes"] = { style: `padding-left: ${indent}` };
      }
      const bmark = editor.selection.getBookmark();
      selectTarget(target, currentList, editor);
      editor.execCommand(cmd, false, params);
      editor.selection.moveToBookmark(bmark);
      api.close();
    },
  });
};

export { open };
