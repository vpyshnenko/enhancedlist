import { TinyMCE } from "tinymce";
import Plugin from "../../main/ts/Plugin";

declare const tinymce: TinyMCE;

Plugin();

tinymce.init({
  selector: "textarea.tinymce",
  plugins: "code lists advlist enhlist image wordcount",
  toolbar: "numlist bullist | enhlist ebullist enumlist | code image wordcount",
  height: 500,
  advlist_number_styles: "default,lower-greek,lower-roman",
});
