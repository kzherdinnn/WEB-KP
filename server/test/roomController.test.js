import { expect } from "chai";
import sinon from "sinon";
import { updateRoom } from "../controllers/roomController.js";
import roomModel from "../models/room.models.js";
import hotelModel from "../models/hotel.models.js";
import auditLogModel from "../models/auditLog.models.js";
import { v2 as cloudinary } from "cloudinary";

describe("Room Controller - updateRoom", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      params: { roomId: "someRoomId" },
      body: {
        type: "Deluxe",
        pricePerNight: 200,
        amenities: "[]",
        totalRooms: 10,
      },
      files: [{ path: "new/image/path" }],
      auth: { userId: "someUserId" },
      headers: { "user-agent": "test-agent" },
      ip: "127.0.0.1",
      method: "PUT",
      originalUrl: "/api/room/someRoomId",
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    // Mock environment variables
    process.env.CLOUDINARY_CLOUD_NAME = "some_cloud_name";
    process.env.CLOUDINARY_API_KEY = "some_api_key";
    process.env.CLOUDINARY_API_SECRET = "some_api_secret";
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_API_KEY;
    delete process.env.CLOUDINARY_API_SECRET;
  });

  it("should delete old images from Cloudinary when updating a room with new images", async () => {
    const oldImages = [
      "http://res.cloudinary.com/somecloud/image/upload/v123/old_image_1.jpg",
    ];
    const room = {
      _id: "someRoomId",
      hotel: "someHotelId",
      images: oldImages,
      save: sandbox.stub().resolves(),
    };

    sandbox.stub(hotelModel, "findOne").resolves({ _id: "someHotelId" });
    sandbox.stub(roomModel, "findById").resolves(room);
    sandbox.stub(auditLogModel, "createLog").resolves();
    sandbox
      .stub(cloudinary.uploader, "upload")
      .resolves({ secure_url: "http://new.image.url" });
    const destroySpy = sandbox.stub(cloudinary.uploader, "destroy").resolves();

    await updateRoom(req, res);

    expect(destroySpy.calledOnce).to.be.true;
    expect(destroySpy.calledWith("old_image_1")).to.be.true;
  });
});
