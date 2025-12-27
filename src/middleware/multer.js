import multer from "multer";
const memoryStorage = multer.memoryStorage()
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const uploadCv = multer({
  memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

//TODO: I have to fix file mimetype properly
export const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype !== "img/*") {
      return cb(new Error("Only image  are allowed"), false);
    }
    cb(null, true);
  },
});