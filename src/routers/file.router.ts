import { Request, Router } from "express";
import { uploadMiddleware } from "../middlewares/file-upload.mddw";
import { FileController } from "../controllers/file.controller";

export const FileRouter = Router();
const fileController = new FileController();

FileRouter.post("/add", uploadMiddleware.array("file"), async (req, res) => {
  if (!req.files) {
    throw new Error("No files uploaded");
  }

  const files: Express.Multer.File[] = [];

  for (const [fileName, file] of Object.entries(req.files)) {
    if (!file) {
      throw new Error(`File with name ${fileName} was not found`);
    } else {
      files.push(file);
    }
  }
  const addedFiles = await fileController.addFile(files);
  res.status(200).json({ addedFiles });
});

FileRouter.delete("/delete/:id", async (req: Request<{ id: number }>, res) => {
  if (!req.params?.id) {
    throw new Error("Param id is not found");
  }
  const data = await fileController.deleteFile(req.params.id);
  res.status(200).json({ fileDeleted: data });
});
