using DataAccessLayer.Interface;
using DataAccessLayer.Services;
using GiellyGreen.Models;
using GiellyGreen.Models.Image;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    [Authorize]
    public class ImageController : ApiController
    {
        private readonly IGiellyGreen giellyGreen = new GiellyGreenRepository();
        public JSONResponse Get(int id=0)
        {
            var response = new JSONResponse();
            try
            {
                var imageList = giellyGreen.GetImages(id);
                response.ResponseStatus = 1;
                response.Message = "Records Found (" + imageList.Count() + ")";
                response.Result = imageList;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        public JSONResponse Post(ImageViewModel model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    var result = giellyGreen.PostImages(0, model.url);
                    if (result > 0)
                    {
                        response.ResponseStatus = 1;
                        response.Message = "Record Added";
                        response.Result = result;
                    }
                    else
                    {
                        response.Message = "Error Occured";
                    }
                }
                else
                {
                    var allErrors = ModelState.Values.SelectMany(x => x.Errors);
                    response.Message = "Error";
                    response.Result = allErrors;
                }
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        public JSONResponse Put(int id, ImageViewModel model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    var result = giellyGreen.PostImages(id, model.url);
                    if (result == 1)
                    {
                        response.ResponseStatus = 1;
                        response.Message = "Record Updated";
                    }
                    else
                    {
                        response.Message = "Error Occured";
                    }
                }
                else
                {
                    var allErrors = ModelState.Values.SelectMany(x => x.Errors);
                    response.Message = "Error";
                    response.Result = allErrors;
                }
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }
    }
}
