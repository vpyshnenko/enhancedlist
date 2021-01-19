import {
  ApproxStructure,
  Assertions,
  Pipeline,
  Log,
  GeneralSteps,
  Step,
  Chain,
  UiFinder,
} from "@ephox/agar";
import { TinyLoader, TinyApis, TinyUi } from "@ephox/mcagar";
import { UnitTest } from "@ephox/bedrock-client";
import Plugin from "../../../main/ts/Plugin";
import { SugarElement, SugarBody, Value, Focus } from "@ephox/sugar";
import { TargetType } from "src/main/ts/core/Target";

/*
  Test assigned to check correctness of style application to appropiate target from List Settings Dialog

  Initially editor content contains three nested lists:
  - highest one with disc bullet
  - middle one with circle bullet
  - deepest one with square bullet

  Cursor set to middle list content: before 'B' character

  Then user open List settings dialog, that picks up styles of middle list (circle bullet)

  Then user set target value on Target select box:
  - current => content will be unchanged
  - children => middle and deepest lists should have circle bullets
  - parent => highest and middle lists should have circle bullets
  - all => all lists should have circle bullets
  

*/

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

      const cFakeEvent = (name: string) =>
        Chain.op(function (elm: SugarElement) {
          const evt = document.createEvent("HTMLEvents");
          evt.initEvent(name, true, true);
          elm.dom.dispatchEvent(evt);
        });
      const cSetSelectValue = (value: string) =>
        Chain.fromChains([
          UiFinder.cFindIn(`${targetSelectBox} select`),
          Chain.op(Focus.focus),
          Chain.op((selectEl) => Value.set(selectEl, value)),
          cFakeEvent("change"),
        ]);

      const sSetTargetValue = (value: TargetType) =>
        GeneralSteps.sequence([
          tinyApis.sSetContent(
            "<ul style='list-style-type: disc;'><li>A<ul style='list-style-type: circle;'><li>B<ul style='list-style-type: square;'><li>C</li></ul></li></ul></li></ul>"
          ),
          tinyApis.sSetCursor([0, 0, 1, 0], 0), //set cursor to B
          sClickToolbarBtn(),
          Chain.asStep(body, [
            tinyUi.cWaitForPopup(
              "Wait for List style settings dialog",
              ".tox-dialog"
            ),
            Chain.fromIsolatedChains([cSetSelectValue(value)]),
            tinyUi.cSubmitDialog(),
          ]),
        ]);

      const sAssertStructure = ([aBullet, bBullet, cBullet]: string[]) =>
        Step.sync(() => {
          Assertions.assertStructure(
            "three nested list with appropriate bullet styles",
            ApproxStructure.build((s, str, arr) =>
              s.element("ul", {
                styles: {
                  "list-style-type": str.is(aBullet),
                },
                children: [
                  s.element("li", {
                    children: [
                      s.text(str.is("A")),
                      s.element("ul", {
                        styles: {
                          "list-style-type": str.is(bBullet),
                        },
                        children: [
                          s.element("li", {
                            children: [
                              s.text(str.is("B")),
                              s.element("ul", {
                                styles: {
                                  "list-style-type": str.is(cBullet),
                                },
                                children: [
                                  s.element("li", {
                                    children: [s.text(str.is("C"))],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              })
            ),
            SugarElement.fromDom(editor.getBody().firstChild)
          );
        });
      Pipeline.async(
        {},
        [
          Log.step(
            "TBA",
            "",
            GeneralSteps.sequence([
              sSetTargetValue("current"),
              sAssertStructure(["disc", "circle", "square"]),
              sSetTargetValue("children"),
              sAssertStructure(["disc", "circle", "circle"]),
              sSetTargetValue("parent"),
              sAssertStructure(["circle", "circle", "square"]),
              sSetTargetValue("all"),
              sAssertStructure(["circle", "circle", "circle"]),
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
