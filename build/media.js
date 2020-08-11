import { handleError } from "./utils";
const videoElement = document.querySelector("video");
const audioSelect = document.querySelector("select#audioSource");
const videoSelect = document.querySelector("select#videoSource");
function hasGetUSerMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
function configureDeviceOptions(deviceKind, option, deviceInfo) {
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
function gotDevices(devicesInfo) {
    for (let i = 0; i !== devicesInfo.length; i++) {
        const deviceInfo = devicesInfo[i];
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        configureDeviceOptions(deviceInfo.kind, option, deviceInfo);
    }
}
function gotStream(stream) {
    window.stream = stream;
    videoElement.srcObject = stream;
}
function getStream() {
    if (window.stream) {
        window.stream
            .getTracks()
            .forEach((track) => track.stop());
    }
    const constraints = {
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
//# sourceMappingURL=media.js.map