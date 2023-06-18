import { type Router } from 'express';
import {
  addPlaylistsTracksController,
  getPlaylistController,
  getPlaylistsTracksController,
  getSeveralPlaylistsController,
  removePlaylistsImagesController,
  removePlaylistsTracksController,
  updatePlaylistDetailsController,
  uploadPlaylistsImagesController,
} from '../controllers';
import { isAuthenticated } from '../middlewares';
import { removePlaylistsImagesModel } from '../models';

export default (router: Router) => {
  // Get a Playlist
  router.get('/playlists/:playlist_id', getPlaylistController);

  // Get Multiple Playlists
  router.get('/playlists', getSeveralPlaylistsController);

  // Get Playlisyt Tracks
  router.get('/playlists/:playlist_id/tracks', getPlaylistsTracksController);

  // Update a Playlist's Details
  router.put(
    '/playlists/:playlist_id',
    isAuthenticated,
    updatePlaylistDetailsController
  );

  // Upload a Custom Playlist Cover Image
  router.put(
    '/playlists/:playlist_id/images',
    isAuthenticated,
    uploadPlaylistsImagesController
  );

  // Update Playlists Tracks
  router.put('/playlists/:playlist_id/tracks', isAuthenticated, (req, res) => {
    const { playlist_id } = req.params;
  });

  // Add Tracks to a Playlist
  router.post(
    '/playlists/:playlist_id/tracks',
    isAuthenticated,
    addPlaylistsTracksController
  );

  // Remove Playlists Tracks
  router.delete(
    '/playlists/:playlist_id/tracks',
    isAuthenticated,
    removePlaylistsTracksController
  );

  // Remove Playlists Images
  router.delete(
    '/playlists/:playlist_id/images',
    isAuthenticated,
    removePlaylistsImagesController
  );
};
