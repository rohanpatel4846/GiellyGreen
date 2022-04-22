using DataAccessLayer.Interface;
using DataAccessLayer.Services;
using GiellyGreen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    [Authorize]
    public class ValidationsController : ApiController
    {
        private readonly IGiellyGreen giellyGreen = new GiellyGreenRepository();

        [HttpGet]
        [Route("api/Validate/Email")]
        public JSONResponse ALL(string email)
        {
            var response = new JSONResponse();
            try
            {
                response.ResponseStatus = 1;
                response.Message = "Get Validation from Result";
                response.Result = giellyGreen.CheckEmailValid(email);
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
