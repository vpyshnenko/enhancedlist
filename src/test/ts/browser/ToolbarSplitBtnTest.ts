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
import { SugarBody } from "@ephox/sugar";

UnitTest.asynctest("browser.ToolbarSplitBtnTest", (success, failure) => {
  Plugin();
  const body = SugarBody.body();
  TinyLoader.setup(
    (editor, onSuccess, onFailure) => {
      const tinyUi = TinyUi(editor);
      const tinyApis = TinyApis(editor);

      Pipeline.async(
        {},
        [
          Log.step(
            "TBA",
            "insert num list with lower-alpha list style type",
            GeneralSteps.sequence([
              tinyUi.sClickOnToolbar(
                "click numlist split-button",
                '[aria-label="Numbered list"] > .tox-tbtn + .tox-split-button__chevron'
              ),
              Chain.asStep(body, [
                UiFinder.cWaitForVisible(
                  "Waiting for dropdown menu to appear",
                  ".tox-menu.tox-selected-menu"
                ),
                Chain.label(
                  "click Lower Alpha Style button",
                  Mouse.cClickOn(
                    "div[role='menuitemcheckbox'][title='Lower Alpha']"
                  )
                ),
              ]),
              Log.step(
                "TBA",
                "ordered list should be in content",
                tinyApis.sAssertContentPresence({
                  'ol[style*="list-style-type: lower-alpha"]': 1,
                })
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
