import multer from 'multer';
import path from 'path';

const imagestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:\\\\Senior_Project2\\\\PSPark_Images');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const imageupload = multer({ storage: imagestorage });

export default imageupload;
