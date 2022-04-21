using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GiellyGreen.Models.Invoice
{
    public class InvoiceViewModel
    {
        public int id { get; set; } = 0;
        public Nullable<int> MonthId { get; set; }
        public Nullable<int> SupplierId { get; set; }
        public Nullable<decimal> HairService { get; set; }
        public Nullable<decimal> BeautyService { get; set; }
        public Nullable<decimal> Custom1 { get; set; }
        public Nullable<decimal> Custom2 { get; set; }
        public Nullable<decimal> Custom3 { get; set; }
        public Nullable<decimal> Custom4 { get; set; }
        public Nullable<decimal> Custom5 { get; set; }
        public Nullable<decimal> AdvancePay { get; set; }
        public Nullable<bool> isApproved { get; set; } = false;
    }
}