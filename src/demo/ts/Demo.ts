import Plugin from "../../main/ts/Plugin";

declare let tinymce: any;

Plugin();

tinymce.init({
  selector: "textarea.tinymce",
  plugins: "code lists advlist enhlist",
  toolbar: "numlist bullist | enhlist ebullist enumlist | code",
  height: 500,
});
