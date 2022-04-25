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
    public class EmailController : ApiController
    {
        [HttpPost]
        public JSONResponse SendEmail(int[] InvoiceIds)
        {
            InvoiceIds = InvoiceIds.Where(val => val != 0).ToArray();
            var response = new JSONResponse();
            try
            {
                var Invoice = new InvoiceController();
                var Supplier = new SupplierController();
                var MonthInvoice = new MonthInvoiceController();
                var Image = new ImageController();
                var Profile = new ProfileController();

                foreach(var InvoiceId in InvoiceIds)
                {
                    dynamic invoice = Invoice.Get(InvoiceId).Result[0];
                    dynamic monthInvoice = MonthInvoice.Get(invoice.MonthId).Result[0];
                    dynamic supplier = Supplier.ALL(invoice.SupplierId).Result[0];
                    dynamic image = Image.Get(supplier.ImageId).Result[0];
                    dynamic profile = Profile.GetProfile().Result;

                    var RecievingCompany = "Gielly Green Limited";

                    var fromAddress = new MailAddress(System.Configuration.ConfigurationManager.AppSettings["fromEmail"], System.Configuration.ConfigurationManager.AppSettings["fromName"]);
                    var toAddress = new MailAddress(supplier.EmailAddress, supplier.SupplierName);
                    string fromPassword = @"2#RD3R%'\VC+pG6v";
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
                    message.Attachments.Add(new Attachment(new MemoryStream(res), "Invoice.pdf"));
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
