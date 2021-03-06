using DataAccessLayer.Interface;
using DataAccessLayer.Services;
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
    [Authorize]
    public class PDFController : ApiController
    {
        private readonly IGiellyGreen giellyGreen = new GiellyGreenRepository();
        [HttpPost]
        public JSONResponse GetPDF(int[] InvoiceIds)
        {
            InvoiceIds = InvoiceIds.Where(val => val != 0).ToArray();
            var response = new JSONResponse();
            try
            {
                String path = HttpContext.Current.Server.MapPath("~/SupplierLogos");

                List<dynamic> Pdfs = new List<dynamic>();

                foreach (var InvoiceId in InvoiceIds)
                {
                    dynamic invoice = giellyGreen.GetInvoice(InvoiceId)[0];
                    dynamic monthInvoice = giellyGreen.GetMonthInvoice(invoice.MonthId)[0];
                    dynamic supplier = giellyGreen.GetSuppliers(invoice.SupplierId)[0];
                    dynamic image = giellyGreen.GetImages(supplier.ImageId)[0];
                    dynamic profile = giellyGreen.GetProfile();

                    Byte[] res = CommonFunctions.generatePDF(invoice, monthInvoice, supplier, image, profile);
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
                response.ResponseStatus = 0;
                response.Message = ex.Message;
                response.Result = ex;
            }
            return response;
        }
    }
}
