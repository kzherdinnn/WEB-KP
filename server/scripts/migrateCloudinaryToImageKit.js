import "dotenv/config";
import connectDB from "../config/db.js";
import imagekit from "../config/imagekit.js";
import roomModel from "../models/room.models.js";
import userModel from "../models/user.models.js";

const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return url.includes("res.cloudinary.com") || url.includes("cloudinary.com");
};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const uploadWithRetry = async (file, fileName, retry = 2) => {
  let attempt = 0;
  while (attempt <= retry) {
    try {
      const res = await imagekit.upload({ file, fileName });
      return res;
    } catch (err) {
      attempt++;
      console.warn(`Upload attempt ${attempt} failed for ${fileName}:`, err.message || err);
      if (attempt > retry) throw err;
      await sleep(500 * attempt);
    }
  }
};

const processInBatches = async (items, worker, concurrency = 3) => {
  let index = 0;
  const results = [];
  while (index < items.length) {
    const batch = items.slice(index, index + concurrency);
    const promises = batch.map((it) => worker(it));
    const res = await Promise.all(promises);
    results.push(...res);
    index += concurrency;
  }
  return results;
};

const migrateRooms = async (options) => {
  const rooms = await roomModel.find({ "images.0": { $exists: true } });
  console.log(`Found ${rooms.length} rooms to scan`);

  const cloudinaryEntries = [];
  for (const room of rooms) {
    const cloudImages = room.images.filter(isCloudinaryUrl);
    if (cloudImages.length > 0) {
      cloudinaryEntries.push({ type: "room", id: room._id, doc: room, images: cloudImages });
    }
  }

  console.log(`Found ${cloudinaryEntries.length} rooms containing Cloudinary images`);

  const limited = options.limit ? cloudinaryEntries.slice(0, options.limit) : cloudinaryEntries;

  await processInBatches(limited, async (entry) => {
    const room = entry.doc;
    let changed = false;
    const newImages = [];
    for (const img of room.images) {
      if (isCloudinaryUrl(img)) {
        try {
          const fileName = `room-${room._id}-${Date.now()}`;
          if (options.dryRun) {
            console.log(`[dry-run] would upload ${img} as ${fileName}`);
            newImages.push(img);
          } else {
            const res = await uploadWithRetry(img, fileName, options.retry);
            console.log(`Migrated image for room ${room._id}: ${img} -> ${res.url}`);
            newImages.push(res.url);
            changed = true;
          }
        } catch (err) {
          console.error(`Failed to migrate image ${img} for room ${room._id}:`, err.message || err);
          newImages.push(img);
        }
      } else {
        newImages.push(img);
      }
    }

    if (changed && !options.dryRun) {
      room.images = newImages;
      await room.save();
      console.log(`Updated room ${room._id}`);
    }
    return true;
  }, options.concurrency);
};

const migrateUsers = async (options) => {
  const users = await userModel.find({});
  console.log(`Found ${users.length} users to scan`);

  const cloudUsers = users.filter((u) => isCloudinaryUrl(u.image));
  console.log(`Found ${cloudUsers.length} users containing Cloudinary images`);

  const limited = options.limit ? cloudUsers.slice(0, options.limit) : cloudUsers;

  await processInBatches(limited, async (user) => {
    try {
      const fileName = `user-${user._id}-${Date.now()}`;
      if (options.dryRun) {
        console.log(`[dry-run] would upload ${user.image} as ${fileName}`);
      } else {
        const res = await uploadWithRetry(user.image, fileName, options.retry);
        console.log(`Migrated user image ${user._id}: ${user.image} -> ${res.url}`);
        user.image = res.url;
        await user.save();
      }
    } catch (err) {
      console.error(`Failed to migrate user ${user._id} image:`, err.message || err);
    }
    return true;
  }, options.concurrency);
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    limit: null,
    retry: 2,
    concurrency: 3,
    only: "both",
  };
  for (const arg of args) {
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg.startsWith("--limit=")) options.limit = parseInt(arg.split("=")[1], 10);
    else if (arg.startsWith("--retry=")) options.retry = parseInt(arg.split("=")[1], 10);
    else if (arg.startsWith("--concurrency=")) options.concurrency = parseInt(arg.split("=")[1], 10);
    else if (arg.startsWith("--only=")) options.only = arg.split("=")[1];
  }
  return options;
};

const run = async () => {
  const options = parseArgs();
  try {
    await connectDB();
    console.log("Connected to DB");

    // Basic check for ImageKit configuration
    if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      console.error("ImageKit not configured. Set IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT in env.");
      process.exit(1);
    }

    console.log("Migration options:", options);

    if (options.only === "rooms" || options.only === "both") {
      await migrateRooms(options);
    }
    if (options.only === "users" || options.only === "both") {
      await migrateUsers(options);
    }

    console.log("Migration finished");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message || err);
    process.exit(1);
  }
};

if (require.main === module) {
  run();
}

export default run;
