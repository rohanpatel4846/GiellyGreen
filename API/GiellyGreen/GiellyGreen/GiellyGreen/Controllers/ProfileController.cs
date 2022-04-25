using AutoMapper;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using DataAccessLayer.Services;
using GiellyGreen.Models;
using GiellyGreen.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    [Authorize]
    public class ProfileController : ApiController
    {
        private readonly IGiellyGreen giellyGreen = new GiellyGreenRepository();

        [HttpGet]
        public JSONResponse GetProfile()
        {
            var response = new JSONResponse();
            try
            {
                var supplierList = giellyGreen.GetLastProfile();
                response.ResponseStatus = 1;
                response.Message = "Record Found";
                response.Result = supplierList;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        [HttpPost]
        public JSONResponse EditAddProfile(ProfileViewModal model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<ProfileViewModal, profile>()));
                    var ProfileObj = mapper.Map<ProfileViewModal, profile>(model);
                    var result = giellyGreen.PostPutProfile(ProfileObj);
                    if(result == 1)
                    {
                        response.ResponseStatus = 1;
                        response.Message = "Records Added";
                        response.Result = result;
                    }
                    else
                    {
                        response.Message = "Error";
                        response.Result = result;
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
