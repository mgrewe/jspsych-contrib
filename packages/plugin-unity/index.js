var jsPsychUnityPlugin = (function (jspsych) {
  "use strict";

  const info = {
    name: "unity-plugin",
    parameters: {
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: -1,
      },
    },
  };

  /**
   * **UNITY-PLUGIN**
   *
   * This plugin integrates unity into jsPsych
   *
   */
  class UnityPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.unity = this.jsPsych.extensions["unity"];
    }

    trial(display_element, trial) {
      // data saving
      this.trial_data = {
        unity_log: [],
      };

      window.addEventListener("JSPsychUnityEvent", this.unityEventCallback);

      // end trial
      if (trial["trial_duration"] > 0) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          this.unity.sendMessage(
            "Controller",
            "OnMessage",
            JSON.stringify({
              channel: "phase-ended",
              payload: {},
            })
          );
          this.finish_trial();
        }, trial["trial_duration"]);
      }

      this.unity.sendMessage(
        "Controller",
        "OnMessage",
        JSON.stringify({
          channel: "phase-started",
          payload: { parameters: trial["unity_parameters"] },
        })
      );
      this.unity.addCanvasToTrial(display_element);
    }

    finish_trial() {
      window.removeEventListener("JSPsychUnityEvent", this.unity_event_callback);
      this.unity.removeCanvasAfterTrial();
      this.jsPsych.finishTrial(this.trial_data);
    }

    unityEventCallback(event) {
      if (event.detail != undefined) {
        try {
          var json = JSON.parse(event.detail);
          if (json["channel"] == "log") {
            this.trial_data.unity_log.push(json.payload);
          }
        } catch (error) {
          window.alert(error);
        }
      }
    }
  }
  UnityPlugin.info = info;

  return UnityPlugin;
})(jsPsychModule);
