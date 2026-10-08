import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export const validateReport = (req: Request, res: Response, next: NextFunction) => {
  const { type, location, severity, description } = req.body;
  
  if (!type || !location || !severity) {
    throw new ValidationError('Missing required fields: type, location, severity');
  }

  if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    throw new ValidationError('Invalid coordinates');
  }

  if (location.lat < -90 || location.lat > 90 || location.lng < -180 || location.lng > 180) {
    throw new ValidationError('Coordinates out of range');
  }

  // Sanitize description
  if (description && typeof description === 'string') {
    req.body.description = description.replace(/<[^>]*>?/gm, ''); // simple strip tags
  }

  next();
};

export const validateRoute = (req: Request, res: Response, next: NextFunction) => {
  const { origin, destination } = req.body;
  if (!origin || !destination || typeof origin.lat !== 'number' || typeof destination.lat !== 'number') {
    throw new ValidationError('Valid origin and destination coordinates required');
  }
  next();
};

export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const { mimeType, size } = req.body;
  if (!mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    throw new ValidationError('Invalid file type. Only JPEG, PNG, WEBP allowed.');
  }
  if (size && size > 5 * 1024 * 1024) {
    throw new ValidationError('File size exceeds 5MB limit.');
  }
  next();
};
