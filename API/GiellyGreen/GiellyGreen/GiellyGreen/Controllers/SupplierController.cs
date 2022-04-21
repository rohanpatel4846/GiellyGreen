using AutoMapper;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using DataAccessLayer.Services;
using GiellyGreen.Models;
using GiellyGreen.Models.Supplier;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    [Authorize]
    public class SupplierController : ApiController
    {
        private readonly IGiellyGreen giellyGreen = new GiellyGreenRepository();

        [HttpGet]
        [Route("api/Supplier/All/{id?}")]
        public JSONResponse ALL(int id = 0)
        {
            var response = new JSONResponse();
            try
            {
                var supplierList = giellyGreen.GetSuppliers(id);
                response.ResponseStatus = 1;
                response.Message = "Records Found (" + supplierList.Count() + ")";
                response.Result = supplierList;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        [HttpGet]
        [Route("api/Supplier/onlyActive")]
        public JSONResponse onlyActive()
        {
            var response = new JSONResponse();
            try
            {
                var supplierList = giellyGreen.GetSuppliers(0,true);
                response.ResponseStatus = 1;
                response.Message = "Records Found (" + supplierList.Count() + ")";
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
        public JSONResponse PostSupplier(SupplierViewModel model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<SupplierViewModel, Supplier>()));
                    var SupplierObj = mapper.Map<SupplierViewModel, Supplier>(model);
                    var result = giellyGreen.PostPutSuppliers(SupplierObj);
                    response.ResponseStatus = 1;
                    response.Message = "Records Added";
                    response.Result = result;
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

        [HttpPut]
        public JSONResponse PutSupplier(int id, SupplierViewModel model)
        {
            var response = new JSONResponse();
            try
            {
                if (ModelState.IsValid)
                {
                    Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<SupplierViewModel, Supplier>()));
                    model.id = id;
                    var SupplierObj = mapper.Map<SupplierViewModel, Supplier>(model);
                    var result = giellyGreen.PostPutSuppliers(SupplierObj);
                    response.ResponseStatus = 1;
                    response.Message = "Records Updated";
                    response.Result = result;
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

        [HttpPatch]
        public JSONResponse PatchActive(int id, bool isActive)
        {
            var response = new JSONResponse();
            try
            {
                response.ResponseStatus = 1;
                var result = giellyGreen.PatchActiveSuppliers(id, isActive);
                response.Message = "Records Updated";
                response.Result = result;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }

        [HttpDelete]
        public JSONResponse DeleteSupplier(int id)
        {
            var response = new JSONResponse();
            try
            {
                response.ResponseStatus = 1;
                var result = giellyGreen.DeleteSupplier(id);
                if(result == 0)
                {
                    response.Message = "Record not found";
                    response.Result = result;
                }
                else if(result == -1)
                {
                    response.Message = "Record Cannot be delected because of dependency";
                    response.Result = result;
                }
                else
                {
                    response.Message = "Records Deleted";
                    response.Result = result;
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
