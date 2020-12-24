declare const tinymce: any;

const setup = (editor, url) => {
  const openDialog = () => {
    return editor.windowManager.open({
      title: "List style settings",
      body: {
        type: "panel",
        items: [
          {
            type: "selectbox",
            name: "bulletstyle",
            label: "List bullet style",
            items: [
              { value: "circle", text: "Circle" },
              { value: "square", text: "Square" },
              { value: "disc", text: "Disc" },
              { value: "none", text: "None" },
            ],
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
      buttons: [
        {
          type: "cancel",
          text: "Close",
        },
        {
          type: "submit",
          text: "Apply",
          primary: true,
        },
      ],
      onSubmit: function (api) {
        var data = api.getData();
        tinymce.activeEditor.execCommand("InsertUnorderedList", false, {
          "list-style-type": data.bulletstyle,
          "list-item-attributes": { style: `padding-left: ${data.indent}` },
        });
        api.close();
      },
    });
  };
  editor.ui.registry.addButton("enhlist", {
    tooltip: "Enhance list style",
    icon: "toc",
    onAction: () => {
      openDialog();
    },
  });
  editor.ui.registry.addSplitButton("ebullist", {
    icon: "unordered-list",
    tooltip: "Bullet List",
    presets: "listpreview",
    columns: 3,
    onAction: function () {
      editor.insertContent("<p>You clicked the main button</p>");
    },
    onItemAction: function (api, value) {
      editor.insertContent(value);
    },
    fetch: function (callback) {
      var items = [
        {
          type: "choiceitem",
          icon: "list-bull-default",
          value: "disc",
        },
        {
          type: "choiceitem",
          icon: "list-bull-circle",
          value: "circle",
        },
        {
          type: "choiceitem",
          icon: "list-bull-square",
          value: "square",
        },
      ];
      callback(items);
    },
  });
  editor.ui.registry.addSplitButton("enumlist", {
    icon: "ordered-list",
    tooltip: "Numbered List",
    presets: "listpreview",
    columns: 3,
    onAction: function () {
      editor.insertContent("<p>You clicked the main button</p>");
    },
    onItemAction: function (api, value) {
      editor.insertContent(value);
    },
    fetch: function (callback) {
      var items = [
        {
          type: "choiceitem",
          icon: "list-num-default",
          value: "decimal",
        },
        {
          type: "choiceitem",
          icon: "list-num-lower-alpha",
          value: "lower-alpha",
        },
        {
          type: "choiceitem",
          icon: "list-num-lower-greek",
          value: "lower-greek",
        },
      ];
      callback(items);
    },
  });
};

export default () => {
  tinymce.PluginManager.add("enhlist", setup);
};
