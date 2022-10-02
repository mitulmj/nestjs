import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import * as crypto from 'crypto';

@Injectable()
export class CommonService {
  async encrypt(text: string) {
    try {
      if (text) {
        const algorithm = 'aes-192-cbc';
        const password = 'zB&rq_j2x!V3P3zS';
        const key = crypto.scryptSync(password, 'salt', 24);
        const iv = Buffer.alloc(16, 0);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(String(text), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
      } else {
        return '';
      }
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  async decrypt(text: string) {
    try {
      if (text) {
        const algorithm = 'aes-192-cbc';
        const password = 'zB&rq_j2x!V3P3zS';
        const key = crypto.scryptSync(password, 'salt', 24);
        const iv = Buffer.alloc(16, 0);
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }
  }

  async passwordEncrypt(password: string) {
    return this.md5String(password);
  }

  async md5String(data: any) {
    return crypto.createHash('md5').update(data).digest('hex');
  }

//   currentDate() {
//     return moment().utc().format();
//   }

  async validateData(value: any) {
    const response = {
      status: 'error',
      message: 'Oops! Something went wrong.',
      data: [] as any,
    };
    try {
      //TODO : messsage should display in a string format from object format
      const validated = await validate(value, {
        validationError: { target: false, value: false },
      });
      if (validated.length > 0) {
        const key = Object.keys(validated[0].constraints)[0];
        const message = validated[0].constraints[key];
        response.message = message;
        return response;
      }
      response.status = 'success';
      response.message = '';
      return response;
    } catch (error) {
      response.message = error.message;
      return response;
    }
  }

  async generalSlug(text: string) {
    if (text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
    }
  }

  async validateOneMBImage(file: any) {
    const response = {
      status: 'error',
      message: 'Oops! Something went wrong.',
      data: [] as any,
    };
    try {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        response.message =
          'Please enter proper aadhar image. Only [.jpg, .jpeg, .png] type of image is allowed to upload.';
        return response;
      }
      if (file.size > 1000000) {
        response.message = 'Image should be less than 1mb.';
        return response;
      }
      response.status = 'success';
      response.message = 'Image uploaded successfully.';
      return response;
    } catch (error) {
      response.message = error.message;
      return response;
    }
  }

//   async axiosGet(requestedUrl: string) {
//     return axios
//       .request({
//         method: 'GET',
//         url: process.env.RAPID_API_URL + requestedUrl,
//         headers: {
//           'X-RapidAPI-Key': process.env.RAPID_API_KEY,
//           'X-RapidAPI-Host': process.env.RAPID_API_HOST,
//         },
//       })
//       .then((response) => response.data);
//   }
}
