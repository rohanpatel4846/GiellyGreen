using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;

namespace GiellyGreen.Classes
{
    public class CommonFunctions
    {
        public static string MonthNumbertoMonthName(int num)
        {
            switch (num)
            {
                case 1: return "January";
                case 2: return "February";
                case 3: return "March";
                case 4: return "April";
                case 5: return "May";
                case 6: return "June";
                case 7: return "July";
                case 8: return "August";
                case 9: return "September";
                case 10: return "October";
                case 11: return "November";
                case 12: return "December";
                default: return "Invalid Month";
            }
        }

        public static string generateHTMLpdfString()
        {
            string contents = File.ReadAllText(HttpContext.Current.Server.MapPath(@"\Pdf Template\htmlFormat.html"));
            StringBuilder htmlSTR = new StringBuilder();
            htmlSTR.AppendLine(contents);
            return htmlSTR.ToString();
        }

        public static string generateCSSpdfString()
        {
            string contents = File.ReadAllText(HttpContext.Current.Server.MapPath(@"\Pdf Template\cssFormat.css"));
            StringBuilder cssSTR = new StringBuilder();
            cssSTR.AppendLine(contents);
            return cssSTR.ToString();
        }

        public static Byte[] generatePDF(dynamic invoice, dynamic monthInvoice, dynamic supplier, dynamic image)
        {
            Byte[] res = null;

            decimal subtotal = invoice.HairService + invoice.BeautyService + invoice.Custom1 + invoice.Custom2 + invoice.Custom3 + invoice.Custom4 + invoice.Custom5;
            decimal vattotal = (subtotal * 20) / 100;
            decimal balanceDue = (subtotal + vattotal) - invoice.AdvancePay;

            var imageName = image.url;
            string imageBase64 = "";
            string imgPath = "";
            try
            {
                String path = HttpContext.Current.Server.MapPath("~/SupplierLogos");
                imgPath = Path.Combine(path, imageName);
                imageBase64 = Convert.ToBase64String(File.ReadAllBytes(imgPath));
            }
            catch (Exception)
            {
                imageBase64 = "";
            }

            String htmlStr = CommonFunctions.generateHTMLpdfString();

            var invoiceDate = ((monthInvoice.InvoiceDate).ToString()).Split(' ')[0];

            #region dynamic values
            imgPath = imgPath.Replace("//", "/");
            htmlStr = htmlStr.Replace("{{pdfLogo_Path}}", imgPath);
            htmlStr = htmlStr.Replace("{{pdfInvoiceDate}}", invoiceDate + "");
            htmlStr = htmlStr.Replace("{{pdfInvoiceReference}}", monthInvoice.InvoiceReferenceNumber + "");
            htmlStr = htmlStr.Replace("{{pdfAddress1}}", supplier.BusinessAddress + "");
            htmlStr = htmlStr.Replace("{{pdfAddress2}}", "Address");
            htmlStr = htmlStr.Replace("{{pdfHairService}}", invoice.HairService + "");
            htmlStr = htmlStr.Replace("{{pdfBeautyService}}", invoice.BeautyService + "");
            htmlStr = htmlStr.Replace("{{pdfCustom1}}", invoice.Custom1 + "");
            htmlStr = htmlStr.Replace("{{pdfCustom2}}", invoice.Custom2 + "");
            htmlStr = htmlStr.Replace("{{pdfCustom3}}", invoice.Custom3 + "");
            htmlStr = htmlStr.Replace("{{pdfCustom4}}", invoice.Custom4 + "");
            htmlStr = htmlStr.Replace("{{pdfCustom5}}", invoice.Custom5 + "");
            htmlStr = htmlStr.Replace("{{pdfSubtotal}}", subtotal + "");
            htmlStr = htmlStr.Replace("{{pdfVatTotal}}", vattotal + "");
            htmlStr = htmlStr.Replace("{{pdfAdvancePaid}}", invoice.AdvancePay + "");
            htmlStr = htmlStr.Replace("{{pdfBalanceDue}}", balanceDue + "");
            htmlStr = htmlStr.Replace("{{Custom1_Head}}", monthInvoice.Custom1_Name + "");
            htmlStr = htmlStr.Replace("{{Custom2_Head}}", monthInvoice.Custom2_Name + "");
            htmlStr = htmlStr.Replace("{{Custom3_Head}}", monthInvoice.Custom3_Name + "");
            htmlStr = htmlStr.Replace("{{Custom4_Head}}", monthInvoice.Custom4_Name + "");
            htmlStr = htmlStr.Replace("{{Custom5_Head}}", monthInvoice.Custom5_Name + "");

            if(invoice.Custom1 == 0)
            {
                htmlStr = htmlStr.Replace("{{Custom1_Comment_S}}", "<!--");
                htmlStr = htmlStr.Replace("{{Custom1_Comment_E}}", "-->");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{Custom1_Comment_S}}", "");
                htmlStr = htmlStr.Replace("{{Custom1_Comment_E}}", "");
            }

