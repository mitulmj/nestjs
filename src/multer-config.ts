import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
    dest: './uploads/profile-photos',
};

// Multer upload options
export const multerOptions = {
    // Enable file size limits
    // limits: {
    //     fileSize: 1000000,
    // },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        const fileSize = parseInt(req.headers["content-length"])
        let ext = extname(file.originalname);
        if(fileSize > 1000000){
            cb(new HttpException(`Maximum file size 1mb`, HttpStatus.BAD_REQUEST), false);
        }
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            // Allow storage of file
            // console.log("file filter",file)
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = multerConfig.dest;
            // Create folder if doesn't exist
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath,{recursive:true});
            }
            cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            // Calling the callback passing the random name generated with the original extension name
            const uniqSufix = Date.now() + '-'+ Math.round(Math.random()*1e9);
            const ext = extname(file.originalname);
            const filename = `${file.originalname.split('.')[0]}-${uniqSufix}-${ext}`;
            cb(null, `${file.originalname.split('.')[0]}-${uniqSufix}${ext}`);
        },
    }),
};