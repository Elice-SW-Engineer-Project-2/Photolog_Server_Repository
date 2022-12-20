export class CreatePostDto {
  userId: number;

  title: string;

  content: string;

  imageUrlId: number;

  lensId: number;

  cameraId: number;

  latitude: number;

  longitude: number;

  locationInfo: string;

  takenAt: Date;

  hashtags: string[];
}
