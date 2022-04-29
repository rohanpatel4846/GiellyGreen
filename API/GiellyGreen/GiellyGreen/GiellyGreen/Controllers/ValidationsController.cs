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
        public JSONResponse Email(string email)
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

        [HttpGet]
        [Route("api/Validate/SupplierRef")]
        public JSONResponse SupplierRef(string supplierRef)
        {
            var response = new JSONResponse();
            try
            {
                response.ResponseStatus = 1;
                response.Message = "Get Validation from Result";
                response.Result = giellyGreen.CheckSupplierRefValid(supplierRef);
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        [HttpGet]
        [Route("api/Validate/VATNumber")]
        public JSONResponse VATNumber(string vatNumber)
        {
            var response = new JSONResponse();
            try
            {
                response.ResponseStatus = 1;
                response.Message = "Get Validation from Result";
                response.Result = giellyGreen.CheckVATNumberValid(vatNumber);
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        [HttpGet]
        [Route("api/Validate/TAXReference")]
        public JSONResponse TAXReference(string taxReference)
        {
            var response = new JSONResponse();
            try
            {
                response.ResponseStatus = 1;
                response.Message = "Get Validation from Result";
                response.Result = giellyGreen.CheckTAXReferenceValid(taxReference);
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        [HttpGet]
        [Route("api/Validate/InvoiceReference")]
        public JSONResponse InvoiceReference(string invoiceRef)
        {
            var response = new JSONResponse();
            try
            {
                response.ResponseStatus = 1;
                response.Message = "Get Validation from Result";
                response.Result = giellyGreen.CheckInvoiceReferenceNumberValid(invoiceRef);
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
