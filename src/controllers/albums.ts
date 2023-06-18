import { randomUUID } from 'crypto';
import fs from 'fs';
import imageSize from 'image-size';
import {
  addAlbumsArtistsModel,
  addAlbumsGenresModel,
  createAlbumsTracksModel,
  getAlbumsModel,
  getAlbumsTracksModel,
  getSeveralAlbumsModel,
  removeAlbumsArtistsModel,
  removeAlbumsGenresModel,
  removeAlbumsImagesModel,
  removeAlbumsTracksModel,
  updateAlbumDetailsModel,
  uploadAlbumsImagesModel,
} from '../models';

export const getAlbumsController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const album = await getAlbumsModel(album_id);

    if (!album) {
      const status = 404;
      const message = `Album not found`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    return res.status(200).json(album);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const getSeveralAlbumsController = async (req: any, res: any) => {
  try {
    const { ids, limit, offset } = req.query;

    if (
      (limit && offset && ids) ||
      (limit && !offset && ids) ||
      (!limit && offset && ids)
    ) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You can't use limit, offset and ids at the same time`,
        },
      });
    }

    if (!limit && !offset && !ids) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use limit, offset or ids`,
        },
      });
    }

    if ((limit && !offset) || (!limit && offset)) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use limit and offset at the same time`,
        },
      });
    }

    if (limit && offset) {
      const albums = await getSeveralAlbumsModel(Number(limit), Number(offset));
      return res.status(200).json({ albums });
    }

    if (ids) {
      const idsArray = (ids as string).split(',');

      const albums = await getSeveralAlbumsModel(idsArray);
      return res.status(200).json({ albums });
    }
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const getAlbumsTracksController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { limit, offset } = req.query;

    if (!limit || !offset) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use limit and offset`,
        },
      });
    }

    const tracks = await getAlbumsTracksModel(
      album_id,
      Number(limit),
      Number(offset)
    );

    return res.status(200).json({
      limit,
      offset,
      total: tracks?.tracks.length,
      tracks: tracks?.tracks,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const updateAlbumDetailsController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { name, release_date, type, user } = req.body;

    const album = await getAlbumsModel(album_id);

    console.log(name);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a album that you don't own`,
        },
      });
    }

    const updatedAlbum = await updateAlbumDetailsModel(
      album_id,
      name,
      release_date,
      type
    );

    return res.status(200).json(updatedAlbum);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const createAlbumsTracksController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { tracks, user } = req.body;

    const album = await getAlbumsModel(album_id);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      const status = 403;
      const message = `You can't create a track for another user`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    tracks.map(async (track: any) => {
      const track_id = randomUUID();
      track.id = track_id;
      track.track_number = Number(track.track_number);

      var type = track.file.split(';')[0].split('/')[1];

      if (
        type !== 'mp3' &&
        type !== 'wav' &&
        type !== 'opus' &&
        type !== 'webm'
      ) {
        return res.status(400).json({
          message: 'invalid file type',
        });
      }

      // convert base64 string file to buffer
      const buffer = Buffer.from(track.file.split(';base64,').pop(), 'base64');
      // const decodedString = buffer.toString('utf-8');

      const FOLDER = `public/users/${user.id}/albums/${album_id}/tracks`;
      const FILE = `${FOLDER}/${track_id}.${type}`;

      // check if folder exists, if not create it
      if (!fs.existsSync(FOLDER)) {
        fs.mkdirSync(FOLDER, { recursive: true });
      }

      if (fs.existsSync(FOLDER)) {
        const upload = fs.writeFileSync(FILE, buffer, {
          encoding: 'base64',
        });
      }

      track.file = FILE;
      track.duration = 0;
      // await getAudioDurationInSeconds(FILE).then((duration) => track.duration = duration);
    });

    const track = await createAlbumsTracksModel(album_id, tracks);
    return res.status(201).json(track);
  } catch (error) {
    console.log(error);
  }
};

