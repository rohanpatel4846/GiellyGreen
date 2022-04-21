using GiellyGreen.Models;
using GiellyGreen.Models.Image;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    [Authorize]
    public class ImageUploaderController : ApiController
    {
        public JSONResponse UploadImage(ImageUploaderViewModel model)
        {
            var response = new JSONResponse();
            String path = HttpContext.Current.Server.MapPath("~/SupplierLogos");
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            string imageName = Guid.NewGuid().ToString("N") + model.ImageType;
            string imgPath = Path.Combine(path, imageName);
            byte[] imageBytes = Convert.FromBase64String(model.Image64STR);
            File.WriteAllBytes(imgPath, imageBytes);

            response.ResponseStatus = 1;
            response.Message = "Image Uplaoded";
            response.Result = imageName;

            return response;
        }

        public JSONResponse GetImage(String imageName)
        {
            var response = new JSONResponse();
            String path = HttpContext.Current.Server.MapPath("~/SupplierLogos");
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            string imgPath = Path.Combine(path, imageName);
            string imageBase64 = Convert.ToBase64String(File.ReadAllBytes(imgPath));


            response.ResponseStatus = 1;
            response.Message = "Image Found";
            response.Result = imageBase64;

            return response;
        }

    }
}
