import { Editor } from "tinymce";
import { getParentList, selectTarget } from "../../core/Selection";
import { getInitialData } from "./InitialData";
import { getTargetSelectBoxSettings } from "./TargetSelecBox";
import {
  listStyleTypeItems,
  isOrderedListType,
  ListSel,
} from "../../core/ListStyleTypes";

const open = (editor: Editor) => {
  const currentList = getParentList(editor, ListSel);

  editor.windowManager.open({
    title: "List style settings",
    body: {
      type: "panel",
      items: [
        {
          type: "selectbox",
          name: "listStyleType",
          label: "List style type",
          items: listStyleTypeItems,
        },
        {
          type: "input",
          name: "indent",
          label: "Indent size",
        },
        ...getTargetSelectBoxSettings(currentList),
      ],
    },
    initialData: getInitialData(currentList),
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
      const params = {
        "list-style-type": listStyleType,
        ...getListItemAttrs(indent),
      };
      const bmark = editor.selection.getBookmark();
      selectTarget(target, currentList, editor, ListSel);
      editor.execCommand(cmd, false, params);
      editor.selection.moveToBookmark(bmark);
      api.close();
    },
  });
};

const getListItemAttrs = (indent: string) =>
  indent.length > 0
    ? {
        "list-item-attributes": { style: `padding-left: ${indent}` },
      }
    : {};

export { open };
