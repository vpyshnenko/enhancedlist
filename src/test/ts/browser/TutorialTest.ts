import { Pipeline, Chain, UiFinder, Mouse, Guard } from "@ephox/agar";
import { TinyLoader } from "@ephox/mcagar";
import { UnitTest } from "@ephox/bedrock-client";
import { SugarElement } from "@ephox/sugar";

UnitTest.asynctest("tutorial example 1", (success, failure) => {
  TinyLoader.setup(
    (editor, onSuccess, onFailure) => {
      const body = SugarElement.fromDom(document.body);
      Pipeline.async(
        {},
        [
          // Inject as the first input: body
          Chain.asStep(body, [
            // Input: > container, output: visible element
            UiFinder.cWaitForVisible(
              "Waiting for editor to be visible",
              ".tox.tox-tinymce"
            ),
            Mouse.cClickOn("button.tox-tbtn"),
            Chain.inject(body),
            UiFinder.cWaitForVisible(
              "Waiting for dialog to be visible",
              ".tox-dialog"
            ),
            Mouse.cClickOn("button.tox-button:contains(Cancel)"),
            Chain.inject(body),
            Chain.op((v) => console.log("hello", v)),
            Chain.control(
              UiFinder.cFindIn(".tox-dialog"),
              Guard.tryUntilNot(
                "Keep going until the dialog is not in the DOM",
                100,
                1000
              )
            ),
          ]),
        ],
        onSuccess,
        onFailure
      );
    },
    {
      theme: "silver",
      plugins: "image",
      toolbar: "image",
    },
    () => success(),
    failure
  );
});
