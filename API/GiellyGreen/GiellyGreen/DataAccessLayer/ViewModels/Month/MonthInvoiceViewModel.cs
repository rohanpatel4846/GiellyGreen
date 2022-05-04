using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GiellyGreen.Models.Month
{
    public class MonthInvoiceViewModel
    {
        public int id { get; set; } = 0;
        public int monthNUM { get; set; }
        public int yearNUM { get; set; }
        public string Custom1_Name { get; set; } = "Custom1";
        public string Custom2_Name { get; set; } = "Custom2";
        public string Custom3_Name { get; set; } = "Custom3";
        public string Custom4_Name { get; set; } = "Custom4";
        public string Custom5_Name { get; set; } = "Custom5";
        public System.DateTime InvoiceDate { get; set; }
        public int VAT { get; set; } = 0;
        public string InvoiceReferenceNumber { get; set; }
    }
}