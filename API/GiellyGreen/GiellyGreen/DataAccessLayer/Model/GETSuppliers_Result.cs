//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DataAccessLayer.Model
{
    using System;
    
    public partial class GETSuppliers_Result
    {
        public int id { get; set; }
        public string SupplierName { get; set; }
        public string SupplierReferenceNumber { get; set; }
        public string BusinessAddress { get; set; }
        public string EmailAddress { get; set; }
        public Nullable<decimal> PhoneNumber { get; set; }
        public Nullable<decimal> CompanyRegisterNumber { get; set; }
        public string VATNumber { get; set; }
        public string TAXReference { get; set; }
        public string CompanyRegisteredAddress { get; set; }
        public Nullable<bool> isActive { get; set; }
        public Nullable<int> ImageId { get; set; }
    }
}
