using DataAccessLayer.Interface;
using DataAccessLayer.Services;
using GiellyGreen.Classes;
using GiellyGreen.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Web;
using System.Web.Http;

namespace GiellyGreen.Controllers
{
    [Authorize]
    public class EmailController : ApiController
    {
        private readonly IGiellyGreen giellyGreen = new GiellyGreenRepository();
        [HttpPost]
        public JSONResponse SendEmail(int[] InvoiceIds)
        {
            InvoiceIds = InvoiceIds.Where(val => val != 0).ToArray();
            var response = new JSONResponse();
            try
            {
                foreach(var InvoiceId in InvoiceIds)
                {
                    dynamic invoice = giellyGreen.GetInvoice(InvoiceId)[0];
                    dynamic monthInvoice = giellyGreen.GetMonthInvoice(invoice.MonthId)[0];
                    dynamic supplier = giellyGreen.GetSuppliers(invoice.SupplierId)[0];
                    dynamic image = giellyGreen.GetImages(supplier.ImageId)[0];
                    dynamic profile = giellyGreen.GetProfile();

                    var RecievingCompany = "Gielly Green Limited";

                    var fromAddress = new MailAddress(System.Configuration.ConfigurationManager.AppSettings["fromEmail"], System.Configuration.ConfigurationManager.AppSettings["fromName"]);
                    var toAddress = new MailAddress(supplier.EmailAddress, supplier.SupplierName);
                    string fromPassword = System.Configuration.ConfigurationManager.AppSettings["fromPassword"];
                    string subject = "Your invoice for the " + CommonFunctions.MonthNumbertoMonthName(monthInvoice.monthNUM) + ", " + monthInvoice.yearNUM;
                    string body = "Please find attached a self-billed invoice to " + RecievingCompany + ", prepared on your behalf, as per the agreement.\nRegard\nGielly Green Limited";
                    
                    Byte[] res = CommonFunctions.generatePDF(invoice, monthInvoice, supplier, image, profile);

                    var smtp = new SmtpClient
                    {
                        Host = "smtp.gmail.com",
                        Port = 587,
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                    };

                    var message = new MailMessage(fromAddress, toAddress);
                    message.Subject = subject;
                    message.Body = body;
                    message.Attachments.Add(new Attachment(new MemoryStream(res), supplier.SupplierReferenceNumber + "_Invoice.pdf"));
                    smtp.Send(message);
                }

                response.ResponseStatus = 1;
                response.Message = "Email Sent";
                response.Result = 1;
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
