import { hasGetUSerMedia, gotDevices, getStream } from "./media";
import { handleError } from "./utils";

if (hasGetUSerMedia()) {
  alert("getUSerMedia() is supported by your browser 🎉 🌈");

  navigator.mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .then(getStream)
    .catch(handleError);
} else {
  alert("getUserMedia() is not supported by your browser 🐀");
}
