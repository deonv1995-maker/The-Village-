import * as THREE from 'three';

function quaternionValues(frames) {
  const values = [];
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();

  for (const [x, y, z] of frames) {
    euler.set(x, y, z, 'XYZ');
    quaternion.setFromEuler(euler);
    values.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }

  return values;
}

function rotationTrack(boneName, times, frames) {
  return new THREE.QuaternionKeyframeTrack(
    `${boneName}.quaternion`,
    times,
    quaternionValues(frames)
  );
}

export function createVillagerAnimationClips() {
  const idleTimes = [0, 0.75, 1.5, 2.25, 3.0];
  const idleTracks = [
    rotationTrack('Chest', idleTimes, [
      [0, 0, -0.018],
      [0, 0.018, 0.010],
      [0, 0, 0.018],
      [0, -0.018, -0.010],
      [0, 0, -0.018]
    ]),
    rotationTrack('Head', idleTimes, [
      [0.015, -0.045, 0],
      [0, 0, 0.008],
      [-0.010, 0.045, 0],
      [0, 0, -0.008],
      [0.015, -0.045, 0]
    ]),
    rotationTrack('LeftUpperArm', idleTimes, [
      [0.035, 0, -0.025],
      [0.010, 0, -0.015],
      [-0.020, 0, -0.010],
      [0.010, 0, -0.015],
      [0.035, 0, -0.025]
    ]),
    rotationTrack('RightUpperArm', idleTimes, [
      [-0.020, 0, 0.010],
      [0.010, 0, 0.015],
      [0.035, 0, 0.025],
      [0.010, 0, 0.015],
      [-0.020, 0, 0.010]
    ])
  ];

  const walkTimes = [0, 0.2, 0.4, 0.6, 0.8];
  const walkTracks = [
    rotationTrack('Hips', walkTimes, [
      [0, -0.025, 0],
      [0, 0, 0.018],
      [0, 0.025, 0],
      [0, 0, -0.018],
      [0, -0.025, 0]
    ]),
    rotationTrack('LeftUpperLeg', walkTimes, [
      [0.48, 0, 0],
      [0, 0, 0],
      [-0.48, 0, 0],
      [0, 0, 0],
      [0.48, 0, 0]
    ]),
    rotationTrack('RightUpperLeg', walkTimes, [
      [-0.48, 0, 0],
      [0, 0, 0],
      [0.48, 0, 0],
      [0, 0, 0],
      [-0.48, 0, 0]
    ]),
    rotationTrack('LeftLowerLeg', walkTimes, [
      [0.04, 0, 0],
      [0.30, 0, 0],
      [0.08, 0, 0],
      [0.48, 0, 0],
      [0.04, 0, 0]
    ]),
    rotationTrack('RightLowerLeg', walkTimes, [
      [0.08, 0, 0],
      [0.48, 0, 0],
      [0.04, 0, 0],
      [0.30, 0, 0],
      [0.08, 0, 0]
    ]),
    rotationTrack('LeftUpperArm', walkTimes, [
      [-0.42, 0, -0.02],
      [0, 0, -0.02],
      [0.42, 0, -0.02],
      [0, 0, -0.02],
      [-0.42, 0, -0.02]
    ]),
    rotationTrack('RightUpperArm', walkTimes, [
      [0.42, 0, 0.02],
      [0, 0, 0.02],
      [-0.42, 0, 0.02],
      [0, 0, 0.02],
      [0.42, 0, 0.02]
    ]),
    rotationTrack('LeftLowerArm', walkTimes, [
      [-0.08, 0, 0],
      [-0.18, 0, 0],
      [-0.08, 0, 0],
      [-0.02, 0, 0],
      [-0.08, 0, 0]
    ]),
    rotationTrack('RightLowerArm', walkTimes, [
      [-0.08, 0, 0],
      [-0.02, 0, 0],
      [-0.08, 0, 0],
      [-0.18, 0, 0],
      [-0.08, 0, 0]
    ])
  ];

  return Object.freeze({
    idle: new THREE.AnimationClip('idle', 3.0, idleTracks),
    walk: new THREE.AnimationClip('walk', 0.8, walkTracks)
  });
}