            if (invoice.Custom2 == 0)
            {
                htmlStr = htmlStr.Replace("{{Custom2_Comment_S}}", "<!--");
                htmlStr = htmlStr.Replace("{{Custom2_Comment_E}}", "-->");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{Custom2_Comment_S}}", "");
                htmlStr = htmlStr.Replace("{{Custom2_Comment_E}}", "");
            }

            if (invoice.Custom3 == 0)
            {
                htmlStr = htmlStr.Replace("{{Custom3_Comment_S}}", "<!--");
                htmlStr = htmlStr.Replace("{{Custom3_Comment_E}}", "-->");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{Custom3_Comment_S}}", "");
                htmlStr = htmlStr.Replace("{{Custom3_Comment_E}}", "");
            }

            if (invoice.Custom4 == 0)
            {
                htmlStr = htmlStr.Replace("{{Custom4_Comment_S}}", "<!--");
                htmlStr = htmlStr.Replace("{{Custom4_Comment_E}}", "-->");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{Custom4_Comment_S}}", "");
                htmlStr = htmlStr.Replace("{{Custom4_Comment_E}}", "");
            }

            if (invoice.Custom5 == 0)
            {
                htmlStr = htmlStr.Replace("{{Custom5_Comment_S}}", "<!--");
                htmlStr = htmlStr.Replace("{{Custom5_Comment_E}}", "-->");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{Custom5_Comment_S}}", "");
                htmlStr = htmlStr.Replace("{{Custom5_Comment_E}}", "");
            }

            if (invoice.HairService == 0)
            {
                htmlStr = htmlStr.Replace("{{HairService_Comment_S}}", "<!--");
                htmlStr = htmlStr.Replace("{{HairService_Comment_E}}", "-->");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{HairService_Comment_S}}", "");
                htmlStr = htmlStr.Replace("{{HairService_Comment_E}}", "");
            }

            if (invoice.BeautyService == 0)
            {
                htmlStr = htmlStr.Replace("{{BeautyService_Comment_S}}", "<!--");
                htmlStr = htmlStr.Replace("{{BeautyService_Comment_E}}", "-->");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{BeautyService_Comment_S}}", "");
                htmlStr = htmlStr.Replace("{{BeautyService_Comment_E}}", "");
            }

            if (String.IsNullOrEmpty((supplier.TAXReference) + ""))
            {
                htmlStr = htmlStr.Replace("{{pdfTaxReference}}", "");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{pdfTaxReference}}", "Tax Reference : " + supplier.TAXReference + "");
            }

            if (String.IsNullOrEmpty((supplier.VATNumber) + ""))
            {
                htmlStr = htmlStr.Replace("{{pdfVatNumber}}", "");
            }
            else
            {
                htmlStr = htmlStr.Replace("{{pdfVatNumber}}", "VAT Number : " + supplier.VATNumber + "");
            }
            #endregion

            String cssStr = CommonFunctions.generateCSSpdfString();

            using (var memoryStream = new MemoryStream())
            {
                var document = new Document(PageSize.A4);
                var writer = PdfWriter.GetInstance(document, memoryStream);
                document.Open();
                using (var cssMemoryStream = new MemoryStream(Encoding.UTF8.GetBytes(cssStr)))
                {
                    using (var htmlMemoryStream = new MemoryStream(Encoding.UTF8.GetBytes(htmlStr)))
                    {
                        XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, htmlMemoryStream, cssMemoryStream);
                    }
                }
                document.Close();
                res = memoryStream.ToArray();
            }
            return res;
        }
    }
}