using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GiellyGreen.Models.MonthInvoice
{
    public class MonthInvoiceViewModal
    {
        public int id { get; set; } = 0;
        [Required]
        public int monthNUM { get; set; }
        [Required]
        public int yearNUM { get; set; }
        public string Custom1_Name { get; set; }
        public string Custom2_Name { get; set; }
        public string Custom3_Name { get; set; }
        public string Custom4_Name { get; set; }
        public string Custom5_Name { get; set; }
        [Required]
        public System.DateTime InvoiceDate { get; set; }
        [Required]
        public int VAT { get; set; }
        [Required]
        public string InvoiceReferenceNumber { get; set; }
    }
}