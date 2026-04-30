import type { Photo } from "../../photos/models/photo";

export interface Album {
  id: string;
  title: string;
  photos?: Photo[]
}