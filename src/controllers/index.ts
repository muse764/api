import {
  createAlbumController,
  deleteAlbumByIdController,
  deleteAllAlbumsController,
  getAlbumByIdController,
  getAlbumsController,
  updateAlbumByIdController,
} from './albums';
import { getAllArtists, getSingleArtist } from './artists';
import { login, register } from './authentication';
import {
  createUserController,
  deleteSingleUserController,
  getAllUsersController,
  getSingleUserController,
  updateSingleUserController,
} from './users';
import {
  createGenreController,
  deleteAllGenresController,
  deleteGenreByIdController,
  getAllGenresController,
  getGenreByIdController,
  updateGenreByIdController,
} from './genres';
import {
  createImageController,
  deleteImageController,
  getImagesController,
  getImageByIdController,
} from './images';
import { getLoggedinUser } from './me';
import {
  createTrackController,
  getAllTracksController,
  getAllTrackByIdController,
} from './tracks';
export {
  // AUTH
  login,
  register,

  // ALBUMS
  createAlbumController,
  deleteAlbumByIdController,
  deleteAllAlbumsController,
  getAlbumByIdController,
  getAlbumsController,
  updateAlbumByIdController,
  // ARTISTS
  getAllArtists,
  getSingleArtist,

  // GENRES
  createGenreController,
  deleteAllGenresController,
  deleteGenreByIdController,
  getAllGenresController,
  getGenreByIdController,
  updateGenreByIdController,

  // IMAGE
  createImageController,
  deleteImageController,
  getImagesController,
  getImageByIdController,

  // ME
  getLoggedinUser,

  // PLAYLISTS
  // SEARCH

  // TRACKS
  createTrackController,
  getAllTracksController,
  getAllTrackByIdController,

  // USERS
  createUserController,
  getAllUsersController,
  getSingleUserController,
  updateSingleUserController,
  deleteSingleUserController,
};
