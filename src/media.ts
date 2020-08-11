import { handleError } from "./utils";

declare global {
  interface Window {
    stream: MediaStream;
  }
}

const videoElement = document.querySelector<HTMLVideoElement>("video");
const audioSelect = document.querySelector<HTMLInputElement>(
  "select#audioSource"
);
const videoSelect = document.querySelector<HTMLInputElement>(
  "select#videoSource"
);

function hasGetUSerMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function configureDeviceOptions(
  deviceKind: MediaDeviceKind,
  option: HTMLOptionElement,
  deviceInfo: MediaDeviceInfo
) {
  const devicesType = {
    audioinput: () => {
      option.text =
        deviceInfo.label || `Audio Input: ${deviceInfo.deviceId.slice(0, 5)}`;
      audioSelect.appendChild(option);
    },
    videoinput: () => {
      option.text =
        deviceInfo.label || `Video Input : ${deviceInfo.deviceId.slice(0, 5)}`;
      videoSelect.appendChild(option);
    },
  };

  return devicesType[deviceKind]();
}

function gotDevices(devicesInfo: MediaDeviceInfo[]) {
  for (let i = 0; i !== devicesInfo.length; i++) {
    const deviceInfo: MediaDeviceInfo = devicesInfo[i];
    const option = document.createElement("option");

    option.value = deviceInfo.deviceId;

    configureDeviceOptions(deviceInfo.kind, option, deviceInfo);
  }
}

function gotStream(stream: MediaStream) {
  window.stream = stream;
  videoElement.srcObject = stream;
}

function getStream() {
  if (window.stream) {
    window.stream
      .getTracks()
      .forEach((track: MediaStreamTrack) => track.stop());
  }

  const constraints: MediaStreamConstraints = {
    audio: {
      deviceId: {
        exact: audioSelect.value,
      },
    },
    video: {
      deviceId: {
        exact: videoSelect.value,
      },
    },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .catch(handleError);
}

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

export { hasGetUSerMedia, gotDevices, getStream };
