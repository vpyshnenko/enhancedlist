import {
  Pipeline,
  Log,
  GeneralSteps,
  Chain,
  UiFinder,
  Mouse,
} from "@ephox/agar";
import { TinyLoader, TinyApis, TinyUi } from "@ephox/mcagar";
import { UnitTest } from "@ephox/bedrock-client";
import Plugin from "../../../main/ts/Plugin";
import { SugarElement, SugarBody, TextContent } from "@ephox/sugar";
import { Arr } from "@ephox/katamari";

/*
  List Style Setting Dialog consists of a three field:
  - List style type selectbox;
  - Indent size text input field
  - Target selectbox of ['Current list', 'Current and ascendant lists', 'Current and descendant lists', 'All lists' ] (specifies )

  Third field has to be appear only if currently selected list has parent or child (or both) lists
*/

const [current, ascendants, descendants, all] = [
  "Current list",
  "Current and parent lists",
  "Current and children list",
  "All lists",
];
const targetSelectBox =
  ".tox-label:contains(Apply styles only to) + .tox-selectfield";

UnitTest.asynctest("browser.TargetSelectBoxTest", (success, failure) => {
  Plugin();
  const body = SugarBody.body();
  TinyLoader.setup(
    (editor, onSuccess, onFailure) => {
      const tinyUi = TinyUi(editor);
      const tinyApis = TinyApis(editor);

      const sClickToolbarBtn = () =>
        tinyUi.sClickOnToolbar(
          "click List style settings toolbar button",
          '[aria-label="List style settings"]'
        );

      const cClickCancel = () =>
        Mouse.cClickOn("button.tox-button:contains(Cancel)");

      const sNoTargetSelectBox = () =>
        GeneralSteps.sequence([
          sClickToolbarBtn(),
          Chain.asStep(body, [
            tinyUi.cWaitForPopup(
              "Wait for List style settings dialog",
              ".tox-dialog"
            ),
            UiFinder.cNotExists(targetSelectBox),
            cClickCancel(),
          ]),
        ]);

      const cTargetItemsMatch = (expectedItems: string[]) =>
        GeneralSteps.sequence([
          sClickToolbarBtn(),
          Chain.asStep(body, [
            tinyUi.cWaitForPopup(
              "Wait for List style settings dialog",
              ".tox-dialog"
            ),
            Chain.fromIsolatedChains([
              UiFinder.cFindAllIn(`${targetSelectBox} option`),
              Chain.predicate((options: SugarElement[]) =>
                Arr.equal(Arr.map(options, TextContent.get), expectedItems)
              ),
            ]),
            cClickCancel(),
          ]),
        ]);

      Pipeline.async(
        {},
        [
          Log.step(
            "TBA",
            "Target selectbox items are affected by selected list content",
            GeneralSteps.sequence([
              Log.stepsAsStep(
                "TBA",
                "If editor has no content then Dialog should not contain Target selectbox",
                [tinyApis.sFocus(), sNoTargetSelectBox()]
              ),
              Log.stepsAsStep(
                "TBA",
                "if selection within non-nested list then Dialog should not contain Target selectbox",
                [
                  tinyApis.sSetContent("<ul><li>A</li></ul>"),
                  tinyApis.sSetCursor([0, 0], 0), // set cursor to A
                  sNoTargetSelectBox(),
                ]
              ),

              tinyApis.sSetContent(
                "<ul><li>A<ul><li>B<ul><li>C</li></ul></li></ul></li></ul>"
              ),
              Log.stepsAsStep(
                "TBA",
                "if selected list has descendant nested lists then Target selectbox should contains ['Current list','Current and children list ] options",
                [
                  tinyApis.sSetCursor([0, 0], 0), // set cursor to A
                  cTargetItemsMatch([current, descendants]),
                ]
              ),

              Log.stepsAsStep(
                "TBA",
                "if selected list has parent and children list then Target selectbox should contains all possible options",
                [
                  tinyApis.sSetCursor([0, 0, 1, 0], 0), //set cursor to B
                  cTargetItemsMatch([current, ascendants, descendants, all]),
                ]
              ),

              Log.stepsAsStep(
                "TBA",
                "if selected list has ascendant parent lists then Target selectbox should contains ['Current list','Current and parent list ] options",
                [
                  tinyApis.sSetCursor([0, 0, 1, 0, 1, 0], 0), // set cursor to C
                  cTargetItemsMatch([current, ascendants]),
                ]
              ),
            ])
          ),
        ],
        onSuccess,
        onFailure
      );
    },
    {
      plugins: "lists advlist enhlist",
      toolbar: "enhlist ebullist enumlist",
    },
    success,
    failure
  );
});
