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
using System.Web;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    public class PDFController : ApiController
    {
        [HttpPost]
        public JSONResponse GetPDF(int[] InvoiceIds)
        {
            InvoiceIds = InvoiceIds.Where(val => val != 0).ToArray();
            var response = new JSONResponse();
            try
            {
                var Invoice = new InvoiceController();
                var Supplier = new SupplierController();
                var MonthInvoice = new MonthInvoiceController();
                var Image = new ImageController();
                String path = HttpContext.Current.Server.MapPath("~/SupplierLogos");

                List<dynamic> Pdfs = new List<dynamic>();

                foreach (var InvoiceId in InvoiceIds)
                {
                    dynamic invoice = Invoice.Get(InvoiceId).Result[0];
                    dynamic monthInvoice = MonthInvoice.Get(invoice.MonthId).Result[0];
                    dynamic supplier = Supplier.ALL(invoice.SupplierId).Result[0];
                    dynamic image = Image.Get(supplier.ImageId).Result[0];

                    Byte[] res = CommonFunctions.generatePDF(invoice, monthInvoice, supplier, image);
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
                string pdfBase64 = Convert.ToBase64String(MergedPDF);
                response.Message = "Pdfs Generated";
                response.Result = pdfBase64;
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
