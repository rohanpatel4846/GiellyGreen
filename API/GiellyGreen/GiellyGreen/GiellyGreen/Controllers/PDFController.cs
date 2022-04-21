using GiellyGreen.Classes;
using GiellyGreen.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
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

                Byte[] MergedPDF = null;

                using (var memoryStream = new MemoryStream())
                {
                    var document = new Document(PageSize.A4);
                    PdfCopy writer = new PdfCopy(document, memoryStream);
                    document.Open();
                    foreach (var pdf in Pdfs)
                    {
                        PdfReader reader = new PdfReader(pdf);
                        reader.ConsolidateNamedDestinations();
                        for (int i = 1; i <= reader.NumberOfPages; i++)
                        {
                            PdfImportedPage page = writer.GetImportedPage(reader, i);
                            writer.AddPage(page);
                        }
                        reader.Close();
                    }
                    writer.Close();
                    document.Close();
                    MergedPDF = memoryStream.ToArray();
                }

                response.Message = "Pdfs Generated";
                response.Result = MergedPDF;
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
