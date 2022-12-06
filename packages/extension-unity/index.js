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

          var progress_bar_container = document.createElement("div");
          progress_bar_container.id = "jspsych-loading-progress-bar-container";
          progress_bar_container.style.height = "10px";
          progress_bar_container.style.width = "300px";
          progress_bar_container.style.backgroundColor = "#ddd";
          progress_bar_container.style.margin = "auto";

          var progress_bar_text = document.createElement("p");
          progress_bar_text.innerHTML = "Loading the experiment.";

          var progress_bar = document.createElement("div");
          progress_bar.id = "jspsych-loading-progress-bar";
          progress_bar.style.height = "10px";
          progress_bar.style.width = "0px";
          progress_bar.style.backgroundColor = "#777";

          progress_bar_container.appendChild(progress_bar);
          this.jsPsych.getDisplayElement().appendChild(progress_bar_text);
          this.jsPsych.getDisplayElement().appendChild(progress_bar_container);

          createUnityInstance(this.canvas, config, (progress) => {
            // p.innerHTML += progress;
            console.log("Unity loading process: " + progress);
            progress_bar.style.width = Math.round(progress * 100) + "%";
          })
            .catch((message) => {
              alert(message);
            })
            .then((unityInstance) => {
              this.jsPsych.getDisplayElement().removeChild(progress_bar_text);
              this.jsPsych.getDisplayElement().removeChild(progress_bar_container);
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
