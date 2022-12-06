var jsPsychCloseUnityPlugin = (function (jspsych) {
  "use strict";

  const info = {
    name: "moot-close-unity",
  };

  /**
   * **CLOSE-UNITY-PLUGIN**
   *
   * This plugin integrates unity into jsPsych
   *
   */
  class CloseUnityPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.unity = this.jsPsych.extensions["unity"];
    }

    trial(display_element, trial) {
      this.unity.closeUnity();
      this.jsPsych.finishTrial({});
    }
  }
  CloseUnityPlugin.info = info;

  return CloseUnityPlugin;
})(jsPsychModule);
