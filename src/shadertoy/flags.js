export const getFlags = (bits) => ({
  vr: !!(bits & 0b0000001),
  webcam: !!(bits & 0b0000010),
  microphone: !!(bits & 0b0000100),
  gpuSound: !!(bits & 0b0001000),
  keyboard: !!(bits & 0b0010000),
  multipass: !!(bits & 0b0100000),
  soundCloud: !!(bits & 0b1000000),
})
