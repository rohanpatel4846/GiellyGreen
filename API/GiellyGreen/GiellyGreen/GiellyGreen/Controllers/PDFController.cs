using GiellyGreen.Classes;
using GiellyGreen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    public class PDFController : ApiController
    {
        [HttpPost]
        public JSONResponse GetPDF(int[] InvoiceIds)
        {
            var response = new JSONResponse();
            try
            {
                var Invoice = new InvoiceController();
                var Supplier = new SupplierController();
                var MonthInvoice = new MonthInvoiceController();
                List<dynamic> Pdfs = new List<dynamic>();

                foreach (var InvoiceId in InvoiceIds)
                {
                    dynamic invoice = Invoice.Get(InvoiceId).Result[0];
                    dynamic monthInvoice = MonthInvoice.Get(invoice.MonthId).Result[0];
                    dynamic supplier = Supplier.ALL(invoice.SupplierId).Result[0];

                    Byte[] res = CommonFunctions.generatePDF(invoice, monthInvoice, supplier);
                    Pdfs.Add(res);
                }

                response.Message = "Pdfs Generated";
                response.Result = Pdfs;
            }
            catch(Exception ex)
            {
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }
    }
}
