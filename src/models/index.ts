import {
  createAlbumModel,
  deleteAlbumByIdModel,
  deleteAllAlbumsModel,
  getAlbumByIdModel,
  getAllAlbumsModel,
  updateAlbumByIdModel,
} from './albums';
import { getArtistById, getArtists } from './artists';
import {
  createGenreModel,
  deleteAllGenresModel,
  deleteGenreByIdModel,
  getAllGenresModel,
  getGenreByIdModel,
  updateGenreByIdModel,
} from './genres';
import {
  createImageModel,
  deleteImageByIdModel,
  getAllImagesModel,
  getImageByIdModel,
  updateImageByIdModel,
} from './images';
import {
  createTrackModel,
  deleteTrackModel,
  getAllTracksModel,
  getTrackByIdModel,
  updateTrackModel,
} from './tracks';
import {
  createUserModel,
  deleteAllUsersModel,
  deleteUserByIdModel,
  getUserByEmailModel,
  getUserByIdModel,
  getUserByUsernameModel,
  getUsersModel,
  updateUserByIdModel,
} from './users';

export {
  // ALBUMS
  createAlbumModel,
  deleteAlbumByIdModel,
  deleteAllAlbumsModel,
  getAllAlbumsModel,
  getAlbumByIdModel,
  updateAlbumByIdModel,

  // ARTISTS
  getArtistById,
  getArtists,

  // GENRES
  createGenreModel,
  deleteAllGenresModel,
  deleteGenreByIdModel,
  getAllGenresModel,
  getGenreByIdModel,
  updateGenreByIdModel,

  // IMAGES
  createImageModel,
  deleteImageByIdModel,
  getAllImagesModel,
  getImageByIdModel,
  updateImageByIdModel,

  // PLAYLISTS

  // TRACKS
  createTrackModel,
  deleteTrackModel,
  getAllTracksModel,
  getTrackByIdModel,
  updateTrackModel,

  // USERS
  createUserModel,
  deleteUserByIdModel,
  deleteAllUsersModel,
  getUserByEmailModel,
  getUserByIdModel,
  getUserByUsernameModel,
  getUsersModel,
  updateUserByIdModel,
};
