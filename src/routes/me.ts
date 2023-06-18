import { Router } from 'express';
import {
  getCurrentUsersAlbumsController,
  getCurrentUsersPlaylistsController,
  getCurrentUsersProfileController,
  getCurrentUsersTracksController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Get current user's profile
  router.get('/me', isAuthenticated, getCurrentUsersProfileController);

  // Get current user's playlists
  router.get(
    '/me/playlists',
    isAuthenticated,
    getCurrentUsersPlaylistsController
  );

  // Get current user's albums
  router.get(
    '/me/albums',
    isAuthenticated,
    authorize('ARTIST'),
    getCurrentUsersAlbumsController
  );

  // Get current user's tracks
  router.get(
    '/me/tracks',
    isAuthenticated,
    authorize('ARTIST'),
    getCurrentUsersTracksController
  );

  // player
  router.get('/me/player', isAuthenticated, (req, res) => {});
};
