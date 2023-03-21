const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");

function setVideoSpeed(speed) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `
        (function() {
          const videos = document.querySelectorAll("video");
          let playingVideo = null;
          for (const video of videos) {
            if (!video.paused) {
              playingVideo = video;
              break;
            }
          }
          if (!playingVideo) {
            playingVideo = videos[0];
          }
          if (playingVideo) {
            playingVideo.playbackRate = ${speed};
            console.log("Actual playback rate:", playingVideo.playbackRate);
          }
        })();
      `,
    });
  });
}

speedSlider.addEventListener("input", () => {
  speedValue.textContent = speedSlider.value;
  setVideoSpeed(speedSlider.value);
});

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `
        (function() {
          const videos = document.querySelectorAll("video");
          let playingVideo = null;
          for (const video of videos) {
            if (!video.paused) {
              playingVideo = video;
              break;
            }
          }
          if (!playingVideo) {
            playingVideo = videos[0];
          }
          if (playingVideo) {
            playingVideo.playbackRate;
          }
        })();
      `,
        allFrames: true,
      },
      (results) => {
        const playbackRate = results.find((result) => result !== undefined);
        if (playbackRate !== undefined) {
          speedSlider.value = playbackRate;
          speedValue.textContent = playbackRate;
        }
      }
    );
  });
});
