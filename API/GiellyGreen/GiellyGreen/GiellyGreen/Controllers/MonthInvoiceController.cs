using AutoMapper;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using DataAccessLayer.Services;
using GiellyGreen.Models;
using GiellyGreen.Models.Month;
using System;
using System.Configuration;
using System.Linq;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    [Authorize]
    public class MonthInvoiceController : ApiController
    {
        private readonly IGiellyGreen giellyGreen = new GiellyGreenRepository();
        public JSONResponse Get(int id = 0)
        {
            var response = new JSONResponse();
            try
            {
                var monthInvoiceList = giellyGreen.GetMonthInvoice(id);
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

        public JSONResponse Post(MonthInvoiceViewModel model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<MonthInvoiceViewModel, MonthInvoice>()));
                    var MonthInvoiceObj = mapper.Map<MonthInvoiceViewModel, MonthInvoice>(model);
                    var result = giellyGreen.PostPutMonthInvoice(MonthInvoiceObj);
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

        public JSONResponse Put(int id, MonthInvoiceViewModel model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<MonthInvoiceViewModel, MonthInvoice>()));
                    model.id = id;
                    model.InvoiceDate = model.InvoiceDate.AddDays(1);
                    var MonthInvoiceObj = mapper.Map<MonthInvoiceViewModel, MonthInvoice>(model);
                    var result = giellyGreen.PostPutMonthInvoice(MonthInvoiceObj);
                    if (result == 1)
                    {
                        response.ResponseStatus = 1;
                        response.Message = "Record Updated";
                        response.Result= result;
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
