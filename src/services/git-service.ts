import axios from 'axios';
import * as fs from 'fs';

class Git {
  static host = 'https://api.github.com/repos';
  static token: string = '';
  static owner: string = '';
  static repo: string = '';
  
  public static init(token:string, owner:string, repo:string) {
    this.token = token.trim();
    this.owner = owner.trim();
    this.repo = repo.trim();
  }

  private static doRequest(url: string, params: any) {
    url = `${this.host}/${this.owner}/${this.repo}${url}`;
    return axios.put(
        url,
        params,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
        }
      ).then(res => {
        return res.data;
      }).catch(err => { 
        return Promise.reject(err);
      });
  }

  public static async uploadImage(fileName: string, imagePath: string)
  {
    if (!fs.existsSync(imagePath)) {
        throw Error('image not found');
      }

      const content = fs.readFileSync(imagePath, 'base64');
      const url = `/contents/${fileName}`;
      const params = {
        message: "upload image",
        committer: {
          name: "parse-upload-image",
          email: "parseUploadImage@mail.com"
        },
        content
      };

      const result: any = await this.doRequest(url, params);
      console.log('result', result);
      return result.content.download_url;
  }
}

export default Git;