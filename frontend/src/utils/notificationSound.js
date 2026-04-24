const SOUND_ENABLED_KEY = 'notificationSoundEnabled';

let audioContext;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }

  return audioContext;
};

// Warm up the AudioContext on user gesture — call this once from a click handler
export const warmupAudioContext = async () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      console.warn('Failed to resume AudioContext:', e);
    }
  }

  // Play a silent buffer to fully unlock audio on iOS/Safari
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (e) {
    // Ignore — best-effort unlock
  }
};

export const isNotificationSoundEnabled = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SOUND_ENABLED_KEY) === 'true';
};

export const enableNotificationSound = async () => {
  if (typeof window === 'undefined') return false;

  const nextEnabled = !isNotificationSoundEnabled();
  localStorage.setItem(SOUND_ENABLED_KEY, nextEnabled ? 'true' : 'false');

  if (nextEnabled) {
    // Force create and resume AudioContext inside user gesture
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn('Failed to resume AudioContext:', e);
      }
    }

    // Play a silent buffer to unlock audio on iOS/Safari
    if (ctx) {
      try {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      } catch (e) {
        // Ignore
      }
    }

    // Play a quick audible test tone so user knows sound works
    await playNotificationSound();
  }

  return nextEnabled;
};

export const requestSystemNotificationPermission = async () => {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const playNotificationSound = async () => {
  if (!isNotificationSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Always attempt to resume before playing — handles background tab suspension
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      console.warn('Cannot resume AudioContext for notification sound:', e);
      return;
    }
  }

  const now = ctx.currentTime;
  const notes = [880, 660];

  notes.forEach((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.12);

    gainNode.gain.setValueAtTime(0.0001, now + index * 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + index * 0.12 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.12);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now + index * 0.12);
    oscillator.stop(now + index * 0.12 + 0.12);
  });
};

export const showSystemNotification = ({ title, body }) => {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  new Notification(title, {
    body,
    icon: '/file.svg',
    badge: '/file.svg'
  });
};
