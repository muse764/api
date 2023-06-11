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
import { createImageController, getImageByIdController } from './images';
import { getLoggedinUser } from './me';
export {
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
  getImageByIdController,

  // ME
  getLoggedinUser,

  // PLAYLISTS
  // SEARCH
  // TRACKS
  // USERS
  getAllUsersController,
  getSingleUserController,
  updateSingleUserController,
  deleteSingleUserController,
};