export const uploadAlbumsImagesController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { images, user } = req.body;

    const album = await getAlbumsModel(album_id);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a album that you don't own`,
        },
      });
    }

    images.map((image: any) => {
      const image_id = randomUUID();
      image.id = image_id;

      // check file extension of base64 string
      var type = image.file.split(';')[0].split('/')[1];

      if (
        type !== 'png' &&
        type !== 'jpg' &&
        type !== 'jpeg' &&
        type !== 'gif' &&
        type !== 'webp'
      ) {
        return res.status(400).json({
          message: 'invalid file type',
        });
      }

      const FOLDER = `public/users/${user.id}/albums/${album_id}/images`;

      // check if folder exists, if not create it
      if (!fs.existsSync(FOLDER)) {
        fs.mkdirSync(FOLDER, { recursive: true });
      }

      // convert base64 string file to buffer
      const buffer = Buffer.from(image.file.split(';base64,').pop(), 'base64');
      // const decodedString = buffer.toString('utf-8');

      const dimension = imageSize(buffer);
      const width = dimension.width;
      const height = dimension.height;
      image.width = width;
      image.height = height;

      const upload = fs.writeFile(
        `${FOLDER}/${image_id}.${type}`,
        buffer,
        { encoding: 'base64' },
        (err) => {}
      );
      image.file = `${FOLDER}/${image_id}.${type}`;
    });

    const updatedAlbum = await uploadAlbumsImagesModel(album_id, images);

    return res.status(200).json({ updatedAlbum });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const removeAlbumsTracksController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { tracks, user } = req.body;

    const album = await getAlbumsModel(album_id);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a album that you don't own`,
        },
      });
    }
    const updatedAlbum = await removeAlbumsTracksModel(album_id, tracks);

    tracks.map(async (track: any) => {
      const FOLDER = `public/users/${user.id}/albums/${album_id}/tracks`;
      const files = fs.readdirSync(FOLDER);
      files.map((file: any) => {
        if (file.startsWith(track)) {
          fs.unlink(`${FOLDER}/${file}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
    });

    return res.status(200).json({ updatedAlbum });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const removeAlbumsImagesController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { images, user } = req.body;

    const album = await getAlbumsModel(album_id);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a album that you don't own`,
        },
      });
    }
    const updatedAlbum = await removeAlbumsImagesModel(album_id, images);

    images.map(async (image: any) => {
      const FOLDER = `public/users/${user.id}/albums/${album_id}/images`;
      const files = fs.readdirSync(FOLDER);
      files.map((file: any) => {
        if (file.startsWith(image)) {
          fs.unlink(`${FOLDER}/${file}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
    });

    return res.status(200).json({ updatedAlbum });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const addAlbumsGenresController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { genres, user } = req.body;

    const album = await getAlbumsModel(album_id);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a album that you don't own`,
        },
      });
    }

    const updatedAlbum = await addAlbumsGenresModel(album_id, genres);

    return res.status(200).json({ updatedAlbum });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const removeAlbumsGenresController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { genres, user } = req.body;

    const album = await getAlbumsModel(album_id);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a album that you don't own`,
        },
      });
    }

    const updatedAlbum = await removeAlbumsGenresModel(album_id, genres);

    return res.status(200).json({ updatedAlbum });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const addAlbumsArtistsController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { artists, user } = req.body;

    const album = await getAlbumsModel(album_id);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a album that you don't own`,
        },
      });
    }

    const updatedAlbum = await addAlbumsArtistsModel(album_id, artists);

    return res.status(200).json({ updatedAlbum });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const removeAlbumsArtistsController = async (req: any, res: any) => {
  try {
    const { album_id } = req.params;
    const { artists, user } = req.body;

    const album = await getAlbumsModel(album_id);

    if (!album) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    const art: any = [];

    album.artists.map(async (artist: any) => {
      art.push(artist.id);
    });

    if (!art.includes(user.id)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a album that you don't own`,
        },
      });
    }

    const updatedAlbum = await removeAlbumsArtistsModel(album_id, artists);

    return res.status(200).json({ updatedAlbum });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};
