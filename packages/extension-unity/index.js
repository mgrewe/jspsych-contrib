var jsPsychUnityExtension = (function (jspsych) {
  "use strict";

  /**
   * **UNITY EXTENSION**
   *
   * This extension provides a way to
   *
   * @author YOUR NAME
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class UnityExtension {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    async initialize(params) {
      this.script = document.createElement("script");
      this.script.src = params["loaderUrl"];

      this.div = document.createElement("div");
      this.div.id = "unity-container";
      this.div.hidden = true;

      this.canvas = document.createElement("canvas");
      this.canvas.id = "unity-canvas";
      this.canvas.style.width = params["width"];
      this.canvas.style.height = params["height"];

      this.div.appendChild(this.canvas);
      document.body.appendChild(this.div);
      document.head.appendChild(this.script);

      // this.jsPsych.addFinishExperimentCallback(()=>{
      //   this.closeUnity();
      // });

      this.myGameInstance = null;

      return new Promise((resolve) => {
        this.script.addEventListener("load", () => {
          var config = {
            dataUrl: params["dataUrl"],
            frameworkUrl: params["frameworkUrl"],
            codeUrl: params["codeUrl"],
          };

          // TODO: Indicate loading progress in jsPsych-compatible way.

          createUnityInstance(this.canvas, config, (progress) => {
            // p.innerHTML += progress;
            console.log("Unity loading process: " + progress);
          })
            .catch((message) => {
              alert(message);
            })
            .then((unityInstance) => {
              this.myGameInstance = unityInstance;

              if ("waitEvent" in params) {
                const listener = () => {
                  window.removeEventListener(params["waitEvent"], listener);
                  resolve();
                };
                window.addEventListener(params["waitEvent"], listener);
              } else {
                resolve();
              }
            });
        });
      });
    }

    addCanvasToTrial(display_element) {
      display_element.appendChild(this.div);
      this.div.hidden = false;
    }

    removeCanvasAfterTrial() {
      this.div.hidden = true;
      document.body.appendChild(this.div);
    }

    closeUnity() {
      console.log("Experiment finished. Asking Unity to quit.");
      this.myGameInstance.Quit();
      this.myGameInstance = null;
    }

    sendMessage(gameObject, fct, msg) {
      this.myGameInstance.SendMessage(gameObject, fct, msg);
    }

    on_start(params) {}

    on_load(params) {}

    on_finish(params) {
      return {
        data_property: "data_value",
      };
    }
  }
  UnityExtension.info = {
    name: "unity",
  };

  return UnityExtension;
})(jsPsychModule);
