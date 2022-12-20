export class CreatePostDto {
  title: string;

  content: string;

  imageURL: string;

  lensId: number;

  cameraId: number;

  latitude: number;

  longitude: number;

  locationInfo: string;

  takenAt: Date;
}
