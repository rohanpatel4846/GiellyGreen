using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GiellyGreen.Models.Supplier
{
    public class SupplierViewModel
    {
        public int id { get; set; } = 0;
        [Required]
        public string SupplierName { get; set; }
        [Required]
        public string SupplierReferenceNumber { get; set; }
        public string BusinessAddress { get; set; }
        [Required, EmailAddress]
        public string EmailAddress { get; set; }
        public Nullable<decimal> PhoneNumber { get; set; }
        public string CompanyRegisterNumber { get; set; }
        public string VATNumber { get; set; }
        public string TAXReference { get; set; }
        public string CompanyRegisteredAddress { get; set; }
        public Nullable<bool> isActive { get; set; } = false;
        public Nullable<int> ImageId { get; set; }
    }
}