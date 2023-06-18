import { type Router } from 'express';

import {
  createUsersPlaylistController,
  getSeveralUsersController,
  getUsersPlaylistsController,
  getUsersProfileController,
  updateUsersProfileController,
  uploadUsersImagesController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Get Several Users
  router.get('/users', getSeveralUsersController);

  // Get a User's Profile
  router.get('/users/:user_id', getUsersProfileController);

  // Update a User's Profile
  router.put('/users/:user_id', isAuthenticated, updateUsersProfileController);

  // Get a User's Playlists
  router.get('/users/:user_id/playlists', getUsersPlaylistsController);

  // Create a Playlist
  router.post(
    '/users/:user_id/playlists',
    isAuthenticated,
    createUsersPlaylistController
  );

  // Upload a Custom user Image
  router.put(
    '/users/:user_id/images',
    isAuthenticated,
    uploadUsersImagesController
  );
};
