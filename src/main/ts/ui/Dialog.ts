import { Editor } from "tinymce";
import { getParentList } from "../core/Selection";
import { getListStyleTypeItems, isOrderedListType } from "./ListStyleTypes";

const open = (editor: Editor) => {
  const dom = editor.dom;

  const currentList = getParentList(editor);

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
        {
          type: "selectbox",
          name: "target",
          label: "Apply styles only to",
          items: [
            { value: "current", text: "Current list" },
            { value: "parent", text: "Current and parent lists" },
            { value: "children", text: "Current and children lists" },
            { value: "all", text: "All lists" },
          ],
        },
      ],
    },
    initialData: {
      listStyleType: currentList
        ? dom.getStyle(currentList, "list-style-type", true)
        : "disc",
      indent:
        currentList && currentList.firstElementChild
          ? dom.getStyle(currentList.firstElementChild, "padding-left")
          : "",
    },
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
      const { listStyleType, indent } = api.getData();
      const cmd = isOrderedListType(listStyleType)
        ? "InsertOrderedList"
        : "InsertUnorderedList";
      const params = { "list-style-type": listStyleType };
      if (indent.length > 0) {
        params["list-item-attributes"] = { style: `padding-left: ${indent}` };
      }
      editor.execCommand(cmd, false, params);
      api.close();
    },
  });
};

export { open };
