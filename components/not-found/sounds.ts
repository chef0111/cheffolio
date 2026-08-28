export function loadSound(url: string) {
  const audio = new Audio(url);
  audio.preload = 'auto';
  audio.load();
  return audio;
}

export function unlockSounds(sounds: Array<HTMLAudioElement | null>) {
  for (const sound of sounds) {
    if (!sound || sound.dataset.unlocked === '1') continue;

    sound.muted = true;
    void sound
      .play()
      .then(() => {
        sound.dataset.unlocked = '1';
        if (sound.dataset.playing === '1') {
          sound.muted = false;
          return;
        }
        sound.pause();
        sound.currentTime = 0;
        sound.muted = false;
      })
      .catch(() => {
        sound.muted = false;
      });
  }
}

export function playSound(sound: HTMLAudioElement | null) {
  if (!sound) return;

  sound.dataset.playing = '1';
  sound.muted = false;
  sound.currentTime = 0;
  sound.volume = 0.3;
  void sound.play().catch(() => {});
}
