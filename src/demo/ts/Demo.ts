import { TinyMCE } from "tinymce";
import Plugin from "../../main/ts/Plugin";

declare const tinymce: TinyMCE;

Plugin();

tinymce.init({
  selector: "textarea.tinymce",
  plugins: "code lists advlist enhlist image",
  toolbar: "numlist bullist | enhlist ebullist enumlist | code image",
  height: 500,
  advlist_number_styles: "default,lower-greek,lower-roman",
});
