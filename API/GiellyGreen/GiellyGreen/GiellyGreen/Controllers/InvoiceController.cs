using AutoMapper;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using DataAccessLayer.Services;
using GiellyGreen.Models;
using GiellyGreen.Models.Invoice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    [Authorize]
    public class InvoiceController : ApiController
    {
        private readonly IGiellyGreen giellyGreen = new GiellyGreenRepository();
        public JSONResponse Get(int id = 0, int monthInvoiceId = 0)
        {
            var response = new JSONResponse();
            try
            {
                var monthInvoiceList = giellyGreen.GetInvoice(id, monthInvoiceId);
                response.ResponseStatus = 1;
                response.Message = "Records Found (" + monthInvoiceList.Count() + ")";
                response.Result = monthInvoiceList;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        public JSONResponse Post(InvoiceViewModel model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<InvoiceViewModel, Invoice>()));
                    var InvoiceObj = mapper.Map<InvoiceViewModel, Invoice>(model);
                    var result = giellyGreen.PostPutInvoice(InvoiceObj);
                    if (result == 1)
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

        public JSONResponse Put(int id, InvoiceViewModel model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<InvoiceViewModel, Invoice>()));
                    model.id = id;
                    var InvoiceObj = mapper.Map<InvoiceViewModel, Invoice>(model);
                    var result = giellyGreen.PostPutInvoice(InvoiceObj);
                    if (result == 1)
                    {
                        response.ResponseStatus = 1;
                        response.Message = "Record Updated";
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
    }
}
