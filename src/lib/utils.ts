import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const genUxId = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const serializeMongoDoc = <T>(doc: T | null): T | null => {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
};

export const extractCloudinaryPublicIdFromUrl = (url?: string | null): string | null => {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }

  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');

    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
      return null;
    }

    return parts
      .slice(uploadIndex + 2)
      .join('/')
      .split('.')[0];
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};
