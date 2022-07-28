import { Media } from './file.enum'

export interface File {
  filename: string;
  originName: string;
  fileType: Media
  url: string;
}

export interface SearchFileOption {
  bucketname: string;
  originName?: string;
  isCollected?: boolean;
}
