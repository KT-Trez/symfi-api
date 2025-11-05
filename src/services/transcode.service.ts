import { spawn } from 'node:child_process';
import fs from 'node:fs';
import ffmpeg from '@ffmpeg-installer/ffmpeg';

const clearPath = (path: string) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

export const transcodeAudioToCodec = (inputPath: string, codec = 'pcm_s16le', extension = 'wav') => {
  const outputPath = `${inputPath}.${extension}`;

  return new Promise<string>((resolve, reject) => {
    const args = [
      '-y', // overwrite
      '-i',
      inputPath,
      '-vn', // no video
      '-acodec',
      codec, // WAV PCM 16-bit little endian
      '-ac',
      '2', // channels
      outputPath,
    ];

    const chunks: unknown[] = [];
    const ff = spawn(ffmpeg.path, args);

    ff.on('close', code => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        clearPath(outputPath);
        reject(new Error(`ffmpeg exited with code ${code}: stdout: ${chunks}`));
      }
    });

    ff.on('data', data => chunks.push(data));

    ff.on('error', err => {
      clearPath(outputPath);
      reject(new Error(`Failed to start ffmpeg: ${err.message}`));
    });
  });
};
