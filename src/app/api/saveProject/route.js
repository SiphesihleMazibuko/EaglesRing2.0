import { getToken } from "next-auth/jwt";
import connectMongoDB from "@/lib/mongodb";
import Pitch from "@/models/pitch";
import {Busboy} from 'busboy';
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Important to disable the default body parser
  },
};

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const busboy = new Busboy({ headers: req.headers });
    const fields = {};
    const files = [];

    return new Promise((resolve, reject) => {
      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        const saveTo = path.join(process.cwd(), "/tmp", path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
        files.push({ fieldname, filename, encoding, mimetype, path: saveTo });
      });

      busboy.on("field", (fieldname, val) => {
        fields[fieldname] = val;
      });

      busboy.on("finish", async () => {
        try {
          const { companyName, projectIdea } = fields;

          const userId = token.sub;
          await connectMongoDB();

          const newPitch = new Pitch({
            entrepreneurId: userId,
            companyName,
            projectIdea,
            projectImage: files.find((f) => f.fieldname === "image")?.path,
            pitchVideo: files.find((f) => f.fieldname === "video")?.path,
            createdAt: new Date(),
          });

          await newPitch.save();

          resolve(NextResponse.json({ message: "Project saved successfully!" }, { status: 200 }));
        } catch (error) {
          console.error("Error saving project:", error.message);
          resolve(NextResponse.json({ error: "Failed to save project" }, { status: 500 }));
        }
      });

      req.pipe(busboy);
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
