import { Chain, GeneralSteps, Log, Pipeline } from "@ephox/agar";
import { UnitTest } from "@ephox/bedrock-client";
import { ApiChains, UiChains } from "@ephox/mcagar";
import { VersionLoader } from "@tinymce/miniature";
import { Editor } from "tinymce";

UnitTest.asynctest("browser.BoldTest", (success, failure) => {
  const sTestVersion = (version: string) => {
    return VersionLoader.sSetupVersion(
      version,
      [],
      (editor: Editor) => {
        return GeneralSteps.sequence([
          Log.step(
            "TBA",
            "Test bold toolbar button",
            Chain.asStep(editor, [
              ApiChains.cSetContent(
                "<p><strong>This is a sentence with bold</strong></p>"
              ),
              ApiChains.cSetCursor([0, 0, 0], 5), // set cursor on 'is'
              UiChains.cClickOnToolbar(
                "Click on the bold toolbar button",
                'button[aria-label="Bold"]'
              ),
              ApiChains.cAssertContent(
                "<p><strong>This</strong> is <strong>a sentence with bold</strong></p>" //'is' should be unbold
              ),
              ApiChains.cSetCursor([0, 1], 2), // again put it on 'is'
              UiChains.cClickOnToolbar(
                "Click on the bold toolbar button",
                'button[aria-label="Bold"]'
              ),
              ApiChains.cAssertContent(
                "<p><strong>This is a sentence with bold</strong></p>" // 'is' should be bold
              ),
            ])
          ),
        ]);
      },
      {
        toolbar: "bold",
      }
    );
  };
  Pipeline.async(
    {},
    [
      // sTestVersion('4'),
      sTestVersion("5"),
    ],
    () => success(),
    failure
  );
});
