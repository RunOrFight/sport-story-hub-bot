import { Delete, Path, Post, Route, Tags } from "tsoa";
import { FileService } from "../services/file.service";

@Route("/api/file")
@Tags("Files")
export class FileController {
  private fileService = new FileService();

  @Post("/add")
  async addFile(payload: Express.Multer.File[]) {
    return this.fileService.addFile(payload);
  }

  @Delete("/delete")
  async deleteFile(@Path() id: number) {
    return this.fileService.deleteFile(id);
  }
}
