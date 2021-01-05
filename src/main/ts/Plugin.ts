import { Editor, TinyMCE } from "tinymce";
import * as Buttons from "./ui/Buttons";

declare const tinymce: TinyMCE;

const Plugin = function (editor: Editor) {
  if (editor.hasPlugin("lists") && editor.hasPlugin("advlist")) {
    Buttons.register(editor);
  } else {
    // eslint-disable-next-line no-console
    console.error(
      "Please use the Lists plugin and Adnvanced List plugin together with the Enhanced List plugin."
    );
  }
};

export default function () {
  tinymce.PluginManager.add("enhlist", Plugin);
}
